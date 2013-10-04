$(function() {
	primaryNav();
	carousel();
	searchBox();
	selects();
	dropdowns();
	customSelects();
	stylizeCheckbox();
	setLocation();
	openWindow();
	openAjaxWindow();
	scrollTop();
	faq();
	slider();
	scrollpane();
	gallery();
	setRating();
	datepicker();
	tooltips();
	popupPhoto();
});


var isMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent));

function primaryNav() {
	var nav = $('nav.primary > ul'),
		wrapper_width = nav.closest('.wrapper').outerWidth(),
		items_l1 = nav.find('> li'),
		nav_l2 = items_l1.find('> ul'),
		l1_item,
		elements_per_wrap = 13; //Elements quantity in every column

	nav_l2.each(function() {
		var $this = $(this);

		$this.css('minWidth', $this.parent().width())
	});

	items_l1.each(function() {
		var $this = $(this),
			links = $this.find('> ul > a');

		//Divide list by columns
		for (var i = 0; i < links.length; i += elements_per_wrap) {
			links.filter(':eq('+ i +'), :lt(' +  (i + elements_per_wrap) + '):gt(' + i + ')').wrapAll('<li />');
		}

		//Adding bullet, if popup exists
		if ($this.find('> ul').length) {
			$this.addClass('has-submenu');
			$this.find('> a').append('<i class="icon-" />');
		}
	});

	//Touch devices
	if (isMobile) {
		items_l1.each(function() {
			var submenu = $(this).find('> ul');

			if (submenu.length) {
				$(this).find('> a, > div').clone().prependTo(submenu).wrap('<div class="title">');
			}
		});

		items_l1.find('> a, > div').click(function(e) {
			if (l1_item != null) {
				hideSubmenu(l1_item.parent());
			}

			l1_item = $(this);
			var submenu = l1_item.parent().find('> ul');

			if (submenu.length) {
				showSubmenu(l1_item.parent(), submenu);
				e.stopPropagation();
				return false;
			}
		});

		$(document).click(function() {
			hideSubmenu(l1_item.parent());
		});
	//Not touch devices
	} else {
		items_l1.hover(
			function() {
				l1_item = $(this);
				var submenu = l1_item.find('> ul');

				showSubmenu(l1_item, submenu);
			},
			function() {
				hideSubmenu(l1_item);
			}
		);
	}

	function showSubmenu(i, submenu) {
		if (submenu.length) {
			i.find('> a, > div').addClass('active');
			var wrapper_offset = nav.closest('.wrapper').offset().left;

			if ((submenu.offset().left + submenu.width()) > (wrapper_width + wrapper_offset)) {
				var w = (submenu.offset().left + submenu.width()) - (wrapper_width + wrapper_offset);
				submenu.css({'marginLeft': -w - 2})
			}

			submenu.addClass('nav-visible').stop().slideDown(100);
		}
	}

	function hideSubmenu(i) {
		i.find('> a, > div').removeClass('active');
		i
			.stop().find('> ul').removeClass('nav-visible')
			.stop().fadeOut(100, function() {$(this).css({
				height: '',
				padding: '',
				opacity: 1
			})});
	}
}


function carousel() {
	var carousel = $('.carousel');

	if (carousel.length) {
		var nav = carousel.find('.carousel-nav');

		carousel.find('li').each(function() {
			nav.append('<div>&nbsp;</div>');
		});

		if (carousel.find('li').length > 1) {
			nav.show();
			carousel.find('.items').jCarouselLite({
				auto: true,
				speed: 800,
				visible: 1,
				timeout: 6000,
				easing: 'easeInOutQuad',
				btnGo: carousel.find('.carousel-nav div')
			});
		}
	}
}


