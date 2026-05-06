<?php
/**
 * Admin menu consolidator.
 *
 * Groups all church-managed custom post types under a single
 * top-level "180 Life" menu in the wp-admin sidebar, so editors
 * see one clear hub for site content instead of multiple
 * top-level menu items.
 *
 * Implementation:
 *   - Registers a top-level menu "180 Life" with a simple landing page.
 *   - Filters register_post_type_args() so each managed CPT's
 *     show_in_menu points to our parent slug.
 *   - Filters parent_file() so the parent menu stays highlighted
 *     when editing one of the managed CPTs.
 *
 * Toggleable via the "Consolidate Menus" setting on the General
 * tab of the 180 Life Sync settings page.
 *
 * @package OneEightyLife\Sync
 */

namespace OneEightyLife\Sync;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class AdminMenu {

	/** Top-level menu slug. */
	const PARENT_SLUG = '180life-content';

	/** Menu display title. */
	const PARENT_TITLE = '180 Life';

	/** Position in the admin sidebar (lower = higher up). */
	const PARENT_POSITION = 4;

	/** Dashicon used for the parent menu. */
	const PARENT_ICON = 'dashicons-store';

	/**
	 * Custom post types managed under the parent menu.
	 * Uses the slug values that match register_post_type() registrations.
	 */
	const MANAGED_CPTS = [
		'site_settings',
		'ministry',
		'staff',
		'elder',
		// sermon_series removed in v1.1.0 — sermons sourced from
		// Planning Center Publishing API; no WP-side editing.
	];

	public static function register(): void {
		// Only consolidate if the user has opted in
		$settings = Plugin::get_settings();
		if ( empty( $settings['consolidate_menus'] ) ) {
			return;
		}

		add_filter( 'register_post_type_args', [ self::class, 'redirect_cpt_menus' ], 10, 2 );
		add_action( 'admin_menu', [ self::class, 'create_parent_menu' ], 5 );
		add_filter( 'parent_file', [ self::class, 'highlight_parent_menu' ] );
	}

	/**
	 * When ACF Pro (or anything else) registers one of our managed
	 * post types, override its show_in_menu so it nests under the
	 * 180 Life parent.
	 */
	public static function redirect_cpt_menus( array $args, string $post_type ): array {
		if ( in_array( $post_type, self::MANAGED_CPTS, true ) ) {
			$args['show_in_menu'] = self::PARENT_SLUG;
		}
		return $args;
	}

	/**
	 * Create the parent menu page.
	 */
	public static function create_parent_menu(): void {
		add_menu_page(
			self::PARENT_TITLE,
			self::PARENT_TITLE,
			'edit_posts',
			self::PARENT_SLUG,
			[ self::class, 'render_landing_page' ],
			self::PARENT_ICON,
			self::PARENT_POSITION
		);
	}

	/**
	 * Keep the 180 Life parent menu highlighted in the sidebar
	 * while the user is editing one of the managed CPTs.
	 */
	public static function highlight_parent_menu( $parent_file ) {
		global $current_screen;
		if ( ! $current_screen ) {
			return $parent_file;
		}
		if ( in_array( $current_screen->post_type, self::MANAGED_CPTS, true ) ) {
			return self::PARENT_SLUG;
		}
		return $parent_file;
	}

