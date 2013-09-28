$(function() {
	var inputs = $('[data-placeholder]');

	inputs.each(function() {
		var $this = $(this),
			wrapper = $this.wrap('<div class="input-wrapper">').closest('.input-wrapper'),
			placeholder = ($this.is('input[type="text"]') || $this.is('input[type="password"]')) ? $('<input type="text">') : $('<textarea>');

		placeholder
			.val($this.attr('data-placeholder'))
			.addClass('placeholder')
			.removeAttr('data-placeholder')
			.appendTo(wrapper)
			.css({
				width: $this.outerWidth(),
				height: $this.outerHeight()
			});

		wrapper.css({
			float: $this.css('float'),
			width: $this.outerWidth(),
			marginTop: $this.css('marginTop'),
			marginRight: $this.css('marginRight'),
			marginBottom: $this.css('marginBottom'),
			marginLeft: $this.css('marginLeft')
		});

		if ($this.val() != '') {
			placeholder.fadeOut(200, function() {
				placeholder.addClass('hidden')
			});
		}

		placeholder.focus(function() {
			$this.focus();
			placeholder.fadeOut(100, function() {
				placeholder.addClass('hidden')
			});
		});

		$this
			.focus(function() {
				placeholder.fadeOut(100, function() {
					placeholder.addClass('hidden')
				});
			})
			.blur(function() {
				if ($this.val() == '') {
					placeholder.removeClass('hidden');
					placeholder.fadeIn(100);
				}
			}
		)
	})
});