define(function (require) {

	var MapView = {

		init: function (parentEl) {
			var fenway = new google.maps.LatLng(42.345573, -71.098326);
			var mapOptions = {
				center: fenway,
				zoom: 14
			};
			var canvas = ox.create('canvas');
			parentEl.appendChild(canvas);
			var map = new google.maps.Map(canvas, mapOptions);
			var panoramaOptions = {
				position: fenway,
				pov: {
					heading: 34,
					pitch: 10
				}
			};
			var panoDiv = ox.create('div');
			panoDiv.id = 'pano';
			parentEl.appendChild(panoDiv);
			var panorama = new google.maps.StreetViewPanorama(panoDiv, panoramaOptions);
			map.setStreetView(panorama);
		}

	};

	return MapView;

});