	/**
	 * Quick Actions panel rendered above the content cards on the
	 * Content Hub landing page. Surfaces the two operations editors
	 * reach for most often — refreshing the public site's cache and
	 * checking the live integration health — without requiring them
	 * to dig into Settings → 180 Life Sync.
	 *
	 * Reuses the same DOM IDs and AJAX handlers as the Sync settings
	 * page (#oneeighty-sync-refresh-pc-button, #oneeighty-sync-health-button)
	 * so no new JS is required. enqueue_assets() already loads admin.js
	 * and the OneEightySyncAdmin nonces on this hook.
	 */
	private static function render_quick_actions(): void {
		// Pull latest cached health for the status panel. If never run,
		// $health is null and the panel falls into idle state.
		$health = Health::latest();
		$overall = $health['overall'] ?? null;

		$state_class = 'is-idle';
		$state_label = __( 'Not yet checked', '180life-sync' );
		$state_msg   = __( 'Run a health check to verify the live integration is reaching WordPress and Planning Center.', '180life-sync' );

		if ( 'healthy' === $overall ) {
			$state_class = 'is-healthy';
			$state_label = __( 'Healthy', '180life-sync' );
			$state_msg   = $health['summary'] ?? __( 'All checks passing.', '180life-sync' );
		} elseif ( 'degraded' === $overall ) {
			$state_class = 'is-warn';
			$state_label = __( 'Degraded', '180life-sync' );
			$state_msg   = $health['summary'] ?? __( 'Some checks are warning. Site is running on fallbacks.', '180life-sync' );
		} elseif ( 'broken' === $overall ) {
			$state_class = 'is-error';
			$state_label = __( 'Broken', '180life-sync' );
			$state_msg   = $health['summary'] ?? __( 'One or more integrations are failing.', '180life-sync' );
		}

		$last_checked  = ! empty( $health['timestamp'] ) ? (int) $health['timestamp'] : 0;
		$health_url    = admin_url( 'options-general.php?page=180life-sync&tab=health' );
		?>
		<div class="oneeighty-sync-hub-actions">
			<div class="oneeighty-sync-hub-action-card oneeighty-sync-hub-health <?php echo esc_attr( $state_class ); ?>">
				<div class="hub-action-header">
					<span class="dashicons dashicons-heart"></span>
					<h3><?php esc_html_e( 'Site Health', '180life-sync' ); ?></h3>
					<span class="hub-action-pill"><?php echo esc_html( $state_label ); ?></span>
				</div>
				<p class="hub-action-message"><?php echo esc_html( $state_msg ); ?></p>
				<?php if ( $last_checked ) : ?>
					<p class="hub-action-meta">
						<?php
						printf(
							/* translators: %s relative time */
							esc_html__( 'Last checked %s', '180life-sync' ),
							esc_html( Logger::time_ago( $last_checked ) )
						);
						?>
					</p>
				<?php endif; ?>
				<div class="hub-action-buttons">
					<button type="button" id="oneeighty-sync-health-button" class="button button-secondary">
						<span class="dashicons dashicons-update" style="vertical-align: text-bottom; margin-right: 4px"></span>
						<?php esc_html_e( 'Run Health Check', '180life-sync' ); ?>
					</button>
					<a href="<?php echo esc_url( $health_url ); ?>" class="button button-link">
						<?php esc_html_e( 'Full diagnostic →', '180life-sync' ); ?>
					</a>
				</div>
				<div id="oneeighty-sync-health-result" class="hub-action-result-slot"></div>
			</div>

			<div class="oneeighty-sync-hub-action-card oneeighty-sync-hub-refresh">
				<div class="hub-action-header">
					<span class="dashicons dashicons-update-alt"></span>
					<h3><?php esc_html_e( 'Refresh Content', '180life-sync' ); ?></h3>
				</div>
				<p class="hub-action-message">
					<?php esc_html_e( 'Force-refresh the public site\'s cached content. Use this after publishing a new sermon series or event registration in Planning Center if you don\'t want to wait for the next scheduled refresh.', '180life-sync' ); ?>
				</p>
				<div class="hub-action-row">
					<select id="oneeighty-sync-refresh-pc-scope" class="oneeighty-sync-scope-select">
						<option value="all"><?php esc_html_e( 'All content (recommended)', '180life-sync' ); ?></option>
						<option value="planning-center"><?php esc_html_e( 'Planning Center only', '180life-sync' ); ?></option>
						<option value="wordpress"><?php esc_html_e( 'WordPress only', '180life-sync' ); ?></option>
					</select>
					<button type="button" id="oneeighty-sync-refresh-pc-button" class="button button-primary">
						<span class="dashicons dashicons-update" style="vertical-align: text-bottom; margin-right: 4px"></span>
						<?php esc_html_e( 'Refresh Now', '180life-sync' ); ?>
					</button>
				</div>
				<div id="oneeighty-sync-refresh-pc-result" class="oneeighty-sync-test-result hub-action-result-slot" aria-live="polite"></div>
				<p class="hub-action-meta">
					<?php esc_html_e( 'Auto-refresh runs daily at 5 AM UTC and every Sunday at ~10:30 AM Eastern.', '180life-sync' ); ?>
				</p>
			</div>
		</div>
		<?php
	}

