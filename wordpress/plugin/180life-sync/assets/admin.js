/**
 * 180 Life Sync - Admin JS
 *
 * Handles:
 *   - Show/hide buttons on password-style fields (revalidation secret, bypass token)
 *   - "Test Connection" button: AJAX call that fires a webhook with the
 *     values currently in the form (no save required) and renders the result.
 *   - "Run Health Check Now" button: AJAX call that polls the /api/wordpress-health
 *     diagnostic endpoint and re-renders the result panel inline.
 */
(function ($) {
	'use strict';

	const cfg  = window.OneEightySyncAdmin || {};
	const i18n = cfg.i18n || {};
	const nonces = cfg.nonces || {};

	$(function () {
		// Show/hide secret fields
		$('.oneeighty-sync-toggle-visibility').on('click', function () {
			const $btn = $(this);
			const targetId = $btn.data('target');
			const $input = $('#' + targetId);
			if ($input.attr('type') === 'password') {
				$input.attr('type', 'text');
				$btn.text(i18n.hide || 'Hide');
			} else {
				$input.attr('type', 'password');
				$btn.text(i18n.show || 'Show');
			}
		});

		// Test connection button
		$('#oneeighty-sync-test-button').on('click', function () {
			const $btn = $(this);
			const $result = $('#oneeighty-sync-test-result');

			$btn.prop('disabled', true);
			$result
				.removeClass('is-success is-error')
				.addClass('is-loading')
				.html('<strong>' + (i18n.testing || 'Testing…') + '</strong>');

			$.post(cfg.ajaxUrl, {
				action: '180life_sync_test',
				nonce: nonces.test,
				webhook_url: $('#oneeighty-sync-webhook-url').val(),
				revalidation_secret: $('#oneeighty-sync-secret').val(),
				bypass_token: $('#oneeighty-sync-bypass-token').val(),
			})
				.done(function (response) {
					$btn.prop('disabled', false);
					if (response && response.success) {
						$result
							.removeClass('is-loading is-error')
							.addClass('is-success')
							.html(
								'<strong>' + (i18n.success || 'Success!') + '</strong>' +
									escapeHtml(response.data.message || '')
							);
					} else {
						const msg = (response && response.data && response.data.message) || (i18n.failed || 'Failed');
						const body = (response && response.data && response.data.body) || '';
						$result
							.removeClass('is-loading is-success')
							.addClass('is-error')
							.html(
								'<strong>' + (i18n.failed || 'Failed') + '</strong>' +
									escapeHtml(msg) +
									(body ? '<br/><code>' + escapeHtml(body.substring(0, 300)) + '</code>' : '')
							);
					}
				})
				.fail(function (xhr) {
					$btn.prop('disabled', false);
					$result
						.removeClass('is-loading is-success')
						.addClass('is-error')
						.html(
							'<strong>' + (i18n.failed || 'Failed') + '</strong>' +
								'HTTP ' + xhr.status + ' — could not reach AJAX endpoint.'
						);
				});
		});

		// Scoped content refresh (all / planning-center / wordpress)
		$('#oneeighty-sync-refresh-pc-button').on('click', function () {
			const $btn = $(this);
			const $result = $('#oneeighty-sync-refresh-pc-result');
			const scope = $('#oneeighty-sync-refresh-pc-scope').val() || 'all';

			// Friendly loading message per scope
			const scopeLabels = {
				all: 'all content',
				'planning-center': 'Planning Center content',
				wordpress: 'WordPress content',
			};
			const loadingMsg =
				(i18n.refreshing || 'Refreshing') +
				' ' +
				(scopeLabels[scope] || 'content') +
				'…';

			$btn.prop('disabled', true);
			$result
				.removeClass('is-success is-error')
				.addClass('is-loading')
				.html('<strong>' + escapeHtml(loadingMsg) + '</strong>');

			$.post(cfg.ajaxUrl, {
				action: '180life_sync_refresh_pc',
				nonce: nonces.refreshPc,
				scope: scope,
			})
				.done(function (response) {
					$btn.prop('disabled', false);
					if (response && response.success) {
						$result
							.removeClass('is-loading is-error')
							.addClass('is-success')
							.html(
								'<strong>' + (i18n.success || 'Success!') + '</strong>' +
									escapeHtml(response.data.message || '')
							);
					} else {
						const msg =
							(response && response.data && response.data.message) ||
							(i18n.failed || 'Failed');
						$result
							.removeClass('is-loading is-success')
							.addClass('is-error')
							.html(
								'<strong>' + (i18n.failed || 'Failed') + '</strong>' +
									escapeHtml(msg)
							);
					}
				})
				.fail(function (xhr) {
					$btn.prop('disabled', false);
					$result
						.removeClass('is-loading is-success')
						.addClass('is-error')
						.html(
							'<strong>' + (i18n.failed || 'Failed') + '</strong>' +
								'HTTP ' + xhr.status + ' — could not reach AJAX endpoint.'
						);
				});
		});

		// Run health check now
		$('#oneeighty-sync-health-button').on('click', function () {
			const $btn = $(this);
			const $panel = $('#oneeighty-sync-health-result');

			$btn.prop('disabled', true);
			$panel.html(
				'<div class="oneeighty-sync-empty-state">' +
					'<span class="dashicons dashicons-update spin"></span>' +
					'<p>' + escapeHtml(i18n.checking || 'Checking…') + '</p>' +
					'</div>'
			);

			$.post(cfg.ajaxUrl, {
				action: '180life_sync_health',
				nonce: nonces.health,
			})
				.done(function (response) {
					$btn.prop('disabled', false);
					if (response && response.success) {
						$panel.html(renderHealthDetail(response.data));
					} else {
						const msg = (response && response.data && response.data.message) || (i18n.failed || 'Failed');
						$panel.html(
							'<div class="oneeighty-sync-empty-state">' +
								'<span class="dashicons dashicons-warning"></span>' +
								'<p>' + escapeHtml(msg) + '</p>' +
								'</div>'
						);
					}
				})
				.fail(function (xhr) {
					$btn.prop('disabled', false);
					$panel.html(
						'<div class="oneeighty-sync-empty-state">' +
							'<span class="dashicons dashicons-warning"></span>' +
							'<p>HTTP ' + xhr.status + ' — could not reach AJAX endpoint.</p>' +
							'</div>'
					);
				});
		});
	});

	/**
	 * Render the health detail HTML client-side after a manual run.
	 * Mirrors the server-side render_health_detail() output structure.
	 */
	function renderHealthDetail(health) {
		const overall = (health && health.overall) || 'unknown';
		const summary = (health && health.summary) || '';
		const checks = (health && health.checks) || [];
		const elapsed = (health && health.elapsed_ms) || 0;

		let cls = 'is-idle';
		if (overall === 'healthy') cls = 'is-healthy';
		else if (overall === 'degraded') cls = 'is-warn';
		else if (overall === 'broken') cls = 'is-error';

		let html = '<div class="oneeighty-sync-health-summary ' + cls + '">';
		html += '<div class="overall"><span class="dot"></span><strong>' +
			escapeHtml(overall.charAt(0).toUpperCase() + overall.slice(1)) + '</strong></div>';
		html += '<div class="message">' + escapeHtml(summary) + '</div>';
		html += '<div class="meta">just now — round trip ' + parseInt(elapsed, 10) + ' ms</div>';
		html += '</div>';

		if (checks.length > 0) {
			html += '<table class="widefat striped oneeighty-sync-health-checks">';
			html += '<thead><tr><th class="col-check">Check</th><th class="col-status">Status</th><th>Details</th></tr></thead><tbody>';
			checks.forEach(function (c) {
				const status = (c.status || 'info').toLowerCase();
				html += '<tr>';
				html += '<td class="col-check"><strong>' + escapeHtml(c.name || '') + '</strong></td>';
				html += '<td class="col-status"><span class="oneeighty-sync-status is-' +
					escapeAttr(status) + '">' + escapeHtml(status) + '</span></td>';
				html += '<td>';
				html += '<div class="check-message">' + escapeHtml(c.message || '') + '</div>';
				if (c.detail) {
					html += '<div class="check-detail">' + escapeHtml(c.detail) + '</div>';
				}
				html += '</td></tr>';
			});
			html += '</tbody></table>';
		}
		return html;
	}

	function escapeHtml(str) {
		return String(str == null ? '' : str)
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#039;');
	}

	function escapeAttr(str) {
		return String(str == null ? '' : str).replace(/[^a-z0-9_-]/gi, '');
	}
})(jQuery);