function searchBox() {
	var box = $('.search-box'),
		normal = box.find('.normal'),
		advanced = box.find('.advanced'),
		toggle = box.find('.toggle div');

	toggle.click(function() {
		if (!advanced.is(':visible')) {
			normal.addClass('absolute').fadeOut(200);
			advanced
				.css('opacity', 0)
				.slideDown(400, function() {
					normal.removeClass('absolute');
					advanced.animate({'opacity': 1}, 100);
					toggle.addClass('alt').text(toggle.parent().data('alt-text'));
				}
			);
		} else {
			advanced.animate({
				height: ['toggle', 'easeOutQuad'],
				opacity: 'toggle'
			},
			{
				duration: 500,
				easing: 'easeOutQuad',
				complete: function() {
					toggle.removeClass('alt').text(toggle.parent().data('text'));
				}
			});

			normal.addClass('absolute').delay(300).fadeIn(200, function() {
				normal.removeClass('absolute');
			});
		}
	});
}

//Pop-up menu with columns and close button
function selects() {
	var selects = $('.select'),
		lists = selects.find('ul'),
		elements_per_wrap = 13, //Elements quantity in every column
		tip_timer;

	selects.each(function() {
		var $this = $(this),
			text = $this.find('> div'),
			list = $this.find('ul'),
			items = list.find('a');

		text.after('<div class="tip" />');
		list.prepend('<i class="icon-close"></i>');
		list.css({
			minWidth: $this.outerWidth()
		});

		var close = list.find('.icon-close'),
			tip = $this.find('.tip');

		//Divide list by columns
		for (var i = 0; i < items.length; i += elements_per_wrap) {
			items.filter(':eq('+ i +'), :lt(' +  (i + elements_per_wrap) + '):gt(' + i + ')').wrapAll('<li />');
		}

		$this.click(function(e) {
			//Hide all menus and restore initial state
			selects.removeClass('-active');
			lists.fadeOut(100);
			if (!list.is(':visible')) {
				clearTimeout(tip_timer);
				list.fadeIn(50);
				$this.addClass('-active')
			} else {
				$this.removeClass('-active')
			}
			e.stopPropagation();
		});

		$(document).click(function() {
			listClose(list);
		});

		close.click(function(e) {
			listClose(list);
			e.stopPropagation();
		});

		//Elements in pop-up, selecting of active
		items.click(function(e) {
			var $this = $(this);

			items.removeClass('selected');
			setTimeout(function() {
				$this.addClass('selected')
			}, 100);
			text.text($this.text()).addClass('selected');
			tip.text($this.text());
			listClose(list);
			e.stopPropagation();
		});

		list.click(function(e) {
			e.stopPropagation();
		});

		//Show tooltip if text don't fit
		$this.hover(
			function() {
				if (tip.width() > text.width()) {
					if (!list.is(':visible')) {
						tip_timer = setTimeout(function() {
							tip.stop().fadeIn(50)
						}, 200)
					}

					tip.css({'min-width': text.width() + 15});
				}
			},
			function() {
				clearTimeout(tip_timer);
				tip.stop().fadeOut(100, function() {
					tip.css({'min-width': ''})
				});
			}
		);

		tip.click(function() {
			tip.stop().fadeOut(100);
		});
	});

	function listClose(list) {
		list.parent().removeClass('-active');
		list.fadeOut(100);
	}
}


function dropdowns() {
	var dropdowns = $('.dropdown');

	dropdowns.each(function() {
		var $this = $(this),
			list = $this.find('ul');

		$this.click(function(e) {
			if (!list.is(':visible')) {
				list.fadeIn(50);
			} else {
				list.fadeOut(100)
			}

			list.css('minWidth', $this.outerWidth());

			e.stopPropagation();
		});

		$(document).click(function() {
			dropdowns.find('ul').fadeOut(100);
		});
	});
}


function stylizeCheckbox() {
	var cb = $('label input[type="checkbox"]');

	cb.parent().addClass('cb');

	cb.addClass('cb').each(function() {
		var $this = $(this);

		$this.before('<i class="icon-cb"></i>');

		if ($this.prop('checked')) {
			$this.parent().addClass('-active');
		} else {
			$this.parent().removeClass('-active');
		}
	})
	.click(function() {
		var $this = $(this);

		if ($this.prop('checked')) {
			$this.parent().addClass('-active');
		} else {
			$this.parent().removeClass('-active');
		}
	})
}


