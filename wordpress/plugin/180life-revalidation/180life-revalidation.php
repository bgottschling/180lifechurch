<?php
/**
 * Plugin Name:       180 Life Revalidation
 * Plugin URI:        https://github.com/bgottschling/180lifechurch
 * Description:       Automatically fires Next.js cache revalidation webhooks when content is published or updated. Built specifically for the 180 Life Church headless WordPress + Vercel architecture.
 * Version:           1.0.0
 * Requires at least: 5.6
 * Requires PHP:      7.4
 * Author:            Brandon Gottschling
 * Author URI:        https://gottschling.dev
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       180life-revalidation
 *
 * @package OneEightyLife\Revalidation
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'ONEEIGHTY_REVAL_VERSION', '1.0.0' );
define( 'ONEEIGHTY_REVAL_FILE', __FILE__ );
define( 'ONEEIGHTY_REVAL_PATH', plugin_dir_path( __FILE__ ) );
define( 'ONEEIGHTY_REVAL_URL', plugin_dir_url( __FILE__ ) );
define( 'ONEEIGHTY_REVAL_OPTION_KEY', '180life_revalidation_settings' );
define( 'ONEEIGHTY_REVAL_LOG_KEY', '180life_revalidation_log' );

require_once ONEEIGHTY_REVAL_PATH . 'includes/class-logger.php';
require_once ONEEIGHTY_REVAL_PATH . 'includes/class-webhook.php';
require_once ONEEIGHTY_REVAL_PATH . 'includes/class-settings.php';
require_once ONEEIGHTY_REVAL_PATH . 'includes/class-test.php';
require_once ONEEIGHTY_REVAL_PATH . 'includes/class-plugin.php';

\OneEightyLife\Revalidation\Plugin::boot();

register_activation_hook( __FILE__, [ '\OneEightyLife\Revalidation\Plugin', 'on_activate' ] );
register_uninstall_hook( __FILE__, [ '\OneEightyLife\Revalidation\Plugin', 'on_uninstall' ] );
