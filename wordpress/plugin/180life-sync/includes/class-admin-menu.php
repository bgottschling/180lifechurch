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
		'sermon_series',
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
			[
				'cpt'         => 'sermon_series',
				'label'       => __( 'Sermon Series', '180life-sync' ),
				'description' => __( 'Sermons page entries with nested sermon list (title, date, YouTube ID, speaker).', '180life-sync' ),
				'icon'        => 'dashicons-playlist-video',
				'singleton'   => false,
			],
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
