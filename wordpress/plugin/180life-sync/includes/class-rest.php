<?php
/**
 * Public REST endpoints exposed to the headless Next.js site.
 *
 * These complement WordPress's default REST API rather than replacing
 * it — content (Site Settings, Ministries, Staff, etc.) still flows
 * through wp/v2/. This namespace is for *plugin-managed* config that
 * doesn't live in a CPT: Google Analytics ID, Search Console
 * verification token, etc.
 *
 * Everything here is public (no auth) because the values are inherently
 * public — they end up in HTML the moment the site renders. Don't add
 * anything here that should stay secret (use auth + admin-ajax for
 * those, as the test/refresh handlers do).
 *
 * @package OneEightyLife\Sync
 */

namespace OneEightyLife\Sync;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Rest {

	const NAMESPACE = '180life-sync/v1';

	public static function register(): void {
		add_action( 'rest_api_init', [ self::class, 'register_routes' ] );
	}

	public static function register_routes(): void {
		register_rest_route(
			self::NAMESPACE,
			'/public-config',
			[
				'methods'             => 'GET',
				'callback'            => [ self::class, 'get_public_config' ],
				'permission_callback' => '__return_true',
			]
		);
	}

	/**
	 * GET /wp-json/180life-sync/v1/public-config
	 *
	 * Returns the editor-controlled values the headless site needs to
	 * inject into its <head>:
	 *   - analytics.enabled
	 *   - analytics.measurementId
	 *   - searchConsole.verification
	 *
	 * The Next.js fetcher caches this with the existing "wordpress" +
	 * "settings" cache tags so changes in wp-admin flow through the
	 * same revalidation path as other Site Settings edits.
	 */
	public static function get_public_config(): \WP_REST_Response {
		$settings = Plugin::get_settings();

		$ga_id    = (string) ( $settings['ga_measurement_id'] ?? '' );
		$ga_on    = ! empty( $settings['ga_enabled'] );
		$gsc      = (string) ( $settings['gsc_verification'] ?? '' );

		// If GA is toggled off, blank the ID in the response so the
		// frontend has zero chance of accidentally rendering a tag —
		// editors expect "off" to mean "off" regardless of whether
		// the ID is still saved.
		$response = [
			'analytics'     => [
				'enabled'       => $ga_on && '' !== $ga_id,
				'measurementId' => $ga_on ? $ga_id : '',
			],
			'searchConsole' => [
				'verification' => $gsc,
			],
		];

		return rest_ensure_response( $response );
	}
}
