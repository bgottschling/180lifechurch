<?php
/**
 * Admin settings page.
 *
 * Four tabs: General, Tag Mapping, Site Health, Activity Log.
 *
 * @package OneEightyLife\Sync
 */

namespace OneEightyLife\Sync;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Settings {

	public static function register(): void {
		add_action( 'admin_menu', [ self::class, 'add_menu' ] );
		add_action( 'admin_init', [ self::class, 'register_settings' ] );
		add_action( 'admin_post_180life_sync_clear_log', [ self::class, 'handle_clear_log' ] );
		add_action( 'admin_post_180life_sync_export_log', [ self::class, 'handle_export_log' ] );
		add_action( 'update_option_' . ONEEIGHTY_SYNC_OPTION_KEY, [ self::class, 'on_settings_saved' ], 10, 2 );
	}

	public static function add_menu(): void {
		add_options_page(
			__( '180 Life Sync', '180life-sync' ),
			__( '180 Life Sync', '180life-sync' ),
			'manage_options',
			'180life-sync',
			[ self::class, 'render_page' ]
		);
	}

	public static function register_settings(): void {
		register_setting(
			'180life_sync_group',
			ONEEIGHTY_SYNC_OPTION_KEY,
			[
				'type'              => 'array',
				'sanitize_callback' => [ self::class, 'sanitize' ],
				'default'           => Plugin::DEFAULT_SETTINGS,
			]
		);
	}

	public static function sanitize( $input ): array {
		$current = Plugin::get_settings();
		$out     = $current;

		// IMPORTANT: each tab submits only its own fields. We must NOT touch
		// fields that aren't present in this submission, otherwise saving
		// one tab silently resets the other tab's toggles. Use
		// array_key_exists() so we can distinguish "not on this form"
		// (preserve current value) from "explicitly unchecked" (set false).
		// Hidden inputs in the markup ensure checkboxes always submit their
		// key with value=0 when on a form even if unchecked.

		if ( array_key_exists( 'enabled', $input ) ) {
			$out['enabled'] = ! empty( $input['enabled'] );
		}

		if ( array_key_exists( 'webhook_url', $input ) ) {
			$out['webhook_url'] = esc_url_raw( $input['webhook_url'] );
		}
		if ( array_key_exists( 'revalidation_secret', $input ) ) {
			$out['revalidation_secret'] = sanitize_text_field( $input['revalidation_secret'] );
		}
		if ( array_key_exists( 'bypass_token', $input ) ) {
			$out['bypass_token'] = sanitize_text_field( $input['bypass_token'] );
		}
		if ( array_key_exists( 'health_check_url', $input ) ) {
			$out['health_check_url'] = esc_url_raw( $input['health_check_url'] );
		}

		if ( array_key_exists( 'health_check_enabled', $input ) ) {
			$out['health_check_enabled'] = ! empty( $input['health_check_enabled'] );
		}

		if ( array_key_exists( 'consolidate_menus', $input ) ) {
			$out['consolidate_menus'] = ! empty( $input['consolidate_menus'] );
		}

		if ( array_key_exists( 'health_check_freq', $input ) ) {
			$valid = [ 'hourly', 'sixhourly', 'twicedaily', 'daily' ];
			$freq  = sanitize_key( $input['health_check_freq'] );
			$out['health_check_freq'] = in_array( $freq, $valid, true ) ? $freq : 'sixhourly';
		}

		if ( array_key_exists( 'health_alerts_email', $input ) ) {
			$email = sanitize_email( $input['health_alerts_email'] );
			$out['health_alerts_email'] = is_email( $email ) ? $email : '';
		}

		if ( array_key_exists( 'tag_mapping', $input ) && is_array( $input['tag_mapping'] ) ) {
			$mapping = [];
			foreach ( $input['tag_mapping'] as $post_type => $tags_str ) {
				$post_type = sanitize_key( $post_type );
				if ( empty( $post_type ) ) {
					continue;
				}
				$tags = array_filter(
					array_map( 'trim', explode( ',', (string) $tags_str ) ),
					function ( $t ) { return '' !== $t; }
				);
				$tags = array_map( 'sanitize_key', $tags );
				if ( ! empty( $tags ) ) {
					$mapping[ $post_type ] = array_values( $tags );
				}
			}
			$out['tag_mapping'] = $mapping;
		}

		return $out;
	}

	/**
	 * After settings save, reschedule the health check cron to honor
	 * any changes to enabled/frequency.
	 */
	public static function on_settings_saved( $old, $new ): void {
		HealthChecker::schedule();
	}

