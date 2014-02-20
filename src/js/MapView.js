define(function (require) {

	var gm = google.maps;
	var directionsService = new gm.DirectionsService();
	var directionsDisplay = new gm.DirectionsRenderer({draggable: true});

	var MapView = {

		init: function (parentEl) {
			var mapDiv = ox.create('div');
			mapDiv.id = 'map-div';
			parentEl.appendChild(mapDiv);

			var gm = google.maps;

			var mapOptions = {
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

			gm.event.addListener(directionsDisplay, 'directions_changed', function() {
				var directions = directionsDisplay.getDirections();
				console.log("directions",directions);
				app.trigger('routeChange', directions);
			});

			app.on("newRoute", function(){
				// take route off the map until a new one is set
				directionsDisplay.setMap(undefined);
			});

		},

		setRoute:function(origin, destination){
			var request = {
				origin: origin,
				destination: destination,
				travelMode: gm.TravelMode.DRIVING
			};
			directionsService.route(request, function (response, status) {
				if (status == gm.DirectionsStatus.OK) {
					directionsDisplay.setDirections(response);
				}
			});
		}

	};

	return MapView;

});