	/**
	 * Landing page shown when editors click the parent "180 Life"
	 * menu item directly. Lists each managed content type with
	 * a quick-edit link and an "Add New" link.
	 */
	public static function render_landing_page(): void {
		$cards = [
			[
				'cpt'         => 'site_settings',
				'label'       => __( 'Site Settings', '180life-sync' ),
				'description' => __( 'Hero text, contact info, social links, mission statement. One singleton entry, edit only.', '180life-sync' ),
				'icon'        => 'dashicons-admin-site-alt3',
				'singleton'   => true,
			],
			[
				'cpt'         => 'ministry',
				'label'       => __( 'Ministries', '180life-sync' ),
				'description' => __( 'Homepage ministry cards. Card image, description, sort order.', '180life-sync' ),
				'icon'        => 'dashicons-groups',
				'singleton'   => false,
			],
			[
				'cpt'         => 'staff',
				'label'       => __( 'Staff', '180life-sync' ),
				'description' => __( 'Pastors and staff for the Leadership page. Anyone with "Pastor" in their role appears as a pastor.', '180life-sync' ),
				'icon'        => 'dashicons-businessman',
				'singleton'   => false,
			],
			[
				'cpt'         => 'elder',
				'label'       => __( 'Elders', '180life-sync' ),
				'description' => __( 'Elder cards on the Leadership page. Name, role, optional photo.', '180life-sync' ),
				'icon'        => 'dashicons-shield-alt',
				'singleton'   => false,
			],
			// Note: Sermon Series previously lived here. As of v1.1.0,
			// sermons are sourced live from Planning Center Publishing
			// API and are not WordPress-managed.
		];

		?>
		<div class="wrap oneeighty-sync-content-hub">
			<h1>
				<span class="dashicons dashicons-store" style="font-size:32px;width:32px;height:32px;color:#2271b1;vertical-align:bottom"></span>
				<?php esc_html_e( '180 Life Content', '180life-sync' ); ?>
			</h1>
			<p style="font-size:14px;color:#646970;max-width:700px">
				<?php esc_html_e( 'Manage all editable content for the 180 Life Church website from one place. Pick a content type below to edit existing entries or add new ones.', '180life-sync' ); ?>
			</p>

			<?php self::render_quick_actions(); ?>

			<h2 class="oneeighty-sync-hub-section-heading">
				<?php esc_html_e( 'Content Types', '180life-sync' ); ?>
			</h2>
			<div class="oneeighty-sync-cards">
				<?php
				foreach ( $cards as $card ) :
					$post_type_obj = get_post_type_object( $card['cpt'] );
					if ( ! $post_type_obj ) {
						continue;
					}
					$edit_url = admin_url( 'edit.php?post_type=' . $card['cpt'] );
					$count    = (int) wp_count_posts( $card['cpt'] )->publish;
					$add_url  = admin_url( 'post-new.php?post_type=' . $card['cpt'] );
					?>
					<div class="oneeighty-sync-card">
						<div class="card-header">
							<span class="dashicons <?php echo esc_attr( $card['icon'] ); ?>"></span>
							<h2><?php echo esc_html( $card['label'] ); ?></h2>
							<span class="count">
								<?php
								if ( $card['singleton'] ) {
									echo esc_html__( 'singleton', '180life-sync' );
								} else {
									echo esc_html( sprintf(
										/* translators: %d post count */
										_n( '%d entry', '%d entries', $count, '180life-sync' ),
										$count
									) );
								}
								?>
							</span>
						</div>
						<p class="card-description"><?php echo esc_html( $card['description'] ); ?></p>
						<div class="card-actions">
							<a href="<?php echo esc_url( $edit_url ); ?>" class="button button-primary">
								<?php esc_html_e( 'Manage', '180life-sync' ); ?>
							</a>
							<?php if ( ! $card['singleton'] ) : ?>
								<a href="<?php echo esc_url( $add_url ); ?>" class="button">
									<?php esc_html_e( 'Add New', '180life-sync' ); ?>
								</a>
							<?php endif; ?>
						</div>
					</div>
				<?php endforeach; ?>
			</div>

			<div class="oneeighty-sync-hub-footer">
				<p>
					<span class="dashicons dashicons-admin-tools"></span>
					<?php
					printf(
						/* translators: %s settings page link */
						esc_html__( 'Manage publishing webhooks, periodic health checks, and the activity log on the %s page.', '180life-sync' ),
						'<a href="' . esc_url( admin_url( 'options-general.php?page=180life-sync' ) ) . '">' .
						esc_html__( '180 Life Sync settings', '180life-sync' ) .
						'</a>'
					);
					?>
				</p>
			</div>
		</div>
		<?php
	}
}
