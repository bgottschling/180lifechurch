<?php
/**
 * Admin settings page.
 *
 * Three tabs: General, Tag Mapping, Activity Log.
 *
 * @package OneEightyLife\Revalidation
 */

namespace OneEightyLife\Revalidation;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Settings {

	public static function register(): void {
		add_action( 'admin_menu', [ self::class, 'add_menu' ] );
		add_action( 'admin_init', [ self::class, 'register_settings' ] );
		add_action( 'admin_post_180life_reval_clear_log', [ self::class, 'handle_clear_log' ] );
	}

	public static function add_menu(): void {
		add_options_page(
			__( '180 Life Revalidation', '180life-revalidation' ),
			__( '180 Life Revalidation', '180life-revalidation' ),
			'manage_options',
			'180life-revalidation',
			[ self::class, 'render_page' ]
		);
	}

	public static function register_settings(): void {
		register_setting(
			'180life_revalidation_group',
			ONEEIGHTY_REVAL_OPTION_KEY,
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

		if ( isset( $input['enabled'] ) ) {
			$out['enabled'] = (bool) $input['enabled'];
		} else {
			$out['enabled'] = false;
		}

		if ( isset( $input['webhook_url'] ) ) {
			$out['webhook_url'] = esc_url_raw( $input['webhook_url'] );
		}

		if ( isset( $input['revalidation_secret'] ) ) {
			$out['revalidation_secret'] = sanitize_text_field( $input['revalidation_secret'] );
		}

		if ( isset( $input['bypass_token'] ) ) {
			$out['bypass_token'] = sanitize_text_field( $input['bypass_token'] );
		}

		if ( isset( $input['tag_mapping'] ) && is_array( $input['tag_mapping'] ) ) {
			$mapping = [];
			foreach ( $input['tag_mapping'] as $post_type => $tags_str ) {
				$post_type = sanitize_key( $post_type );
				if ( empty( $post_type ) ) {
					continue;
				}
				$tags = array_filter(
					array_map( 'trim', explode( ',', $tags_str ) ),
					function ( $t ) {
						return '' !== $t;
					}
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

	public static function handle_clear_log(): void {
		check_admin_referer( '180life_reval_clear_log' );
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'You do not have permission to clear the log.', '180life-revalidation' ) );
		}
		Logger::clear();
		wp_safe_redirect(
			add_query_arg(
				[
					'page'      => '180life-revalidation',
					'tab'       => 'log',
					'cleared'   => '1',
				],
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

		// Compute status badge
		$last_event = $log[0] ?? null;
		$last_status_class = 'is-idle';
		$last_status_label = __( 'No activity yet', '180life-revalidation' );
		if ( $last_event ) {
			$last_status_class = ( 'pass' === $last_event['status'] ) ? 'is-healthy' : 'is-error';
			$last_status_label = sprintf(
				/* translators: %s relative time */
				__( 'Last fire: %s', '180life-revalidation' ),
				Logger::time_ago( $last_event['time'] )
			);
		}

		?>
		<div class="wrap oneeighty-reval-wrap">
			<h1>
				<span class="dashicons dashicons-update"></span>
				<?php esc_html_e( '180 Life Revalidation', '180life-revalidation' ); ?>
			</h1>

			<div class="oneeighty-reval-status-bar <?php echo esc_attr( $last_status_class ); ?>">
				<span class="status-dot"></span>
				<span class="status-text">
					<?php
					if ( $settings['enabled'] ) {
						esc_html_e( 'Active', '180life-revalidation' );
					} else {
						esc_html_e( 'Disabled', '180life-revalidation' );
					}
					?>
				</span>
				<span class="status-meta"><?php echo esc_html( $last_status_label ); ?></span>
			</div>

			<?php if ( ! empty( $_GET['cleared'] ) ) : ?>
				<div class="notice notice-success is-dismissible">
					<p><?php esc_html_e( 'Activity log cleared.', '180life-revalidation' ); ?></p>
				</div>
			<?php endif; ?>

			<nav class="nav-tab-wrapper oneeighty-reval-tabs">
				<a href="?page=180life-revalidation&tab=general" class="nav-tab <?php echo 'general' === $tab ? 'nav-tab-active' : ''; ?>">
					<?php esc_html_e( 'General', '180life-revalidation' ); ?>
				</a>
				<a href="?page=180life-revalidation&tab=mapping" class="nav-tab <?php echo 'mapping' === $tab ? 'nav-tab-active' : ''; ?>">
					<?php esc_html_e( 'Tag Mapping', '180life-revalidation' ); ?>
				</a>
				<a href="?page=180life-revalidation&tab=log" class="nav-tab <?php echo 'log' === $tab ? 'nav-tab-active' : ''; ?>">
					<?php esc_html_e( 'Activity Log', '180life-revalidation' ); ?>
					<?php if ( ! empty( $log ) ) : ?>
						<span class="oneeighty-reval-tab-count"><?php echo (int) count( $log ); ?></span>
					<?php endif; ?>
				</a>
			</nav>

			<?php
			switch ( $tab ) {
				case 'mapping':
					self::render_mapping_tab( $settings );
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
		<form method="post" action="options.php" class="oneeighty-reval-form">
			<?php settings_fields( '180life_revalidation_group' ); ?>

			<table class="form-table" role="presentation">
				<tbody>
					<tr>
						<th scope="row">
							<label for="oneeighty-reval-enabled">
								<?php esc_html_e( 'Enabled', '180life-revalidation' ); ?>
							</label>
						</th>
						<td>
							<label class="oneeighty-reval-toggle">
								<input
									type="checkbox"
									name="<?php echo esc_attr( ONEEIGHTY_REVAL_OPTION_KEY ); ?>[enabled]"
									id="oneeighty-reval-enabled"
									value="1"
									<?php checked( $settings['enabled'] ); ?>
								/>
								<span class="slider"></span>
							</label>
							<p class="description">
								<?php esc_html_e( 'Master toggle. Turn off to temporarily disable webhooks without uninstalling.', '180life-revalidation' ); ?>
							</p>
						</td>
					</tr>

					<tr>
						<th scope="row">
							<label for="oneeighty-reval-webhook-url">
								<?php esc_html_e( 'Webhook URL', '180life-revalidation' ); ?>
							</label>
						</th>
						<td>
							<input
								type="url"
								name="<?php echo esc_attr( ONEEIGHTY_REVAL_OPTION_KEY ); ?>[webhook_url]"
								id="oneeighty-reval-webhook-url"
								class="regular-text"
								value="<?php echo esc_attr( $settings['webhook_url'] ); ?>"
								placeholder="https://180lifechurch.org/api/revalidate"
							/>
							<p class="description">
								<?php esc_html_e( 'The Next.js revalidation endpoint URL. Use the production URL once the site is live; use the preview URL while testing.', '180life-revalidation' ); ?>
							</p>
						</td>
					</tr>

					<tr>
						<th scope="row">
							<label for="oneeighty-reval-secret">
								<?php esc_html_e( 'Revalidation Secret', '180life-revalidation' ); ?>
							</label>
						</th>
						<td>
							<input
								type="password"
								name="<?php echo esc_attr( ONEEIGHTY_REVAL_OPTION_KEY ); ?>[revalidation_secret]"
								id="oneeighty-reval-secret"
								class="regular-text oneeighty-reval-secret"
								value="<?php echo esc_attr( $settings['revalidation_secret'] ); ?>"
								autocomplete="new-password"
							/>
							<button type="button" class="button button-secondary oneeighty-reval-toggle-visibility" data-target="oneeighty-reval-secret">
								<?php esc_html_e( 'Show', '180life-revalidation' ); ?>
							</button>
							<p class="description">
								<?php esc_html_e( 'Sent as the x-revalidation-secret header. Must match WORDPRESS_REVALIDATION_SECRET in Vercel env vars.', '180life-revalidation' ); ?>
							</p>
						</td>
					</tr>

					<tr>
						<th scope="row">
							<label for="oneeighty-reval-bypass-token">
								<?php esc_html_e( 'Vercel Bypass Token', '180life-revalidation' ); ?>
								<span class="oneeighty-reval-optional"><?php esc_html_e( '(optional)', '180life-revalidation' ); ?></span>
							</label>
						</th>
						<td>
							<input
								type="password"
								name="<?php echo esc_attr( ONEEIGHTY_REVAL_OPTION_KEY ); ?>[bypass_token]"
								id="oneeighty-reval-bypass-token"
								class="regular-text oneeighty-reval-secret"
								value="<?php echo esc_attr( $settings['bypass_token'] ); ?>"
								autocomplete="new-password"
							/>
							<button type="button" class="button button-secondary oneeighty-reval-toggle-visibility" data-target="oneeighty-reval-bypass-token">
								<?php esc_html_e( 'Show', '180life-revalidation' ); ?>
							</button>
							<p class="description">
								<?php
								echo wp_kses_post(
									__( 'Generate at <strong>Vercel → Project → Settings → Deployment Protection → Protection Bypass for Automation</strong>. Required only when targeting a preview deployment that is protected. Leave blank for production.', '180life-revalidation' )
								);
								?>
							</p>
						</td>
					</tr>

					<tr>
						<th scope="row">
							<?php esc_html_e( 'Test Connection', '180life-revalidation' ); ?>
						</th>
						<td>
							<button type="button" id="oneeighty-reval-test-button" class="button button-primary">
								<?php esc_html_e( 'Run Test', '180life-revalidation' ); ?>
							</button>
							<div id="oneeighty-reval-test-result" class="oneeighty-reval-test-result" aria-live="polite"></div>
							<p class="description">
								<?php esc_html_e( 'Fires a webhook with the values currently in the form (no save required) and shows the response.', '180life-revalidation' ); ?>
							</p>
						</td>
					</tr>
				</tbody>
			</table>

			<?php submit_button( __( 'Save Settings', '180life-revalidation' ) ); ?>
		</form>
		<?php
	}

	private static function render_mapping_tab( array $settings ): void {
		$mapping  = $settings['tag_mapping'] ?? [];
		$post_types = get_post_types( [ 'public' => false, '_builtin' => false ], 'objects' );
		$builtin    = [
			'page' => get_post_type_object( 'page' ),
			'post' => get_post_type_object( 'post' ),
		];
		$all_types = array_merge( array_filter( $builtin ), $post_types );
		?>
		<form method="post" action="options.php" class="oneeighty-reval-form">
			<?php settings_fields( '180life_revalidation_group' ); ?>

			<p class="description">
				<?php esc_html_e( 'Map post types to cache tags. When a post of a given type is published or updated, the listed tags are sent to the Next.js revalidation endpoint. Post types not listed here will not trigger any webhook.', '180life-revalidation' ); ?>
			</p>

			<table class="widefat striped oneeighty-reval-mapping">
				<thead>
					<tr>
						<th><?php esc_html_e( 'Post Type', '180life-revalidation' ); ?></th>
						<th><?php esc_html_e( 'Slug', '180life-revalidation' ); ?></th>
						<th><?php esc_html_e( 'Tags (comma-separated)', '180life-revalidation' ); ?></th>
					</tr>
				</thead>
				<tbody>
					<?php
					// Show known post types first, then any extras from saved mapping
					$known_slugs = [];
					foreach ( $all_types as $slug => $obj ) {
						$known_slugs[] = $slug;
						$tags          = isset( $mapping[ $slug ] ) ? implode( ', ', (array) $mapping[ $slug ] ) : '';
						?>
						<tr>
							<td><?php echo esc_html( $obj->labels->singular_name ); ?></td>
							<td><code><?php echo esc_html( $slug ); ?></code></td>
							<td>
								<input
									type="text"
									name="<?php echo esc_attr( ONEEIGHTY_REVAL_OPTION_KEY ); ?>[tag_mapping][<?php echo esc_attr( $slug ); ?>]"
									value="<?php echo esc_attr( $tags ); ?>"
									class="regular-text"
									placeholder="<?php esc_attr_e( 'e.g. wordpress, ministries', '180life-revalidation' ); ?>"
								/>
							</td>
						</tr>
						<?php
					}

					// Any extra mappings saved that aren't currently registered post types
					foreach ( $mapping as $slug => $tags ) {
						if ( in_array( $slug, $known_slugs, true ) ) {
							continue;
						}
						$tags_str = implode( ', ', (array) $tags );
						?>
						<tr>
							<td><em><?php esc_html_e( '(unregistered)', '180life-revalidation' ); ?></em></td>
							<td><code><?php echo esc_html( $slug ); ?></code></td>
							<td>
								<input
									type="text"
									name="<?php echo esc_attr( ONEEIGHTY_REVAL_OPTION_KEY ); ?>[tag_mapping][<?php echo esc_attr( $slug ); ?>]"
									value="<?php echo esc_attr( $tags_str ); ?>"
									class="regular-text"
								/>
							</td>
						</tr>
						<?php
					}
					?>
				</tbody>
			</table>

			<p class="description" style="margin-top:1em">
				<strong><?php esc_html_e( 'Valid tags:', '180life-revalidation' ); ?></strong>
				<code>wordpress</code>, <code>events</code>, <code>ministries</code>, <code>leadership</code>, <code>sermons</code>, <code>settings</code>, <code>pages</code>
			</p>

			<?php submit_button( __( 'Save Tag Mapping', '180life-revalidation' ) ); ?>
		</form>
		<?php
	}

	private static function render_log_tab( array $log ): void {
		?>
		<div class="oneeighty-reval-log-toolbar">
			<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" style="display:inline">
				<input type="hidden" name="action" value="180life_reval_clear_log" />
				<?php wp_nonce_field( '180life_reval_clear_log' ); ?>
				<button type="submit" class="button" onclick="return confirm('<?php esc_attr_e( 'Clear the activity log? This cannot be undone.', '180life-revalidation' ); ?>')">
					<?php esc_html_e( 'Clear Log', '180life-revalidation' ); ?>
				</button>
			</form>
			<a href="<?php echo esc_url( admin_url( 'options-general.php?page=180life-revalidation&tab=log' ) ); ?>" class="button">
				<?php esc_html_e( 'Refresh', '180life-revalidation' ); ?>
			</a>
		</div>

		<?php if ( empty( $log ) ) : ?>
			<div class="oneeighty-reval-empty-state">
				<span class="dashicons dashicons-update"></span>
				<p>
					<?php esc_html_e( 'No activity yet.', '180life-revalidation' ); ?><br/>
					<?php esc_html_e( 'Webhook events will appear here as soon as content is published or updated.', '180life-revalidation' ); ?>
				</p>
			</div>
		<?php else : ?>
			<table class="widefat striped oneeighty-reval-log">
				<thead>
					<tr>
						<th class="col-time"><?php esc_html_e( 'When', '180life-revalidation' ); ?></th>
						<th class="col-status"><?php esc_html_e( 'Status', '180life-revalidation' ); ?></th>
						<th><?php esc_html_e( 'Post', '180life-revalidation' ); ?></th>
						<th><?php esc_html_e( 'Type', '180life-revalidation' ); ?></th>
						<th><?php esc_html_e( 'Tags', '180life-revalidation' ); ?></th>
						<th><?php esc_html_e( 'Trigger', '180life-revalidation' ); ?></th>
						<th class="col-message"><?php esc_html_e( 'Result', '180life-revalidation' ); ?></th>
					</tr>
				</thead>
				<tbody>
					<?php foreach ( $log as $entry ) : ?>
						<tr>
							<td class="col-time" title="<?php echo esc_attr( wp_date( get_option( 'date_format' ) . ' ' . get_option( 'time_format' ), $entry['time'] ) ); ?>">
								<?php echo esc_html( Logger::time_ago( (int) $entry['time'] ) ); ?>
							</td>
							<td class="col-status">
								<?php
								$status = $entry['status'] ?? 'info';
								$class  = 'is-' . sanitize_html_class( $status );
								?>
								<span class="oneeighty-reval-status <?php echo esc_attr( $class ); ?>">
									<?php echo esc_html( $status ); ?>
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
										<?php
										echo esc_html(
											sprintf(
												/* translators: %d milliseconds */
												__( '(%d ms)', '180life-revalidation' ),
												(int) $entry['elapsed_ms']
											)
										);
										?>
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
