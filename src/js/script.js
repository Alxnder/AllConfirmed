$(function() {
	if ($('#slider').length) {
		$('#slider').nivoSlider({
			effect: 'boxRain',
			slices: 8,
			animSpeed: 500,
			pauseTime: 4500,
			startSlide: 0,
			directionNav: false,
			controlNav: true,
			pauseOnHover: true,
			manualAdvance: false,
			randomStart: false
		});
	}
});