//Set location popup
function setLocation() {
	var source = $('[data-pop]'),
		popup = $('.popup-location'),
		layout = $('[class^="layout"]'),
		field = popup.find('input'),
		save = popup.find('._save'),
		layout_width = layout.outerWidth(),
		layout_offset = layout.offset().left;

	source.each(function() {
		var $this = $(this);

		$this.click(function(e) {
			var pop_target = $('[' + 'data-' + $this.data('pop-target') + ']');

			if (!pop_target.length) {
				pop_target = $this;
			}

			popup
				.css('left', pop_target.offset().left)
				.css({
					left: function() {
						if ((popup.offset().left + popup.width()) > (layout_width + layout_offset)) {
							var w = (popup.offset().left + popup.outerWidth()) - (layout_width + layout_offset);
							popup.css({'marginLeft': -w})
						}
					},
					top: $(this).offset().top + $(this).height()
				});

			save.unbind('click').click(function() {
				if (field.val() != '') {
					pop_target.text(field.val());
				} else {
					return false;
				}
				popup.fadeOut(200, function() {
					$(this).attr('style', '')
				});

				return false;
			});

			e.stopPropagation();
			return false;
		});
	});

	var old_val;
	field.focus(function() {
		field.data(old_val = field.val());
		field.val('');
	}).blur(function() {
		if (field.val() == '') {
			field.val(old_val);
		}
	});

	$(document).click(function() {
		popup.fadeOut(200, function() {
			$(this).attr('style', '')
		});
	});

	popup.click(function(e) {
		e.stopPropagation()
	});
}


/*!
 * Common popup windows for authentication, registration, info blocks etc.
 * Open by data-fancybox attribute.
 * E.g.: <a data-fancybox="block_with_content">Register</a>,
 * where "block_with_content" is hidden block.
 */
function openWindow() {
	$('[data-fancybox]')
		.not('[data-fancybox="close"]')
		.not('[data-fancybox="ajax"]')
		.click(function() {
			$.fancybox.open(
				$('#' + $(this).data('fancybox')),
				{
					fitToView	: false,
					autoSize	: true,
					openEffect	: 'none',
					closeEffect	: 'none',
					scrolling	: 'no',
					tpl        : {
						wrap   : '<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-skin fancybox-skin1"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div>',
						closeBtn : '<a class="fancybox-item fancybox-close" href="javascript:;"></a>'
					},
					helpers: {
						overlay: {
							locked: false
						}
					}
				}
			);

		return false;
	});

	//Cancel, close, exit etc buttons in fancyBox.
	$(document).on('click', '[data-fancybox="close"]', function() {
		$.fancybox.close();
		return false;
	});
}


/*
 * Problem: AJAX loaded directly in fancyBox is inaccessible for DOM manipulation,
 * e.g. styling selects and checkboxes or binding datepicker.
 *
 * Solution: preload AJAX in hidden #fancyboxAjaxContent, execute necessary actions, then show in fancyBox
 */
function openAjaxWindow() {
	var content = $('<div id="fancyboxAjaxContent" class="visuallyhidden"></div>');

	$('body').append(content);
	$(document).on('click', '[data-fancybox="ajax"]', function() {
		var href = $(this).attr('href') || $(this).data('href');

		$('#fancyboxAjaxContent').load(href, function() {
			$.fancybox.open(
				{'href'	       : '#fancyboxAjaxContent'},
				{
					fitToView  : false,
					autoSize   : true,
					padding    : 50,
					openEffect : 'none',
					closeEffect: 'none',
					scrolling  : 'no',
					tpl        : {
									wrap   : '<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-skin fancybox-skin1"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div>',
									closeBtn : '<a class="fancybox-item fancybox-close" href="javascript:;"></a>'
					},
					helpers: {
						overlay: {
							locked: false
						}
					},
					beforeLoad: function() {
						$('#fancyboxAjaxContent').removeClass('visuallyhidden');
					},
					afterLoad: function() {
						stylizeCheckbox();
						customSelects();
						//Fixes: selectmenu relative to page instead fancyBox when scrolling page
						content.find('select').each(function() {
							$(this).selectmenu('widget').addClass('select-fixed');
						});
						datepicker();
						scrollpane();
					},
					afterClose: function() {
						$('#fancyboxAjaxContent').addClass('visuallyhidden');
						$('#ui-datepicker-div').remove();
					}
				}
			);
		});

		return false;
	});
}


