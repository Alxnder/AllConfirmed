$(function() {
	setFooter();
});


function setFooter() {
	var footer = $('footer.footer');

	if (footer.length) {
		var footerHeight = footer.outerHeight(true);
		footer.outerHeight(footerHeight);
		$('.container')
			.append('<div class="footer-helper" style="height: ' + footerHeight +'px"></div>')
			.css('marginBottom', -footerHeight);
	}
}
