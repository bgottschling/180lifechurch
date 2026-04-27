<?php
/**
 * Activity logger.
 *
 * Stores up to 50 recent webhook events in a single WP option for
 * fast retrieval on the settings page. No database table required.
 *
 * @package OneEightyLife\Sync
 */

namespace OneEightyLife\Sync;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Logger {

	/**
	 * Maximum number of log entries to retain.
	 */
	const MAX_ENTRIES = 50;

	/**
	 * Append a log entry.
	 *
	 * @param string $post_type    Post type slug or 'plugin' for system events.
	 * @param string $post_title   Title of the post that triggered the webhook.
	 * @param string $tags         Comma-separated tags fired.
	 * @param string $trigger      Source hook (e.g., 'publish → publish').
	 * @param string $status       'pass', 'fail', or 'info'.
	 * @param string $message      Short status message.
	 * @param int    $elapsed_ms   Round-trip time in milliseconds.
	 * @param string $response     Optional response body for debugging.
	 */
	public static function log(
		string $post_type,
		string $post_title,
		string $tags,
		string $trigger,
		string $status,
		string $message = '',
		int $elapsed_ms = 0,
		string $response = ''
	): void {
		$log = get_option( ONEEIGHTY_SYNC_LOG_KEY, [] );
		if ( ! is_array( $log ) ) {
			$log = [];
		}

		$entry = [
			'time'       => time(),
			'post_type'  => $post_type,
			'post_title' => $post_title,
			'tags'       => $tags,
			'trigger'    => $trigger,
			'status'     => $status,
			'message'    => $message,
			'elapsed_ms' => $elapsed_ms,
			'response'   => mb_substr( $response, 0, 500 ),
		];

		array_unshift( $log, $entry );
		$log = array_slice( $log, 0, self::MAX_ENTRIES );

		update_option( ONEEIGHTY_SYNC_LOG_KEY, $log, false );
	}

	/**
	 * Retrieve all log entries (newest first).
	 */
	public static function all(): array {
		$log = get_option( ONEEIGHTY_SYNC_LOG_KEY, [] );
		return is_array( $log ) ? $log : [];
	}

	/**
	 * Clear the log.
	 */
	public static function clear(): void {
		update_option( ONEEIGHTY_SYNC_LOG_KEY, [], false );
	}

	/**
	 * Get a human-readable "X minutes ago" string.
	 */
	public static function time_ago( int $time ): string {
		$diff = time() - $time;
		if ( $diff < 60 ) {
			return sprintf( _n( '%d second ago', '%d seconds ago', $diff, '180life-sync' ), $diff );
		}
		if ( $diff < 3600 ) {
			$minutes = (int) floor( $diff / 60 );
			return sprintf( _n( '%d minute ago', '%d minutes ago', $minutes, '180life-sync' ), $minutes );
		}
		if ( $diff < 86400 ) {
			$hours = (int) floor( $diff / 3600 );
			return sprintf( _n( '%d hour ago', '%d hours ago', $hours, '180life-sync' ), $hours );
		}
		$days = (int) floor( $diff / 86400 );
		return sprintf( _n( '%d day ago', '%d days ago', $days, '180life-sync' ), $days );
	}
}
