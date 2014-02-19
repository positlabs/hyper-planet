define(function (require) {

	var MapView = {

		init: function (parentEl) {
			var mapDiv = ox.create('div');
			mapDiv.id = 'map-div';
			parentEl.appendChild(mapDiv);
//			var panoDiv = ox.create('div');
//			panoDiv.id = 'pano-div';
//			parentEl.appendChild(panoDiv);

			var gm = google.maps;

			var berkeley = new google.maps.LatLng(37.869085,-122.254775);

			var mapOptions = {
				center: berkeley,
				zoom: 14,
				mapTypeControlOptions: {
					mapTypeIds: [ gm.MapTypeId.ROADMAP, gm.MapTypeId.HYBRID]
				},
				mapTypeId: gm.MapTypeId.HYBRID
			};

			this.map = new gm.Map(mapDiv, mapOptions);
//			var panoramaOptions = {
//				position: berkeley,
//				pov: {
//					heading: 34,
//					pitch: 10
//				}
//			};
//
//			this.panorama = new gm.StreetViewPanorama(panoDiv, panoramaOptions);
//			this.map.setStreetView(this.panorama);
//			window.pano = this.panorama; // for debugging only

		}

	};

	return MapView;

});