function gallery() {
	$('.slider a').fancybox({
		fitToView	: false,
		autoSize	: true,
		padding		: 50,
		openEffect	: 'none',
		closeEffect	: 'none',
		scrolling	: 'no'
	});
}


//Button "To top"
function scrollTop() {
	var btn = $('.move-top'),
		w = $(window);

	w.load(function() {
		check();
	}).scroll(function() {
		check();
	}).resize(function() {
		if (w.width() < 1265) {
			btn.addClass('-min')
		} else {
			btn.removeClass('-min')
		}
	});

	function check() {
		if (w.scrollTop() > (w.height() / 2)) {
			btn.fadeIn(100);
		} else {
			btn.fadeOut(100);
		}
	}

	btn.click(function() {
		$('html, body').animate({'scrollTop': 0}, 100)
	});
}


function faq() {
	var faq_items = $('.faq > li'),
		faq_questions = faq_items.find('.q');

	faq_questions.click(function() {
		var $this = $(this),
			par = $this.closest('li');

		if (!par.find('.a').is(':visible')) {
			faq_items.removeClass('active');
			faq_items.find('.a').slideUp(100);
			par.addClass('active');
			par.find('.a').slideDown(100);
		}
	})

}


function scrollpane() {
	var pane = $('.scrollpane').jScrollPane({
			showArrows: true
		}),
		api = pane.data('jsp');

	if (pane.length) {
		$(window)
			.resize(function() {
				api.reinitialise();
			})
			.load(function() {
				api.reinitialise();
			})
	}
}


function slider() {
	var pane = $('.slider').jScrollPane({
			showArrows: false
		}),
		api = pane.data('jsp');

	if (pane.length) {
		$(window)
			.resize(function() {
				api.reinitialise();
			})
			.load(function() {
				api.reinitialise();
			})
	}
}


//Customize default selects
function customSelects() {
	$('select').selectmenu({
		width: 'auto',
		menuWidth: 'auto'
	});

	$('.resvn-filter select').each(function() {
		$(this).selectmenu('widget').addClass('select-big')
	})

}


function setRating() {
	var rating = $('.rating.-editable');

	rating.hover(
		function() {

		},
		function() {

		}
	)
}


function datepicker() {
	/* jQuery UI Datepicker*/

	//Fixes: Datepicker still visible after fancyBox closing
	$('#ui-datepicker-div').remove();

	$('[data-datepicker]').datepicker({
		dateFormat: 'MM dd, yy'
	});

	//Custom Datepicker field, not <input>
	var dp1 = $('.field-datepicker1');
	dp1.each(function() {
		var input = $(this).find('input'),
			label = $(this).find('label');

		input.datepicker({
			dateFormat: 'MM dd, yy'
		});

		label.click(function() {
			input.focus();
		});

		input.change(function() {
			label.html(input.val());
		});
	});
}


function tooltips() {
	//jQuery UI Tooltip
	$('*').tooltip({
		track: true,
		content: function () {
			return $(this).prop('title');
		}
	});
}


function popupPhoto() {
	$('[data-photo]').tooltip({
		track: false,
		items: '[data-photo]',
		content: function () {
			return "<img src=" + $(this).data("photo") + " />";
		},
		tooltipClass:'tooltip1'
	})
}