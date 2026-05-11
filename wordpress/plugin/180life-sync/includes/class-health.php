<?php
/**
 * Periodic Health Check.
 *
 * Calls the Next.js /api/wordpress-health diagnostic endpoint on a
 * schedule (default every 6 hours) and stores the result so it can be
 * surfaced in the Site Health tab of the admin settings page.
 *
 * If overall status drops to "broken" and an alert email address is
 * configured, sends an admin notification (debounced to one email per
 * status transition to avoid spam).
 *
 * @package OneEightyLife\Sync
 */

namespace OneEightyLife\Sync;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class HealthChecker {

	/**
	 * Hook into WP-Cron and AJAX.
	 */
	public static function register(): void {
		add_action( ONEEIGHTY_SYNC_CRON_HOOK, [ self::class, 'run' ] );
	}

	/**
	 * Schedule the recurring health check based on current settings.
	 * Idempotent — clears any existing schedule before reinstating.
	 */
	public static function schedule(): void {
		self::unschedule();

		$settings = Plugin::get_settings();
		if ( empty( $settings['health_check_enabled'] ) ) {
			return;
		}

		$frequency = $settings['health_check_freq'] ?? 'sixhourly';
		$valid     = [ 'hourly', 'sixhourly', 'twicedaily', 'daily' ];
		if ( ! in_array( $frequency, $valid, true ) ) {
			$frequency = 'sixhourly';
		}

		if ( ! wp_next_scheduled( ONEEIGHTY_SYNC_CRON_HOOK ) ) {
			wp_schedule_event( time() + 60, $frequency, ONEEIGHTY_SYNC_CRON_HOOK );
		}
	}

	/**
	 * Cancel the recurring health check (called on plugin deactivation
	 * or when the user disables it from settings).
	 */
	public static function unschedule(): void {
		$timestamp = wp_next_scheduled( ONEEIGHTY_SYNC_CRON_HOOK );
		while ( false !== $timestamp ) {
			wp_unschedule_event( $timestamp, ONEEIGHTY_SYNC_CRON_HOOK );
			$timestamp = wp_next_scheduled( ONEEIGHTY_SYNC_CRON_HOOK );
		}
	}

	/**
	 * Execute a health check now and store the result.
	 *
	 * @return array The health report from the API (or an error wrapper).
	 */
	public static function run(): array {
		$settings = Plugin::get_settings();
		$url      = $settings['health_check_url'] ?? '';
		$secret   = $settings['revalidation_secret'] ?? '';
		$bypass   = $settings['bypass_token'] ?? '';

		if ( empty( $url ) || empty( $secret ) ) {
			$result = [
				'overall'   => 'broken',
				'summary'   => 'Health check URL or revalidation secret not configured.',
				'checks'    => [],
				'timestamp' => time(),
				'error'     => 'config',
			];
			self::store( $result );
			return $result;
		}

		// Build URL with secret + optional bypass token as query params
		$request_url = add_query_arg( [ 'secret' => $secret ], $url );
		if ( ! empty( $bypass ) ) {
			$request_url = add_query_arg( 'x-vercel-protection-bypass', $bypass, $request_url );
		}

		$headers = [];
		if ( ! empty( $bypass ) ) {
			$headers['x-vercel-protection-bypass'] = $bypass;
		}

		$start    = microtime( true );
		$response = wp_remote_get(
			$request_url,
			[
				'headers'  => $headers,
				'timeout'  => 15,
			]
		);
		$elapsed_ms = (int) ( ( microtime( true ) - $start ) * 1000 );

		if ( is_wp_error( $response ) ) {
			$result = [
				'overall'    => 'broken',
				'summary'    => sprintf(
					/* translators: %s error message */
					__( 'Health check request failed: %s', '180life-sync' ),
					$response->get_error_message()
				),
				'checks'     => [],
				'timestamp'  => time(),
				'elapsed_ms' => $elapsed_ms,
				'error'      => 'transport',
			];
		} else {
			$status_code = wp_remote_retrieve_response_code( $response );
			$body        = wp_remote_retrieve_body( $response );
			$decoded     = json_decode( $body, true );

			if ( ! is_array( $decoded ) ) {
				$result = [
					'overall'    => 'broken',
					'summary'    => sprintf(
						/* translators: %d HTTP status */
						__( 'Health check returned non-JSON response (HTTP %d).', '180life-sync' ),
						$status_code
					),
					'checks'     => [],
					'timestamp'  => time(),
					'elapsed_ms' => $elapsed_ms,
					'error'      => 'parse',
					'http'       => $status_code,
				];
			} else {
				$result = array_merge(
					$decoded,
					[
						'timestamp'  => time(),
						'elapsed_ms' => $elapsed_ms,
						'http'       => $status_code,
					]
				);
			}
		}

		self::store( $result );
		self::maybe_alert( $result );

		Logger::log(
			'health',
			'(periodic check)',
			'',
			'cron',
			( 'healthy' === ( $result['overall'] ?? '' ) ) ? 'pass' : 'fail',
			$result['summary'] ?? '',
			$elapsed_ms
		);

		return $result;
	}

