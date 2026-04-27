<?php
/**
 * Main plugin orchestrator.
 *
 * Wires up all subsystems (settings page, webhook firing, AJAX
 * test handler, asset enqueuing) and manages plugin lifecycle hooks.
 *
 * @package OneEightyLife\Revalidation
 */

namespace OneEightyLife\Revalidation;

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
		'enabled'             => true,
		'webhook_url'         => 'https://180lifechurch.org/api/revalidate',
		'revalidation_secret' => '',
		'bypass_token'        => '',
		'tag_mapping'         => [
			'site_settings' => [ 'wordpress', 'settings' ],
			'ministry'      => [ 'wordpress', 'ministries' ],
			'staff'         => [ 'wordpress', 'leadership' ],
			'elder'         => [ 'wordpress', 'leadership' ],
			'sermon_series' => [ 'wordpress', 'sermons' ],
		],
	];

	/**
	 * Boot the plugin: hook everything into WordPress.
	 */
	public static function boot(): void {
		// Settings page registration
		Settings::register();

		// Webhook firing on publish/update events
		Webhook::register();

		// AJAX handler for the "Test Connection" button
		TestHandler::register();

		// Enqueue admin assets only on our settings page
		add_action( 'admin_enqueue_scripts', [ self::class, 'enqueue_assets' ] );

		// Add a settings link from the Plugins screen
		add_filter(
			'plugin_action_links_' . plugin_basename( ONEEIGHTY_REVAL_FILE ),
			[ self::class, 'add_settings_link' ]
		);

		// Load text domain
		add_action( 'plugins_loaded', [ self::class, 'load_textdomain' ] );
	}

	/**
	 * Activation hook: seed default settings if none exist.
	 */
	public static function on_activate(): void {
		if ( false === get_option( ONEEIGHTY_REVAL_OPTION_KEY ) ) {
			update_option( ONEEIGHTY_REVAL_OPTION_KEY, self::DEFAULT_SETTINGS );
		}
		Logger::log( 'plugin', 'Plugin activated', '', '', 'info' );
	}

	/**
	 * Uninstall hook: clean up all plugin data.
	 */
	public static function on_uninstall(): void {
		delete_option( ONEEIGHTY_REVAL_OPTION_KEY );
		delete_option( ONEEIGHTY_REVAL_LOG_KEY );
	}

	/**
	 * Get current settings, merged with defaults.
	 */
	public static function get_settings(): array {
		$saved = get_option( ONEEIGHTY_REVAL_OPTION_KEY, [] );
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
		update_option( ONEEIGHTY_REVAL_OPTION_KEY, $merged );
	}

	/**
	 * Enqueue admin CSS and JS only on the plugin settings page.
	 */
	public static function enqueue_assets( string $hook ): void {
		if ( 'settings_page_180life-revalidation' !== $hook ) {
			return;
		}

		wp_enqueue_style(
			'180life-revalidation-admin',
			ONEEIGHTY_REVAL_URL . 'assets/admin.css',
			[],
			ONEEIGHTY_REVAL_VERSION
		);

		wp_enqueue_script(
			'180life-revalidation-admin',
			ONEEIGHTY_REVAL_URL . 'assets/admin.js',
			[ 'jquery' ],
			ONEEIGHTY_REVAL_VERSION,
			true
		);

		wp_localize_script(
			'180life-revalidation-admin',
			'OneEightyRevalAdmin',
			[
				'ajaxUrl' => admin_url( 'admin-ajax.php' ),
				'nonce'   => wp_create_nonce( '180life_reval_test' ),
				'i18n'    => [
					'testing' => __( 'Testing…', '180life-revalidation' ),
					'success' => __( 'Success!', '180life-revalidation' ),
					'failed'  => __( 'Failed', '180life-revalidation' ),
					'show'    => __( 'Show', '180life-revalidation' ),
					'hide'    => __( 'Hide', '180life-revalidation' ),
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
			esc_url( admin_url( 'options-general.php?page=180life-revalidation' ) ),
			esc_html__( 'Settings', '180life-revalidation' )
		);
		array_unshift( $links, $settings_link );
		return $links;
	}

	/**
	 * Load translations.
	 */
	public static function load_textdomain(): void {
		load_plugin_textdomain(
			'180life-revalidation',
			false,
			dirname( plugin_basename( ONEEIGHTY_REVAL_FILE ) ) . '/languages'
		);
	}
}