	/**
	 * Stream the activity log as a downloadable file in either CSV or JSON.
	 *
	 * Endpoint: admin-post.php?action=180life_sync_export_log&format=(csv|json)
	 */
	public static function handle_export_log(): void {
		check_admin_referer( '180life_sync_export_log' );
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'You do not have permission to export the log.', '180life-sync' ) );
		}

		$format    = isset( $_GET['format'] ) ? sanitize_key( $_GET['format'] ) : 'csv';
		$format    = in_array( $format, [ 'csv', 'json' ], true ) ? $format : 'csv';
		$log       = Logger::all();
		$health    = HealthChecker::latest();
		$settings  = Plugin::get_settings();
		$timestamp = wp_date( 'Ymd-His' );
		$filename  = sprintf( '180life-sync-log-%s.%s', $timestamp, $format );

		nocache_headers();
		header( 'Content-Disposition: attachment; filename="' . $filename . '"' );

		if ( 'json' === $format ) {
			header( 'Content-Type: application/json; charset=utf-8' );
			$payload = [
				'exported_at'  => wp_date( 'c' ),
				'site_url'     => home_url(),
				'plugin'       => '180 Life Sync',
				'version'      => ONEEIGHTY_SYNC_VERSION,
				'enabled'      => (bool) $settings['enabled'],
				'webhook_url'  => $settings['webhook_url'] ?? '',
				'health_url'   => $settings['health_check_url'] ?? '',
				'last_health'  => $health,
				'log_entries'  => array_map(
					function ( $e ) {
						return [
							'timestamp'   => wp_date( 'c', (int) ( $e['time'] ?? 0 ) ),
							'time_ago'    => Logger::time_ago( (int) ( $e['time'] ?? 0 ) ),
							'status'      => $e['status'] ?? '',
							'post_type'   => $e['post_type'] ?? '',
							'post_title'  => $e['post_title'] ?? '',
							'tags'        => $e['tags'] ?? '',
							'trigger'     => $e['trigger'] ?? '',
							'message'     => $e['message'] ?? '',
							'elapsed_ms'  => (int) ( $e['elapsed_ms'] ?? 0 ),
							'response'    => $e['response'] ?? '',
						];
					},
					$log
				),
			];
			echo wp_json_encode( $payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES );
			exit;
		}

		// CSV
		header( 'Content-Type: text/csv; charset=utf-8' );
		$out = fopen( 'php://output', 'w' );
		// BOM for Excel UTF-8 compatibility
		fwrite( $out, "\xEF\xBB\xBF" );
		fputcsv( $out, [ 'Timestamp (ISO)', 'Time Ago', 'Status', 'Post Type', 'Post Title', 'Tags', 'Trigger', 'Message', 'Elapsed (ms)', 'Response (truncated)' ] );
		foreach ( $log as $e ) {
			fputcsv(
				$out,
				[
					wp_date( 'c', (int) ( $e['time'] ?? 0 ) ),
					Logger::time_ago( (int) ( $e['time'] ?? 0 ) ),
					$e['status'] ?? '',
					$e['post_type'] ?? '',
					$e['post_title'] ?? '',
					$e['tags'] ?? '',
					$e['trigger'] ?? '',
					$e['message'] ?? '',
					(int) ( $e['elapsed_ms'] ?? 0 ),
					mb_substr( (string) ( $e['response'] ?? '' ), 0, 200 ),
				]
			);
		}
		fclose( $out );
		exit;
	}

	public static function handle_clear_log(): void {
		check_admin_referer( '180life_sync_clear_log' );
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'You do not have permission to clear the log.', '180life-sync' ) );
		}
		Logger::clear();
		wp_safe_redirect(
			add_query_arg(
				[ 'page' => '180life-sync', 'tab' => 'log', 'cleared' => '1' ],
				admin_url( 'options-general.php' )
			)
		);
		exit;
	}

	public static function render_page(): void {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$tab      = isset( $_GET['tab'] ) ? sanitize_key( $_GET['tab'] ) : 'general';
		$settings = Plugin::get_settings();
		$log      = Logger::all();
		$health   = HealthChecker::latest();

		$last_event = $log[0] ?? null;
		$last_status_class = 'is-idle';
		$last_status_label = __( 'No activity yet', '180life-sync' );
		if ( $last_event ) {
			if ( ! $settings['enabled'] ) {
				// Disabled overrides — don't pretend we're healthy when we're not running
				$last_status_class = 'is-idle';
			} else {
				$last_status_class = ( 'pass' === $last_event['status'] ) ? 'is-healthy' : 'is-error';
			}
			$last_status_label = sprintf(
				/* translators: %s relative time */
				__( 'Last fire: %s', '180life-sync' ),
				Logger::time_ago( $last_event['time'] )
			);
		}

		$health_class = 'is-idle';
		$health_label = __( 'Health: not checked yet', '180life-sync' );
		if ( $health && isset( $health['overall'] ) ) {
			$health_class = 'healthy' === $health['overall']
				? 'is-healthy'
				: ( 'degraded' === $health['overall'] ? 'is-warn' : 'is-error' );
			$health_label = sprintf(
				/* translators: 1: status, 2: relative time */
				__( 'Health: %1$s — checked %2$s', '180life-sync' ),
				ucfirst( (string) $health['overall'] ),
				Logger::time_ago( (int) $health['timestamp'] )
			);
		}

		?>
		<div class="wrap oneeighty-sync-wrap">
			<h1>
				<span class="dashicons dashicons-update"></span>
				<?php esc_html_e( '180 Life Sync', '180life-sync' ); ?>
			</h1>

			<div class="oneeighty-sync-status-row">
				<div class="oneeighty-sync-status-bar <?php echo esc_attr( $last_status_class ); ?>">
					<span class="status-dot"></span>
					<span class="status-text">
						<?php echo $settings['enabled'] ? esc_html__( 'Active', '180life-sync' ) : esc_html__( 'Disabled', '180life-sync' ); ?>
					</span>
					<span class="status-meta"><?php echo esc_html( $last_status_label ); ?></span>
				</div>
				<div class="oneeighty-sync-status-bar <?php echo esc_attr( $health_class ); ?>">
					<span class="status-dot"></span>
					<span class="status-text">
						<?php esc_html_e( 'Site Health', '180life-sync' ); ?>
					</span>
					<span class="status-meta"><?php echo esc_html( $health_label ); ?></span>
				</div>
			</div>

			<?php if ( ! empty( $_GET['cleared'] ) ) : ?>
				<div class="notice notice-success is-dismissible">
					<p><?php esc_html_e( 'Activity log cleared.', '180life-sync' ); ?></p>
				</div>
			<?php endif; ?>

			<nav class="nav-tab-wrapper oneeighty-sync-tabs">
				<a href="?page=180life-sync&tab=general" class="nav-tab <?php echo 'general' === $tab ? 'nav-tab-active' : ''; ?>">
					<?php esc_html_e( 'General', '180life-sync' ); ?>
				</a>
				<a href="?page=180life-sync&tab=mapping" class="nav-tab <?php echo 'mapping' === $tab ? 'nav-tab-active' : ''; ?>">
					<?php esc_html_e( 'Tag Mapping', '180life-sync' ); ?>
				</a>
				<a href="?page=180life-sync&tab=health" class="nav-tab <?php echo 'health' === $tab ? 'nav-tab-active' : ''; ?>">
					<?php esc_html_e( 'Site Health', '180life-sync' ); ?>
				</a>
				<a href="?page=180life-sync&tab=log" class="nav-tab <?php echo 'log' === $tab ? 'nav-tab-active' : ''; ?>">
					<?php esc_html_e( 'Activity Log', '180life-sync' ); ?>
					<?php if ( ! empty( $log ) ) : ?>
						<span class="oneeighty-sync-tab-count"><?php echo (int) count( $log ); ?></span>
					<?php endif; ?>
				</a>
			</nav>

			<?php
			switch ( $tab ) {
				case 'mapping':
					self::render_mapping_tab( $settings );
					break;
				case 'health':
					self::render_health_tab( $settings, $health );
					break;
				case 'log':
					self::render_log_tab( $log );
					break;
				case 'general':
				default:
					self::render_general_tab( $settings );
					break;
			}
			?>

		</div>
		<?php
	}

	private static function render_general_tab( array $settings ): void {
		?>
		<?php if ( empty( $settings['enabled'] ) ) : ?>
			<div class="notice notice-warning inline oneeighty-sync-disabled-notice">
				<p>
					<strong><?php esc_html_e( 'Webhooks are currently disabled.', '180life-sync' ); ?></strong>
					<?php esc_html_e( 'Publish/update events will NOT trigger cache revalidation until the master toggle below is turned on. Test Connection and the periodic health check ignore this toggle and will continue to work.', '180life-sync' ); ?>
				</p>
			</div>
		<?php endif; ?>
		<form method="post" action="options.php" class="oneeighty-sync-form">
			<?php settings_fields( '180life_sync_group' ); ?>

			<table class="form-table" role="presentation">
				<tbody>
					<tr>
						<th scope="row">
							<label for="oneeighty-sync-enabled"><?php esc_html_e( 'Enabled', '180life-sync' ); ?></label>
						</th>
						<td>
							<input type="hidden" name="<?php echo esc_attr( ONEEIGHTY_SYNC_OPTION_KEY ); ?>[enabled]" value="0" />
							<label class="oneeighty-sync-toggle">
								<input type="checkbox" name="<?php echo esc_attr( ONEEIGHTY_SYNC_OPTION_KEY ); ?>[enabled]" id="oneeighty-sync-enabled" value="1" <?php checked( $settings['enabled'] ); ?> />
								<span class="slider"></span>
							</label>
							<p class="description">
								<?php esc_html_e( 'Master toggle. Turn off to temporarily disable webhook firing without uninstalling.', '180life-sync' ); ?>
							</p>
						</td>
					</tr>

					<tr>
						<th scope="row">
							<label for="oneeighty-sync-webhook-url"><?php esc_html_e( 'Webhook URL', '180life-sync' ); ?></label>
						</th>
						<td>
							<input type="url" name="<?php echo esc_attr( ONEEIGHTY_SYNC_OPTION_KEY ); ?>[webhook_url]" id="oneeighty-sync-webhook-url" class="regular-text" value="<?php echo esc_attr( $settings['webhook_url'] ); ?>" placeholder="https://180lifechurch.org/api/revalidate" />
							<p class="description">
								<?php esc_html_e( 'The Next.js revalidation endpoint URL. Use the production URL once the site is live; use the preview URL while testing.', '180life-sync' ); ?>
							</p>
						</td>
					</tr>

					<tr>
						<th scope="row">
							<label for="oneeighty-sync-secret"><?php esc_html_e( 'Revalidation Secret', '180life-sync' ); ?></label>
						</th>
						<td>
							<input type="password" name="<?php echo esc_attr( ONEEIGHTY_SYNC_OPTION_KEY ); ?>[revalidation_secret]" id="oneeighty-sync-secret" class="regular-text oneeighty-sync-secret" value="<?php echo esc_attr( $settings['revalidation_secret'] ); ?>" autocomplete="new-password" />
							<button type="button" class="button button-secondary oneeighty-sync-toggle-visibility" data-target="oneeighty-sync-secret">
								<?php esc_html_e( 'Show', '180life-sync' ); ?>
							</button>
							<p class="description">
								<?php esc_html_e( 'Sent as the x-revalidation-secret header. Must match WORDPRESS_REVALIDATION_SECRET in Vercel env vars.', '180life-sync' ); ?>
							</p>
						</td>
					</tr>

					<tr>
						<th scope="row">
							<label for="oneeighty-sync-bypass-token">
								<?php esc_html_e( 'Vercel Bypass Token', '180life-sync' ); ?>
								<span class="oneeighty-sync-optional"><?php esc_html_e( '(optional)', '180life-sync' ); ?></span>
							</label>
						</th>
						<td>
							<input type="password" name="<?php echo esc_attr( ONEEIGHTY_SYNC_OPTION_KEY ); ?>[bypass_token]" id="oneeighty-sync-bypass-token" class="regular-text oneeighty-sync-secret" value="<?php echo esc_attr( $settings['bypass_token'] ); ?>" autocomplete="new-password" />
							<button type="button" class="button button-secondary oneeighty-sync-toggle-visibility" data-target="oneeighty-sync-bypass-token">
								<?php esc_html_e( 'Show', '180life-sync' ); ?>
							</button>
							<p class="description">
								<?php echo wp_kses_post( __( 'Generate at <strong>Vercel → Project → Settings → Deployment Protection → Protection Bypass for Automation</strong>. Required only when targeting a preview deployment that is protected. Leave blank for production.', '180life-sync' ) ); ?>
							</p>
						</td>
					</tr>

					<tr>
						<th scope="row"><?php esc_html_e( 'Test Connection', '180life-sync' ); ?></th>
						<td>
							<button type="button" id="oneeighty-sync-test-button" class="button button-primary">
								<?php esc_html_e( 'Run Test', '180life-sync' ); ?>
							</button>
							<div id="oneeighty-sync-test-result" class="oneeighty-sync-test-result" aria-live="polite"></div>
							<p class="description">
								<?php esc_html_e( 'Fires a webhook with the values currently in the form (no save required) and shows the response.', '180life-sync' ); ?>
							</p>
						</td>
					</tr>

					<tr>
						<th scope="row" colspan="2" style="padding-top:1.5em">
							<h2 style="font-size:1.05em;color:#1d2327;margin:0">
								<?php esc_html_e( 'Quick Actions', '180life-sync' ); ?>
							</h2>
						</th>
					</tr>

					<tr>
						<th scope="row">
							<label for="oneeighty-sync-refresh-pc-scope">
								<?php esc_html_e( 'Refresh Content', '180life-sync' ); ?>
							</label>
						</th>
						<td>
							<select id="oneeighty-sync-refresh-pc-scope" class="oneeighty-sync-scope-select">
								<option value="all"><?php esc_html_e( 'All content (recommended)', '180life-sync' ); ?></option>
								<option value="planning-center"><?php esc_html_e( 'Planning Center only (events + sermons)', '180life-sync' ); ?></option>
								<option value="wordpress"><?php esc_html_e( 'WordPress only (settings, ministries, leadership, pages)', '180life-sync' ); ?></option>
							</select>
							<button type="button" id="oneeighty-sync-refresh-pc-button" class="button button-secondary">
								<span class="dashicons dashicons-update" style="vertical-align: text-bottom; margin-right: 4px"></span>
								<?php esc_html_e( 'Refresh Now', '180life-sync' ); ?>
							</button>
							<div id="oneeighty-sync-refresh-pc-result" class="oneeighty-sync-test-result" aria-live="polite"></div>
							<p class="description">
								<?php esc_html_e( 'Force-refreshes the public site\'s cached content. "All content" is the global cache reset and is the right choice for almost all situations. The narrower options exist if you specifically only changed one source and want to leave the other source\'s cache untouched. Auto-refresh: daily at 5 AM UTC plus every Sunday at ~10:30 AM Eastern.', '180life-sync' ); ?>
							</p>
						</td>
					</tr>

					<tr>
						<th scope="row" colspan="2" style="padding-top:1.5em">
							<h2 style="font-size:1.05em;color:#1d2327;margin:0">
								<?php esc_html_e( 'Admin Experience', '180life-sync' ); ?>
							</h2>
						</th>
					</tr>

					<tr>
						<th scope="row">
							<label for="oneeighty-sync-consolidate-menus"><?php esc_html_e( 'Consolidate Menus', '180life-sync' ); ?></label>
						</th>
						<td>
							<input type="hidden" name="<?php echo esc_attr( ONEEIGHTY_SYNC_OPTION_KEY ); ?>[consolidate_menus]" value="0" />
							<label class="oneeighty-sync-toggle">
								<input type="checkbox" name="<?php echo esc_attr( ONEEIGHTY_SYNC_OPTION_KEY ); ?>[consolidate_menus]" id="oneeighty-sync-consolidate-menus" value="1" <?php checked( ! empty( $settings['consolidate_menus'] ) ); ?> />
								<span class="slider"></span>
							</label>
							<p class="description">
								<?php esc_html_e( 'Group all church-managed content (Site Settings, Ministries, Staff, Elders, Sermon Series) under a single "180 Life" menu in the wp-admin sidebar instead of letting each post type take its own top-level slot. Recommended ON.', '180life-sync' ); ?>
							</p>
						</td>
					</tr>
				</tbody>
			</table>

			<?php submit_button( __( 'Save Settings', '180life-sync' ) ); ?>
		</form>
		<?php
	}

	private static function render_mapping_tab( array $settings ): void {
		$mapping    = $settings['tag_mapping'] ?? [];
		$post_types = get_post_types( [ 'public' => false, '_builtin' => false ], 'objects' );
		$builtin    = [
			'page' => get_post_type_object( 'page' ),
			'post' => get_post_type_object( 'post' ),
		];
		$all_types = array_merge( array_filter( $builtin ), $post_types );
		?>
		<form method="post" action="options.php" class="oneeighty-sync-form">
			<?php settings_fields( '180life_sync_group' ); ?>

			<p class="description">
				<?php esc_html_e( 'Map post types to cache tags. When a post of a given type is published or updated, the listed tags are sent to the Next.js revalidation endpoint. Post types not listed here will not trigger any webhook.', '180life-sync' ); ?>
			</p>

			<table class="widefat striped oneeighty-sync-mapping">
				<thead>
					<tr>
						<th><?php esc_html_e( 'Post Type', '180life-sync' ); ?></th>
						<th><?php esc_html_e( 'Slug', '180life-sync' ); ?></th>
						<th><?php esc_html_e( 'Tags (comma-separated)', '180life-sync' ); ?></th>
					</tr>
				</thead>
				<tbody>
					<?php
					$known_slugs = [];
					foreach ( $all_types as $slug => $obj ) {
						$known_slugs[] = $slug;
						$tags = isset( $mapping[ $slug ] ) ? implode( ', ', (array) $mapping[ $slug ] ) : '';
						?>
						<tr>
							<td><?php echo esc_html( $obj->labels->singular_name ); ?></td>
							<td><code><?php echo esc_html( $slug ); ?></code></td>
							<td>
								<input type="text" name="<?php echo esc_attr( ONEEIGHTY_SYNC_OPTION_KEY ); ?>[tag_mapping][<?php echo esc_attr( $slug ); ?>]" value="<?php echo esc_attr( $tags ); ?>" class="regular-text" placeholder="<?php esc_attr_e( 'e.g. wordpress, ministries', '180life-sync' ); ?>" />
							</td>
						</tr>
						<?php
					}

					foreach ( $mapping as $slug => $tags ) {
						if ( in_array( $slug, $known_slugs, true ) ) {
							continue;
						}
						$tags_str = implode( ', ', (array) $tags );
						?>
						<tr>
							<td><em><?php esc_html_e( '(unregistered)', '180life-sync' ); ?></em></td>
							<td><code><?php echo esc_html( $slug ); ?></code></td>
							<td>
								<input type="text" name="<?php echo esc_attr( ONEEIGHTY_SYNC_OPTION_KEY ); ?>[tag_mapping][<?php echo esc_attr( $slug ); ?>]" value="<?php echo esc_attr( $tags_str ); ?>" class="regular-text" />
							</td>
						</tr>
						<?php
					}
					?>
				</tbody>
			</table>

			<p class="description" style="margin-top:1em">
				<strong><?php esc_html_e( 'Valid tags:', '180life-sync' ); ?></strong>
				<code>wordpress</code>, <code>events</code>, <code>ministries</code>, <code>leadership</code>, <code>sermons</code>, <code>settings</code>, <code>pages</code>
			</p>

			<?php submit_button( __( 'Save Tag Mapping', '180life-sync' ) ); ?>
		</form>
		<?php
	}

	private static function render_health_tab( array $settings, ?array $health ): void {
		$next_run = wp_next_scheduled( ONEEIGHTY_SYNC_CRON_HOOK );
		?>
		<form method="post" action="options.php" class="oneeighty-sync-form">
			<?php settings_fields( '180life_sync_group' ); ?>

			<table class="form-table" role="presentation">
				<tbody>
					<tr>
						<th scope="row">
							<label for="oneeighty-sync-health-enabled"><?php esc_html_e( 'Periodic Checks', '180life-sync' ); ?></label>
						</th>
						<td>
							<input type="hidden" name="<?php echo esc_attr( ONEEIGHTY_SYNC_OPTION_KEY ); ?>[health_check_enabled]" value="0" />
							<label class="oneeighty-sync-toggle">
								<input type="checkbox" name="<?php echo esc_attr( ONEEIGHTY_SYNC_OPTION_KEY ); ?>[health_check_enabled]" id="oneeighty-sync-health-enabled" value="1" <?php checked( ! empty( $settings['health_check_enabled'] ) ); ?> />
								<span class="slider"></span>
							</label>
							<p class="description">
								<?php esc_html_e( 'When enabled, the plugin polls the Next.js diagnostic endpoint on a schedule and stores the result so problems surface before editors notice.', '180life-sync' ); ?>
							</p>
						</td>
					</tr>

					<tr>
						<th scope="row">
							<label for="oneeighty-sync-health-url"><?php esc_html_e( 'Health Check URL', '180life-sync' ); ?></label>
						</th>
						<td>
							<input type="url" name="<?php echo esc_attr( ONEEIGHTY_SYNC_OPTION_KEY ); ?>[health_check_url]" id="oneeighty-sync-health-url" class="regular-text" value="<?php echo esc_attr( $settings['health_check_url'] ); ?>" placeholder="https://180lifechurch.org/api/wordpress-health" />
							<p class="description">
								<?php esc_html_e( 'The Next.js diagnostic endpoint. The plugin appends ?secret=… (revalidation secret) automatically; the bypass token is also added if configured.', '180life-sync' ); ?>
							</p>
						</td>
					</tr>

					<tr>
						<th scope="row">
							<label for="oneeighty-sync-health-freq"><?php esc_html_e( 'Frequency', '180life-sync' ); ?></label>
						</th>
						<td>
							<select name="<?php echo esc_attr( ONEEIGHTY_SYNC_OPTION_KEY ); ?>[health_check_freq]" id="oneeighty-sync-health-freq">
								<?php
								$choices = [
									'hourly'     => __( 'Every Hour', '180life-sync' ),
									'sixhourly'  => __( 'Every 6 Hours (recommended)', '180life-sync' ),
									'twicedaily' => __( 'Twice a Day', '180life-sync' ),
									'daily'      => __( 'Once a Day', '180life-sync' ),
								];
								foreach ( $choices as $val => $label ) {
									printf(
										'<option value="%1$s" %2$s>%3$s</option>',
										esc_attr( $val ),
										selected( $settings['health_check_freq'] ?? 'sixhourly', $val, false ),
										esc_html( $label )
									);
								}
								?>
							</select>
							<p class="description">
								<?php esc_html_e( 'WordPress runs scheduled tasks lazily — they fire on the next page request after the scheduled time, not at the exact second.', '180life-sync' ); ?>
							</p>
						</td>
					</tr>

					<tr>
						<th scope="row">
							<label for="oneeighty-sync-health-email">
								<?php esc_html_e( 'Alert Email', '180life-sync' ); ?>
								<span class="oneeighty-sync-optional"><?php esc_html_e( '(optional)', '180life-sync' ); ?></span>
							</label>
						</th>
						<td>
							<input type="email" name="<?php echo esc_attr( ONEEIGHTY_SYNC_OPTION_KEY ); ?>[health_alerts_email]" id="oneeighty-sync-health-email" class="regular-text" value="<?php echo esc_attr( $settings['health_alerts_email'] ?? '' ); ?>" placeholder="webmaster@180lifechurch.org" />
							<button type="button" id="oneeighty-sync-test-alert-button" class="button button-secondary" style="margin-left:8px">
								<span class="dashicons dashicons-email-alt" style="vertical-align: text-bottom; margin-right: 4px"></span>
								<?php esc_html_e( 'Send Test Alert', '180life-sync' ); ?>
							</button>
							<div id="oneeighty-sync-test-alert-result" class="oneeighty-sync-test-result" aria-live="polite"></div>
							<p class="description">
								<?php esc_html_e( 'Optional email address to notify when overall status transitions to "broken". Debounced so you only receive one email per incident, not on every periodic re-check.', '180life-sync' ); ?>
								<br/>
								<?php esc_html_e( 'Use Send Test Alert to verify delivery works on this host. If the test fails, alerts are silently dropped — typical fix is installing an SMTP plugin (WP Mail SMTP, Postmark for WordPress, etc.) since most shared hosts block PHP sendmail.', '180life-sync' ); ?>
							</p>
						</td>
					</tr>

					<tr>
						<th scope="row"><?php esc_html_e( 'Run Now', '180life-sync' ); ?></th>
						<td>
							<button type="button" id="oneeighty-sync-health-button" class="button button-primary">
								<?php esc_html_e( 'Run Health Check Now', '180life-sync' ); ?>
							</button>
							<?php if ( $next_run ) : ?>
								<p class="description">
									<?php
									printf(
										/* translators: %s relative time */
										esc_html__( 'Next scheduled check: %s from now', '180life-sync' ),
										esc_html( human_time_diff( time(), $next_run ) )
									);
									?>
								</p>
							<?php endif; ?>
						</td>
					</tr>
				</tbody>
			</table>

			<?php submit_button( __( 'Save Health Settings', '180life-sync' ) ); ?>
		</form>

		<h2 class="oneeighty-sync-section-heading"><?php esc_html_e( 'Latest Diagnostic Result', '180life-sync' ); ?></h2>
		<div id="oneeighty-sync-health-result">
			<?php if ( $health && ! empty( $health['checks'] ) ) : ?>
				<?php self::render_health_detail( $health ); ?>
			<?php else : ?>
				<div class="oneeighty-sync-empty-state">
					<span class="dashicons dashicons-shield"></span>
					<p>
						<?php esc_html_e( 'No health check has run yet.', '180life-sync' ); ?><br/>
						<?php esc_html_e( 'Click "Run Health Check Now" to perform the first check.', '180life-sync' ); ?>
					</p>
				</div>
			<?php endif; ?>
		</div>
		<?php
	}

	/**
	 * Render the structured per-check diagnostic detail.
	 */
	public static function render_health_detail( array $health ): void {
		$overall_class = 'is-idle';
		if ( 'healthy' === ( $health['overall'] ?? '' ) ) {
			$overall_class = 'is-healthy';
		} elseif ( 'degraded' === ( $health['overall'] ?? '' ) ) {
			$overall_class = 'is-warn';
		} elseif ( 'broken' === ( $health['overall'] ?? '' ) ) {
			$overall_class = 'is-error';
		}
		?>
		<div class="oneeighty-sync-health-summary <?php echo esc_attr( $overall_class ); ?>">
			<div class="overall">
				<span class="dot"></span>
				<strong><?php echo esc_html( ucfirst( (string) ( $health['overall'] ?? 'unknown' ) ) ); ?></strong>
			</div>
			<div class="message"><?php echo esc_html( $health['summary'] ?? '' ); ?></div>
			<?php if ( ! empty( $health['timestamp'] ) ) : ?>
				<div class="meta">
					<?php
					printf(
						/* translators: 1: relative time, 2: round-trip ms */
						esc_html__( 'Checked %1$s — round trip %2$d ms', '180life-sync' ),
						esc_html( Logger::time_ago( (int) $health['timestamp'] ) ),
						(int) ( $health['elapsed_ms'] ?? 0 )
					);
					?>
				</div>
			<?php endif; ?>
		</div>

		<?php if ( ! empty( $health['checks'] ) ) : ?>
			<table class="widefat striped oneeighty-sync-health-checks">
				<thead>
					<tr>
						<th class="col-check"><?php esc_html_e( 'Check', '180life-sync' ); ?></th>
						<th class="col-status"><?php esc_html_e( 'Status', '180life-sync' ); ?></th>
						<th><?php esc_html_e( 'Details', '180life-sync' ); ?></th>
					</tr>
				</thead>
				<tbody>
					<?php foreach ( $health['checks'] as $check ) : ?>
						<tr>
							<td class="col-check"><strong><?php echo esc_html( $check['name'] ?? '' ); ?></strong></td>
							<td class="col-status">
								<span class="oneeighty-sync-status is-<?php echo esc_attr( sanitize_html_class( $check['status'] ?? 'info' ) ); ?>">
									<?php echo esc_html( $check['status'] ?? '' ); ?>
								</span>
							</td>
							<td>
								<div class="check-message"><?php echo esc_html( $check['message'] ?? '' ); ?></div>
								<?php if ( ! empty( $check['detail'] ) ) : ?>
									<div class="check-detail"><?php echo esc_html( $check['detail'] ); ?></div>
								<?php endif; ?>
							</td>
						</tr>
					<?php endforeach; ?>
				</tbody>
			</table>
		<?php endif; ?>
		<?php
	}

	private static function render_log_tab( array $log ): void {
		?>
		<?php
		$export_csv_url = wp_nonce_url(
			add_query_arg(
				[ 'action' => '180life_sync_export_log', 'format' => 'csv' ],
				admin_url( 'admin-post.php' )
			),
			'180life_sync_export_log'
		);
		$export_json_url = wp_nonce_url(
			add_query_arg(
				[ 'action' => '180life_sync_export_log', 'format' => 'json' ],
				admin_url( 'admin-post.php' )
			),
			'180life_sync_export_log'
		);
		?>
		<div class="oneeighty-sync-log-toolbar">
			<a href="<?php echo esc_url( admin_url( 'options-general.php?page=180life-sync&tab=log' ) ); ?>" class="button">
				<span class="dashicons dashicons-update" style="vertical-align: text-bottom"></span>
				<?php esc_html_e( 'Refresh', '180life-sync' ); ?>
			</a>
			<?php if ( ! empty( $log ) ) : ?>
				<a href="<?php echo esc_url( $export_csv_url ); ?>" class="button">
					<span class="dashicons dashicons-media-spreadsheet" style="vertical-align: text-bottom"></span>
					<?php esc_html_e( 'Download CSV', '180life-sync' ); ?>
				</a>
				<a href="<?php echo esc_url( $export_json_url ); ?>" class="button">
					<span class="dashicons dashicons-media-code" style="vertical-align: text-bottom"></span>
					<?php esc_html_e( 'Download JSON', '180life-sync' ); ?>
				</a>
				<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" style="display:inline; margin-left: auto">
					<input type="hidden" name="action" value="180life_sync_clear_log" />
					<?php wp_nonce_field( '180life_sync_clear_log' ); ?>
					<button type="submit" class="button button-link-delete" onclick="return confirm('<?php esc_attr_e( 'Clear the activity log? This cannot be undone.', '180life-sync' ); ?>')">
						<?php esc_html_e( 'Clear Log', '180life-sync' ); ?>
					</button>
				</form>
			<?php endif; ?>
		</div>

		<?php if ( empty( $log ) ) : ?>
			<div class="oneeighty-sync-empty-state">
				<span class="dashicons dashicons-update"></span>
				<p>
					<?php esc_html_e( 'No activity yet.', '180life-sync' ); ?><br/>
					<?php esc_html_e( 'Webhook events will appear here as soon as content is published or updated.', '180life-sync' ); ?>
				</p>
			</div>
		<?php else : ?>
			<table class="widefat striped oneeighty-sync-log">
				<thead>
					<tr>
						<th class="col-time"><?php esc_html_e( 'When', '180life-sync' ); ?></th>
						<th class="col-status"><?php esc_html_e( 'Status', '180life-sync' ); ?></th>
						<th><?php esc_html_e( 'Post', '180life-sync' ); ?></th>
						<th><?php esc_html_e( 'Type', '180life-sync' ); ?></th>
						<th><?php esc_html_e( 'Tags', '180life-sync' ); ?></th>
						<th><?php esc_html_e( 'Trigger', '180life-sync' ); ?></th>
						<th class="col-message"><?php esc_html_e( 'Result', '180life-sync' ); ?></th>
					</tr>
				</thead>
				<tbody>
					<?php foreach ( $log as $entry ) : ?>
						<tr>
							<td class="col-time" title="<?php echo esc_attr( wp_date( get_option( 'date_format' ) . ' ' . get_option( 'time_format' ), $entry['time'] ) ); ?>">
								<?php echo esc_html( Logger::time_ago( (int) $entry['time'] ) ); ?>
							</td>
							<td class="col-status">
								<span class="oneeighty-sync-status is-<?php echo esc_attr( sanitize_html_class( $entry['status'] ?? 'info' ) ); ?>">
									<?php echo esc_html( $entry['status'] ?? 'info' ); ?>
								</span>
							</td>
							<td><?php echo esc_html( $entry['post_title'] ?? '' ); ?></td>
							<td><code><?php echo esc_html( $entry['post_type'] ?? '' ); ?></code></td>
							<td><?php echo esc_html( $entry['tags'] ?? '' ); ?></td>
							<td><code><?php echo esc_html( $entry['trigger'] ?? '' ); ?></code></td>
							<td class="col-message">
								<?php echo esc_html( $entry['message'] ?? '' ); ?>
								<?php if ( ! empty( $entry['elapsed_ms'] ) ) : ?>
									<span class="elapsed">
										<?php echo esc_html( sprintf( /* translators: %d ms */ __( '(%d ms)', '180life-sync' ), (int) $entry['elapsed_ms'] ) ); ?>
									</span>
								<?php endif; ?>
							</td>
						</tr>
					<?php endforeach; ?>
				</tbody>
			</table>
		<?php endif; ?>
		<?php
	}
}