	/**
	 * Persist the latest health result.
	 */
	private static function store( array $result ): void {
		update_option( ONEEIGHTY_SYNC_HEALTH_KEY, $result, false );
	}

	/**
	 * Retrieve the most recent health result.
	 */
	public static function latest(): ?array {
		$health = get_option( ONEEIGHTY_SYNC_HEALTH_KEY, null );
		return is_array( $health ) ? $health : null;
	}

	/**
	 * Send an email alert if status transitioned to "broken" (and we
	 * haven't already sent one for this transition).
	 *
	 * Debounces by storing the last alerted overall status in the
	 * health option payload.
	 *
	 * Logs both decisions and outcomes to the activity log so editors
	 * can see why an alert did or didn't fire — the most common
	 * silent-failure mode is wp_mail() returning false because the
	 * WordPress host has no SMTP configured. The "Send Test Alert"
	 * button on the Site Health tab gives editors a way to verify
	 * delivery without waiting for a real outage.
	 */
	private static function maybe_alert( array $result ): void {
		$settings = Plugin::get_settings();
		$email    = trim( (string) ( $settings['health_alerts_email'] ?? '' ) );
		if ( empty( $email ) || ! is_email( $email ) ) {
			return;
		}

		$prior         = self::latest();
		$prior_overall = $prior['overall'] ?? null;
		$now_overall   = $result['overall'] ?? null;

		// Only alert on transition into "broken" (not on every broken check)
		if ( 'broken' !== $now_overall || 'broken' === $prior_overall ) {
			return;
		}

		$site = wp_parse_url( home_url(), PHP_URL_HOST );
		$subject = sprintf(
			/* translators: %s site domain */
			__( '[180 Life Sync] Site health: BROKEN — %s', '180life-sync' ),
			$site
		);

		$lines = [
			__( 'The periodic health check detected a problem with the Next.js integration.', '180life-sync' ),
			'',
			sprintf( __( 'Status: %s', '180life-sync' ), $now_overall ),
			sprintf( __( 'Summary: %s', '180life-sync' ), $result['summary'] ?? '' ),
			'',
			__( 'Per-check results:', '180life-sync' ),
		];
		foreach ( ( $result['checks'] ?? [] ) as $check ) {
			$lines[] = sprintf(
				'  [%s] %s — %s',
				strtoupper( $check['status'] ?? '?' ),
				$check['name'] ?? '',
				$check['message'] ?? ''
			);
		}
		$lines[] = '';
		$lines[] = sprintf(
			/* translators: %s settings page URL */
			__( 'Open the Site Health tab for more detail: %s', '180life-sync' ),
			admin_url( 'options-general.php?page=180life-sync&tab=health' )
		);

		// Capture wp_mail's return value so we can surface it in the
		// activity log. wp_mail() returns true on hand-off to PHPMailer,
		// false on rejection (commonly: no SMTP configured, sender
		// blocked, or PHPMailer threw). We can't see post-hand-off
		// delivery failures here without subscribing to the
		// `wp_mail_failed` hook.
		$sent = wp_mail( $email, $subject, implode( "\n", $lines ) );

		Logger::log(
			'health',
			'(alert email)',
			'',
			'cron-alert',
			$sent ? 'pass' : 'fail',
			$sent
				? sprintf(
					/* translators: %s recipient email */
					__( 'Alert email handed off to %s', '180life-sync' ),
					$email
				)
				: sprintf(
					/* translators: %s recipient email */
					__( 'wp_mail() returned false — alert NOT delivered to %s. Most likely cause: no SMTP plugin configured on this WordPress host (cPanel/sendmail blocked, no Mailgun/SendGrid/Postmark). Use the "Send Test Alert" button on the Site Health tab to confirm.', '180life-sync' ),
					$email
				),
			0
		);
	}

