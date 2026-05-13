<?php
/**
 * Main plugin orchestrator.
 *
 * Wires up all subsystems (settings page, webhook firing, AJAX
 * test handler, periodic health checks, asset enqueuing) and manages
 * plugin lifecycle hooks.
 *
 * @package OneEightyLife\Sync
 */

namespace OneEightyLife\Sync;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Plugin {

	/**
	 * Default settings used on first activation.
	 *
	 * @var array
	 */
	const DEFAULT_SETTINGS = [
		'enabled'              => true,
		'webhook_url'          => 'https://180lifechurch.org/api/revalidate',
		'revalidation_secret'  => '',
		'bypass_token'         => '',
		'health_check_url'     => 'https://180lifechurch.org/api/wordpress-health',
		'health_check_enabled' => true,
		'health_check_freq'    => 'sixhourly',
		'health_alerts_email'  => '',
		'consolidate_menus'    => true,
		// Analytics — Google Analytics 4 + Search Console verification.
		// All blank by default; editors enable on the Analytics tab.
		'ga_enabled'           => false,
		'ga_measurement_id'    => '',
		'gsc_verification'     => '',
		'tag_mapping'          => [
			'site_settings' => [ 'wordpress', 'settings' ],
			'staff'         => [ 'wordpress', 'leadership' ],
			'elder'         => [ 'wordpress', 'leadership' ],
			// Editorial subpages (about, partnership, baptism, stories,
			// immeasurably-more, new-to-faith) all live in the
			// content_page CPT. Saving any one of them busts the
			// "pages" tag so the headless site re-renders only the
			// affected route group, not the entire ministries grid etc.
			'content_page'  => [ 'wordpress', 'pages' ],
			// Ministry detail pages (life-groups, kids, students, etc).
			// Tagged "ministries" so saving any one of them busts the
			// shared cache used by both /ministries hub and the
			// individual /ministries/<slug> routes. Also drives the
			// homepage Ministry tiles via the Show on Homepage toggle.
			'ministry_page' => [ 'wordpress', 'ministries' ],
			// Legacy `ministry` CPT was removed in v2.2.0 - data merged
			// into ministry_page entries. sermon_series CPT was removed
			// in v1.1.0 - sermons sourced from Planning Center.
		],
	];

	/**
	 * Boot the plugin: hook everything into WordPress.
	 */
	public static function boot(): void {
		// Admin menu consolidation (must run before CPT registration so
		// the show_in_menu redirection takes effect)
		AdminMenu::register();

		// Settings page registration
		Settings::register();

		// Webhook firing on publish/update events
		Webhook::register();

		// AJAX handler for the "Test Connection" button + manual health check
		TestHandler::register();

		// Periodic health checks via WP-Cron
		HealthChecker::register();

		// Public REST endpoints (analytics config etc) consumed by the
		// headless Next.js site.
		Rest::register();

		// Enqueue admin assets only on our settings page
		add_action( 'admin_enqueue_scripts', [ self::class, 'enqueue_assets' ] );

		// Add a settings link from the Plugins screen
		add_filter(
			'plugin_action_links_' . plugin_basename( ONEEIGHTY_SYNC_FILE ),
			[ self::class, 'add_settings_link' ]
		);

		// Custom cron schedule for "every six hours"
		add_filter( 'cron_schedules', [ self::class, 'add_cron_schedule' ] );

		// Load text domain
		add_action( 'plugins_loaded', [ self::class, 'load_textdomain' ] );
	}

	/**
	 * Activation hook: seed default settings and schedule periodic checks.
	 */
	public static function on_activate(): void {
		if ( false === get_option( ONEEIGHTY_SYNC_OPTION_KEY ) ) {
			update_option( ONEEIGHTY_SYNC_OPTION_KEY, self::DEFAULT_SETTINGS );
		}
		HealthChecker::schedule();
		Logger::log( 'plugin', 'Plugin activated', '', '', 'info' );
	}

	/**
	 * Deactivation hook: cancel scheduled events.
	 */
	public static function on_deactivate(): void {
		HealthChecker::unschedule();
	}

