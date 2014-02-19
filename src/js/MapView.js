define(function (require) {

	var gm = google.maps;
	var directionsService = new gm.DirectionsService();
	var directionsDisplay = new gm.DirectionsRenderer({draggable: true});

	var MapView = {

		init: function (parentEl, startLatLng, endLatLng) {
			var mapDiv = ox.create('div');
			mapDiv.id = 'map-div';
			parentEl.appendChild(mapDiv);

			var gm = google.maps;

			var mapOptions = {
				center: startLatLng,
				zoom: 14,
				mapTypeControlOptions: {
					mapTypeIds: [ gm.MapTypeId.ROADMAP, gm.MapTypeId.HYBRID]
				},
				mapTypeId: gm.MapTypeId.HYBRID,
				streetViewControl:false,
				panControl:false
			};

			this.map = new gm.Map(mapDiv, mapOptions);
			directionsDisplay.setMap(this.map);


			// https://developers.google.com/maps/documentation/javascript/reference#PolylineOptions
//			var polyLine = new gm.Polyline({
//				path:[startLatLng, endLatLng],
//				map:this.map,
//				editable:true
//			});
//			console.log("polyLine",polyLine);


			var request = {
				origin: 'Sydney, NSW',
				destination: 'North Sydney, NSW',
				travelMode: gm.TravelMode.DRIVING
			};
			directionsService.route(request, function (response, status) {
				if (status == gm.DirectionsStatus.OK) {
					console.log("response", response);
					directionsDisplay.setDirections(response);
				}
			});

			gm.event.addListener(directionsDisplay, 'directions_changed', function() {
				var directions = directionsDisplay.getDirections();
				console.log("directions",directions);
				app.trigger('routeChange', directions);
			});

		}

	};

	return MapView;

});
