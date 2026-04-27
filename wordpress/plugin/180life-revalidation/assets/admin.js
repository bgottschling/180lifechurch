/**
 * 180 Life Revalidation - Admin JS
 *
 * Handles:
 *   - Show/hide buttons on password-style fields (revalidation secret, bypass token)
 *   - "Test Connection" button: AJAX call that fires a webhook with the
 *     values currently in the form (no save required) and renders the result.
 */
(function ($) {
	'use strict';

	const i18n = (window.OneEightyRevalAdmin && window.OneEightyRevalAdmin.i18n) || {};

	$(function () {
		// Show/hide secret fields
		$('.oneeighty-reval-toggle-visibility').on('click', function () {
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
		$('#oneeighty-reval-test-button').on('click', function () {
			const $btn = $(this);
			const $result = $('#oneeighty-reval-test-result');

			$btn.prop('disabled', true);
			$result
				.removeClass('is-success is-error')
				.addClass('is-loading')
				.html('<strong>' + (i18n.testing || 'Testing…') + '</strong>');

			$.post(window.OneEightyRevalAdmin.ajaxUrl, {
				action: '180life_reval_test',
				nonce: window.OneEightyRevalAdmin.nonce,
				webhook_url: $('#oneeighty-reval-webhook-url').val(),
				revalidation_secret: $('#oneeighty-reval-secret').val(),
				bypass_token: $('#oneeighty-reval-bypass-token').val(),
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
	});

	function escapeHtml(str) {
		return String(str)
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#039;');
	}
})(jQuery);