	/**
	 * Send a test alert email so editors can verify wp_mail delivery
	 * works on this WordPress host without waiting for a real outage.
	 *
	 * Most common silent failure: WordPress installs without an SMTP
	 * plugin can't deliver outbound mail because the underlying host
	 * blocks port 25 / sendmail. wp_mail() returns false in that case.
	 *
	 * @param string $recipient Recipient email address.
	 * @return array { ok: bool, message: string }
	 */
	public static function send_test_alert( string $recipient ): array {
		$recipient = trim( $recipient );
		if ( empty( $recipient ) || ! is_email( $recipient ) ) {
			return [
				'ok'      => false,
				'message' => __( 'Provide a valid recipient email address.', '180life-sync' ),
			];
		}

		// Capture any wp_mail_failed errors fired during this call so
		// we can surface PHPMailer's actual reason rather than just
		// "false". Hook is removed at the end so we don't leak.
		$failure_reason = '';
		$capture        = function ( $wp_error ) use ( &$failure_reason ) {
			if ( is_wp_error( $wp_error ) ) {
				$failure_reason = $wp_error->get_error_message();
			}
		};
		add_action( 'wp_mail_failed', $capture );

		$site    = wp_parse_url( home_url(), PHP_URL_HOST );
		$subject = sprintf(
			/* translators: %s site domain */
			__( '[180 Life Sync] Test alert — %s', '180life-sync' ),
			$site
		);
		$body = implode(
			"\n",
			[
				__( 'This is a test alert from the 180 Life Sync plugin.', '180life-sync' ),
				'',
				__( 'If you received this email, wp_mail() delivery is working on this WordPress host and you will receive real alerts when the live site integration breaks.', '180life-sync' ),
				'',
				sprintf(
					/* translators: %s site URL */
					__( 'Sent from: %s', '180life-sync' ),
					home_url()
				),
				sprintf(
					/* translators: %s ISO timestamp */
					__( 'Time: %s', '180life-sync' ),
					gmdate( 'c' )
				),
			]
		);

		$sent = wp_mail( $recipient, $subject, $body );

		remove_action( 'wp_mail_failed', $capture );

		Logger::log(
			'health',
			'(test alert email)',
			'',
			'admin/test-alert',
			$sent ? 'pass' : 'fail',
			$sent
				? sprintf(
					/* translators: %s recipient email */
					__( 'Test alert handed off to %s', '180life-sync' ),
					$recipient
				)
				: sprintf(
					/* translators: %s reason */
					__( 'Test alert failed: %s', '180life-sync' ),
					$failure_reason ?: __( 'wp_mail() returned false (no PHPMailer error captured)', '180life-sync' )
				),
			0
		);

		if ( $sent ) {
			return [
				'ok'      => true,
				'message' => sprintf(
					/* translators: %s recipient email */
					__( 'Test alert handed off to %s. Check the inbox (and spam folder) — if it doesn\'t arrive within a few minutes the host is silently dropping mail and you\'ll need an SMTP plugin (e.g. WP Mail SMTP or Postmark for WordPress).', '180life-sync' ),
					$recipient
				),
			];
		}

		return [
			'ok'      => false,
			'message' => sprintf(
				/* translators: %s reason */
				__( 'wp_mail() rejected the message: %s. Most common cause: this WordPress install has no SMTP plugin and the host blocks PHP sendmail. Install WP Mail SMTP or similar and configure a transactional sender.', '180life-sync' ),
				$failure_reason ?: __( 'no PHPMailer error captured', '180life-sync' )
			),
		];
	}
}
