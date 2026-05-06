<?php
/**
 * Plugin Name:       180 Life Sync
 * Plugin URI:        https://github.com/bgottschling/180lifechurch
 * Description:       Keeps the live Next.js site in sync with WordPress. Automatically fires cache revalidation webhooks when content is published or updated, and periodically verifies the headless integration is healthy.
 * Version:           1.2.0
 * Requires at least: 5.6
 * Requires PHP:      7.4
 * Author:            Brandon Gottschling
 * Author URI:        https://gottschling.dev
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       180life-sync
 *
 * @package OneEightyLife\Sync
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'ONEEIGHTY_SYNC_VERSION', '1.2.0' );
define( 'ONEEIGHTY_SYNC_FILE', __FILE__ );
define( 'ONEEIGHTY_SYNC_PATH', plugin_dir_path( __FILE__ ) );
define( 'ONEEIGHTY_SYNC_URL', plugin_dir_url( __FILE__ ) );
define( 'ONEEIGHTY_SYNC_OPTION_KEY', '180life_sync_settings' );
define( 'ONEEIGHTY_SYNC_LOG_KEY', '180life_sync_log' );
define( 'ONEEIGHTY_SYNC_HEALTH_KEY', '180life_sync_health' );
define( 'ONEEIGHTY_SYNC_CRON_HOOK', '180life_sync_health_check' );

require_once ONEEIGHTY_SYNC_PATH . 'includes/class-logger.php';
require_once ONEEIGHTY_SYNC_PATH . 'includes/class-webhook.php';
require_once ONEEIGHTY_SYNC_PATH . 'includes/class-health.php';
require_once ONEEIGHTY_SYNC_PATH . 'includes/class-admin-menu.php';
require_once ONEEIGHTY_SYNC_PATH . 'includes/class-settings.php';
require_once ONEEIGHTY_SYNC_PATH . 'includes/class-test.php';
require_once ONEEIGHTY_SYNC_PATH . 'includes/class-plugin.php';

\OneEightyLife\Sync\Plugin::boot();

register_activation_hook( __FILE__, [ '\OneEightyLife\Sync\Plugin', 'on_activate' ] );
register_deactivation_hook( __FILE__, [ '\OneEightyLife\Sync\Plugin', 'on_deactivate' ] );
register_uninstall_hook( __FILE__, [ '\OneEightyLife\Sync\Plugin', 'on_uninstall' ] );
