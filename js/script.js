$(function() {
	primaryNav();
	carousel();
	searchBox();
	select();
	stylizeCheckbox();
});


function primaryNav() {
	var nav = $('nav.primary > ul'),
		items = nav.find('> li'),
		elements_per_wrap = 13;

	items.each(function() {
		var item = $(this),
			links = item.find('> ul > a');

		//Разделяем список по колонкам
		for (var i = 0; i < links.length; i += elements_per_wrap) {
			links.filter(':eq('+ i +'), :lt(' +  (i + elements_per_wrap) + '):gt(' + i + ')').wrapAll('<li />');
		}
	});
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

//Выпадающее меню с колонками и кнопкой закрытия
function select() {
	var selects = $('.select'),
		lists = selects.find('ul'),
		elements_per_wrap = 13;

	selects.each(function() {
		var $this = $(this),
			text = $this.find('> div'),
			list = $this.find('ul'),
			items = list.find('a');

		list.prepend('<i class="icon-close"></i>');
		list.css({
			minWidth: $this.outerWidth()
		});

		var close = list.find('.icon-close');

		//Разделяем список по колонкам
		for (var i = 0; i < items.length; i += elements_per_wrap) {
			items.filter(':eq('+ i +'), :lt(' +  (i + elements_per_wrap) + '):gt(' + i + ')').wrapAll('<li />');
		}

		$(this).click(function(e) {
			//Прячем все меню и возвращаем исходный вид
			selects.removeClass('-active');
			lists.fadeOut(100);
			if (!list.is(':visible')) {
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

		//Элементы в выпадающем меню, выделение активного элемента
		items.click(function(e) {
			var $this = $(this);
			items.removeClass('selected');
			setTimeout(function() {
				$this.addClass('selected')
			}, 100);
			text.text($(this).text()).addClass('selected');
			listClose(list);
			e.stopPropagation();
		});

		list.click(function(e) {
			e.stopPropagation();
		});
	});

	function listClose(list) {
		list.parent().removeClass('-active');
		list.fadeOut(100);
	}
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