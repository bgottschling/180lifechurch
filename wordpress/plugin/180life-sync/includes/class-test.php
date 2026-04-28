<?php
/**
 * AJAX handlers for the settings page:
 *   - "Test Connection" button (fires a sample webhook)
 *   - "Run Health Check Now" button (calls /api/wordpress-health)
 *
 * @package OneEightyLife\Sync
 */

namespace OneEightyLife\Sync;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class TestHandler {

	public static function register(): void {
		add_action( 'wp_ajax_180life_sync_test', [ self::class, 'handle_test' ] );
		add_action( 'wp_ajax_180life_sync_health', [ self::class, 'handle_health' ] );
	}

	/**
	 * Fire a one-off webhook with the configured (or freshly-submitted)
	 * settings and return the result.
	 */
	public static function handle_test(): void {
		check_ajax_referer( '180life_sync_test', 'nonce' );

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error(
				[ 'message' => __( 'You do not have permission to run this test.', '180life-sync' ) ],
				403
			);
		}

		// Allow the test to use freshly-submitted settings without saving first
		$override_settings = [];
		if ( isset( $_POST['webhook_url'] ) ) {
			$override_settings['webhook_url'] = esc_url_raw( wp_unslash( $_POST['webhook_url'] ) );
		}
		if ( isset( $_POST['revalidation_secret'] ) ) {
			$override_settings['revalidation_secret'] = sanitize_text_field( wp_unslash( $_POST['revalidation_secret'] ) );
		}
		if ( isset( $_POST['bypass_token'] ) ) {
			$override_settings['bypass_token'] = sanitize_text_field( wp_unslash( $_POST['bypass_token'] ) );
		}

		$settings = wp_parse_args( $override_settings, Plugin::get_settings() );

		if ( empty( $settings['webhook_url'] ) ) {
			wp_send_json_error( [ 'message' => __( 'Webhook URL is required.', '180life-sync' ) ] );
		}

		$result = Webhook::fire(
			[ 'wordpress' ],
			$settings,
			[
				'post_type'  => 'plugin',
				'post_title' => '(test connection)',
				'trigger'    => 'admin/test',
			]
		);

		if ( ! empty( $result['ok'] ) ) {
			wp_send_json_success(
				[
					'message'    => sprintf(
						/* translators: %1$d HTTP status code, %2$d round-trip ms */
						__( 'Connected successfully (HTTP %1$d in %2$d ms).', '180life-sync' ),
						$result['status'] ?? 200,
						$result['elapsed_ms'] ?? 0
					),
					'status'     => $result['status'] ?? 200,
					'elapsed_ms' => $result['elapsed_ms'] ?? 0,
					'body'       => $result['body'] ?? '',
				]
			);
		}

		wp_send_json_error(
			[
				'message' => sprintf(
					/* translators: %s error description */
					__( 'Test failed: %s', '180life-sync' ),
					$result['message'] ?? __( 'Unknown error', '180life-sync' )
				),
				'status'  => $result['status'] ?? 0,
				'body'    => $result['body'] ?? '',
			]
		);
	}

	/**
	 * Run an on-demand health check and return the result.
	 */
	public static function handle_health(): void {
		check_ajax_referer( '180life_sync_health', 'nonce' );

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error(
				[ 'message' => __( 'You do not have permission to run health checks.', '180life-sync' ) ],
				403
			);
		}

		$result = HealthChecker::run();
		wp_send_json_success( $result );
	}
}