	/**
	 * Uninstall hook: clean up all plugin data.
	 */
	public static function on_uninstall(): void {
		HealthChecker::unschedule();
		delete_option( ONEEIGHTY_SYNC_OPTION_KEY );
		delete_option( ONEEIGHTY_SYNC_LOG_KEY );
		delete_option( ONEEIGHTY_SYNC_HEALTH_KEY );
	}

	/**
	 * Get current settings, merged with defaults.
	 */
	public static function get_settings(): array {
		$saved = get_option( ONEEIGHTY_SYNC_OPTION_KEY, [] );
		if ( ! is_array( $saved ) ) {
			$saved = [];
		}
		return wp_parse_args( $saved, self::DEFAULT_SETTINGS );
	}

	/**
	 * Persist settings.
	 */
	public static function save_settings( array $settings ): void {
		$merged = wp_parse_args( $settings, self::get_settings() );
		update_option( ONEEIGHTY_SYNC_OPTION_KEY, $merged );
	}

	/**
	 * Register a custom cron interval ("every 6 hours") in addition to
	 * the WordPress defaults: hourly, twicedaily, daily.
	 */
	public static function add_cron_schedule( array $schedules ): array {
		$schedules['sixhourly'] = [
			'interval' => 6 * HOUR_IN_SECONDS,
			'display'  => __( 'Every 6 Hours', '180life-sync' ),
		];
		return $schedules;
	}

	/**
	 * Enqueue admin CSS and JS only on the plugin settings page.
	 */
	public static function enqueue_assets( string $hook ): void {
		// Enqueue on the Sync settings page AND the 180 Life Content
		// hub landing page so the card grid styles apply everywhere
		// our admin UI shows up.
		$ours = [
			'settings_page_180life-sync',
			'toplevel_page_180life-content',
		];
		if ( ! in_array( $hook, $ours, true ) ) {
			return;
		}

		wp_enqueue_style(
			'180life-sync-admin',
			ONEEIGHTY_SYNC_URL . 'assets/admin.css',
			[],
			ONEEIGHTY_SYNC_VERSION
		);

		wp_enqueue_script(
			'180life-sync-admin',
			ONEEIGHTY_SYNC_URL . 'assets/admin.js',
			[ 'jquery' ],
			ONEEIGHTY_SYNC_VERSION,
			true
		);

		wp_localize_script(
			'180life-sync-admin',
			'OneEightySyncAdmin',
			[
				'ajaxUrl' => admin_url( 'admin-ajax.php' ),
				'nonces'  => [
					'test'      => wp_create_nonce( '180life_sync_test' ),
					'health'    => wp_create_nonce( '180life_sync_health' ),
					'refreshPc' => wp_create_nonce( '180life_sync_refresh_pc' ),
					'testAlert' => wp_create_nonce( '180life_sync_test_alert' ),
				],
				'i18n'    => [
					'testing'    => __( 'Testing…', '180life-sync' ),
					'success'    => __( 'Success!', '180life-sync' ),
					'failed'     => __( 'Failed', '180life-sync' ),
					'show'       => __( 'Show', '180life-sync' ),
					'hide'       => __( 'Hide', '180life-sync' ),
					'checking'   => __( 'Checking…', '180life-sync' ),
					'refreshing' => __( 'Refreshing Planning Center content…', '180life-sync' ),
				],
			]
		);
	}

	/**
	 * Add a "Settings" link in the Plugins list.
	 */
	public static function add_settings_link( array $links ): array {
		$settings_link = sprintf(
			'<a href="%s">%s</a>',
			esc_url( admin_url( 'options-general.php?page=180life-sync' ) ),
			esc_html__( 'Settings', '180life-sync' )
		);
		array_unshift( $links, $settings_link );
		return $links;
	}

	/**
	 * Load translations.
	 */
	public static function load_textdomain(): void {
		load_plugin_textdomain(
			'180life-sync',
			false,
			dirname( plugin_basename( ONEEIGHTY_SYNC_FILE ) ) . '/languages'
		);
	}
}
