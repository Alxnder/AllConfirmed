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
	datepicker();
	tooltips();
	popupPhoto();
	showBigMap();
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

//Pop-up multiple menu with columns and close button
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
		list.prepend('<i class="icon-close" title="Close"></i>');
		list.prepend('<i class="icon-clear hidden" title="Clear all selection"></i>');
		list.css({
			minWidth: $this.outerWidth()
		});

		var close = list.find('.icon-close'),
			clear_all = list.find('.icon-clear'),
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
				$this.addClass('-active');
			} else {
				$this.removeClass('-active');
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

		clear_all.click(function(e) {
			items.removeClass('selected');
			text.text(text.data('default')).removeClass('selected');
			tip.text('');
			clear_all.addClass('hidden');

			e.stopPropagation();
		});

		//Items in pop-up, selecting of active
		items.click(function(e) {
			var item = $(this);

			if ($this.attr('data-multiselect') === undefined) {
				items.removeClass('selected');
				item.addClass('selected');
				text.text(item.text()).addClass('selected');
				tip.text(item.text());
				listClose(list);
			} else {
				item.toggleClass('selected');

				var selected = items.filter('.selected');

				//Default value in select
				if (!selected.length) {
					text.text(text.data('default')).removeClass('selected');
					tip.text('');
					clear_all.addClass('hidden');
				//One value
				} else if (selected.length == 1) {
					text.text(selected.eq(0).text()).addClass('selected');
					tip.text(selected.eq(0).text());
					clear_all.removeClass('hidden');
					//Multiple values
				} else if (selected.length > 1) {
					text.text(selected.eq(0).text() + ', ' + selected.eq(1).text() + ' and more').addClass('selected');
					tip.text(selected.eq(0).text() + ', ' + selected.eq(1).text() + ' and more');
					clear_all.removeClass('hidden');
				}
			}

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
		save = popup.find('._save');

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
						if ((popup.offset().left + popup.width()) > (layout.outerWidth() + layout.offset().left)) {
							var w = (popup.offset().left + popup.outerWidth()) - (layout.outerWidth() + layout.offset().left);
							popup.css({'marginLeft': -w});
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
		if (popup.is(':visible')) {
			popup.fadeOut(200, function() {
				$(this).attr('style', '')
			});
		}
	});

	popup.click(function(e) {
		e.stopPropagation()
	});
}


var fancyboxDefaults = {
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
};

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
			$.fancybox.open($('#' + $(this).data('fancybox')), fancyboxDefaults);
			return false;
		}
	);

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
						datepicker();
						scrollpane();
					},
					afterShow: function() {
						if ($.fancybox.wrap.css('position') == 'fixed') {
							//Fixes: selectmenu relative to page instead fancyBox when scrolling page
							content.find('select').each(function() {
								$(this).selectmenu('widget').addClass('select-fixed');
							});
						}
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
		show: {
			delay: 350
		},
		track: true,
		content: function () {
			return $(this).prop('title');
		}
	});

	$('.select ul .icon-clear, .select .icon-close').tooltip({
		show: {
			delay: 350
		},
		track: false
	});
}


function popupPhoto() {
	var objects = $('[data-photo]');

	objects.tooltip({
		track: false,
		items: '[data-photo]',
		content: function () {
			return "<img src=" + $(this).data("photo") + " />";
		},
		show: {
			delay: 150
		},
		tooltipClass:'tooltip1'
	});

	if (isMobile) {
		objects.click(function() {
			$(this).tooltip('open');
		});
	}
}

/*
* Fullscreen Google Maps block with current page's place (restaurant etc):
* 1) Create container on the fly for big map, add necessary binds
* 2) Load Google Maps API and Infobox plugin
*
*/
function showBigMap() {
	var body = $('body'),
		button = $('.map-small .icon-viewmap'),
		markup = $("<div class='bigmap'> \
				<div class='bigmap-head'><div class='wrapper'> \
					<div class='bigmap-logo'><i class='icon-logo_white'></i></div> \
					<div class='bigmap-motto'>Reservations of restaurants and clubs</div> \
					<div class='bigmap-close'><span>close map</span></div> \
				</div></div> \
				<div id='map_canvas' class='bigmap-content'></div> \
			</div>"),
		api_loaded = false,
		bigmap, close_btn;

	//Show big map container
	button.click(function() {
		body.addClass('body-fixed');

		//1)
		markup.appendTo(body);
		bigmap = $('.bigmap');
		close_btn = $('.bigmap-close');

		close_btn.click(function() {
			bigmap.remove();
			body.removeClass('body-fixed');
		});

		bigmap.click(function(e) {
			e.stopPropagation()
		});

		//Avoid redundant API loading
		if (!api_loaded) {
			api_loaded = true;
			$.getScript('https://maps.googleapis.com/maps/api/js?v=3&sensor=false&callback=gmapsInit')
		}

		if (typeof google != 'undefined' && typeof google.maps != 'undefined') {
			mapInit();
		}


		return false;
	});
}

//2)
function gmapsInit() {
	$.getScript('js/libs/infobox_packed.js', function() {
		mapInit();
	});
}


function mapInit() {
	var mapOptions = {
			zoom: 15,
			center: new google.maps.LatLng(42.28493,-85.590487),
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

	map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
	map.panTo(mapOptions.center);

	insertTestMarker(map);
}


function insertTestMarker(map) {
	var marker = new google.maps.Marker({
			map: map,
			position: new google.maps.LatLng(42.28493,-85.590487),
			visible: true
		}),
		info_markup = '\
			<div class="gmap-info"> \
				<p class="location">2 East Wheelock Street Hanover, NH 03755 <i class="icon-pointer_small-red"></i></p>\
				<dl> \
					<dt> \
						<img src="stubs/img13.jpg" /> <!--Example--> \
						<div class="rating"><i class="icon-rating_wide-3_5"></i> (3.4)</div> \
						<a href="">32 reviews</a> \
					</dt> \
					<dd> \
						<p class="type">Restaurant, karaoke</p> \
						<h3><a href="">Pine Restaurant - Hanover Inn Dartmouth</a></h3> \
						<p><i class="icon-dish"></i> South American, International, Middle Eastern</p> \
						<div class="params"> \
							<ul> \
								<li><i class="icon-usd"></i> $25 and under</li> \
								<li><i class="icon-clock"></i> Business Lunch</li> \
							</ul> \
							<ul> \
								<li><i class="icon-wifi"></i> Wi-Fi</li> \
								<li><i class="icon-nursery"></i> Nursery Room</li> \
							</ul> \
						</div> \
					</dd> \
				</dl> \
			</div><div class="shadow"></div>';

	//InfoBox reference: http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/docs/reference.html
	var myOptions = {
		content: info_markup,
		alignBottom: true,
		pixelOffset: new google.maps.Size(-75, -32),
		infoBoxClearance: new google.maps.Size(5, 5)
	},
	ib = new InfoBox(myOptions);

	ib.open(map, marker);
	google.maps.event.addListener(marker, 'click', function() {
		ib.open(map, marker);
	});
	google.maps.event.addListener(map, 'click', function() {
		ib.close();
	});
}
