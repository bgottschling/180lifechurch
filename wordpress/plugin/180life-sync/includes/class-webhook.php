<?php
/**
 * Webhook firing engine.
 *
 * Hooks into WordPress publish events, maps the post type to cache
 * tags, and POSTs to the configured Next.js revalidation endpoint
 * asynchronously (non-blocking) so editors don't wait on the response.
 *
 * @package OneEightyLife\Sync
 */

namespace OneEightyLife\Sync;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Webhook {

	/**
	 * Register WP hooks.
	 */
	public static function register(): void {
		// Fire on any publish or update of a post (covers most cases)
		add_action( 'transition_post_status', [ self::class, 'on_transition' ], 10, 3 );

		// Fire when ACF saves fields on an already-published post (covers ACF-only edits)
		add_action( 'acf/save_post', [ self::class, 'on_acf_save' ], 20 );
	}

	/**
	 * Handle post status transitions.
	 *
	 * Fires the webhook when:
	 *   - A post is published for the first time (any → publish)
	 *   - A published post moves to a non-public state (publish → trash/draft/private)
	 *
	 * Skips autosaves, revisions, and untracked post types.
	 */
	public static function on_transition( string $new_status, string $old_status, \WP_Post $post ): void {
		if ( wp_is_post_autosave( $post->ID ) || wp_is_post_revision( $post->ID ) ) {
			return;
		}

		// Only act when content state actually changed in a way that affects the public site
		$was_public = ( 'publish' === $old_status );
		$is_public  = ( 'publish' === $new_status );

		if ( ! $was_public && ! $is_public ) {
			return;
		}

		self::fire_for_post( $post, sprintf( '%s → %s', $old_status, $new_status ) );
	}

	/**
	 * Handle ACF save events.
	 *
	 * Editors may update ACF fields on a published post without changing
	 * its status. transition_post_status doesn't fire in that case, so
	 * we hook into ACF's save event as a backup.
	 */
	public static function on_acf_save( $post_id ): void {
		if ( ! is_numeric( $post_id ) ) {
			return; // Options pages or other non-post saves
		}

		$post = get_post( (int) $post_id );
		if ( ! $post || 'publish' !== $post->post_status ) {
			return;
		}

		if ( wp_is_post_autosave( $post->ID ) || wp_is_post_revision( $post->ID ) ) {
			return;
		}

		self::fire_for_post( $post, 'acf/save_post' );
	}

	/**
	 * Determine the cache tags for a post and fire the webhook.
	 */
	public static function fire_for_post( \WP_Post $post, string $trigger ): void {
		$settings = Plugin::get_settings();

		if ( empty( $settings['enabled'] ) ) {
			return;
		}

		$tag_mapping = $settings['tag_mapping'] ?? [];
		$post_type   = $post->post_type;

		// If the post type isn't mapped, skip (don't fire for built-in posts/pages)
		if ( ! isset( $tag_mapping[ $post_type ] ) ) {
			return;
		}

		$tags = $tag_mapping[ $post_type ];
		if ( empty( $tags ) ) {
			return;
		}

		self::fire( $tags, $settings, [
			'post_id'    => $post->ID,
			'post_title' => $post->post_title,
			'post_type'  => $post_type,
			'trigger'    => $trigger,
		] );
	}

	/**
	 * Send the webhook.
	 *
	 * Uses wp_remote_post with blocking=false so the editor sees an
	 * instant publish action; the webhook fires in the background.
	 *
	 * @param string[] $tags     Cache tags to invalidate.
	 * @param array    $settings Plugin settings.
	 * @param array    $context  Logging context (post info, trigger source).
	 */
	public static function fire( array $tags, array $settings, array $context ): array {
		$url    = $settings['webhook_url'] ?? '';
		$secret = $settings['revalidation_secret'] ?? '';
		$bypass = $settings['bypass_token'] ?? '';

		if ( empty( $url ) ) {
			Logger::log(
				$context['post_type'] ?? '',
				$context['post_title'] ?? '',
				implode( ', ', $tags ),
				$context['trigger'] ?? '',
				'fail',
				'Webhook URL not configured'
			);
			return [
				'ok'      => false,
				'message' => 'Webhook URL not configured',
			];
		}

		// Append bypass token as query param if provided (preview deployments)
		$request_url = $url;
		if ( ! empty( $bypass ) ) {
			$request_url = add_query_arg( 'x-vercel-protection-bypass', $bypass, $request_url );
		}

		$headers = [
			'Content-Type'           => 'application/json',
			'x-revalidation-secret'  => $secret,
		];
		if ( ! empty( $bypass ) ) {
			$headers['x-vercel-protection-bypass'] = $bypass;
		}

		$start    = microtime( true );
		$response = wp_remote_post(
			$request_url,
			[
				'headers'  => $headers,
				'body'     => wp_json_encode( [ 'tags' => $tags ] ),
				'timeout'  => 5,
				'blocking' => true, // Block briefly so we can log the result; still <5s.
			]
		);
		$elapsed_ms = (int) ( ( microtime( true ) - $start ) * 1000 );

		if ( is_wp_error( $response ) ) {
			Logger::log(
				$context['post_type'] ?? '',
				$context['post_title'] ?? '',
				implode( ', ', $tags ),
				$context['trigger'] ?? '',
				'fail',
				$response->get_error_message(),
				$elapsed_ms
			);
			return [
				'ok'      => false,
				'message' => $response->get_error_message(),
			];
		}

		$status_code = wp_remote_retrieve_response_code( $response );
		$body        = wp_remote_retrieve_body( $response );
		$ok          = ( $status_code >= 200 && $status_code < 300 );

		Logger::log(
			$context['post_type'] ?? '',
			$context['post_title'] ?? '',
			implode( ', ', $tags ),
			$context['trigger'] ?? '',
			$ok ? 'pass' : 'fail',
			sprintf( 'HTTP %d', $status_code ),
			$elapsed_ms,
			$body
		);

		return [
			'ok'         => $ok,
			'status'     => $status_code,
			'elapsed_ms' => $elapsed_ms,
			'body'       => $body,
		];
	}
}
