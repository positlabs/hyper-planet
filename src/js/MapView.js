define(function (require) {

	var gm = google.maps;
	var directionsService = new gm.DirectionsService();
	var directionsDisplay = new gm.DirectionsRenderer({draggable: true});

	var MapView = {

		init: function (parentEl) {
			var _this = this;
			var mapDiv = ox.create('div');
			mapDiv.id = 'map-div';
			parentEl.appendChild(mapDiv);

			var gm = google.maps;

			var mapOptions = {
				zoom: 14,
				mapTypeControlOptions: {
					mapTypeIds: [ gm.MapTypeId.ROADMAP, gm.MapTypeId.HYBRID]
				},
				mapTypeId: gm.MapTypeId.ROADMAP,
				streetViewControl: false,
				panControl: false,
				zoomControl: false
			};

			this.map = new gm.Map(mapDiv, mapOptions);

			gm.event.addListener(this.map, 'click', function (e) {
				_this.setRoute(e.latLng, new gm.LatLng(e.latLng.d + rand(.002), e.latLng.e + rand(.002)));
			});

			directionsDisplay.setMap(this.map);

			gm.event.addListener(directionsDisplay, 'directions_changed', function () {
				var directions = directionsDisplay.getDirections();
				console.log("directions", directions);
				app.trigger('routeChange', directions);
			});

			this.onParamChange = _.bind(this.onParamChange, this);
			app.on('change:params', this.onParamChange);

			this.currentLocMarker = new google.maps.Marker({
				map: this.map,
				icon: 'images/man.png'
			});
			app.on('play', function () {
				_this.currentLocMarker.setMap(_this.map);
			});
			app.on('stop', function () {
				_this.currentLocMarker.setMap(null);
			});
			this.setCurrentPosition = _.bind(this.setCurrentPosition, this);
			app.on('change:currentLocation', this.setCurrentPosition);

		},
		onParamChange: function (params) {
			var o = params.o,
					d = params.d;
			if (o && d) {
				this.setRoute(o, d, true);
			} else if (o && d == undefined) {
				this.setRoute(o, o, true);
			}
		},
		setCurrentPosition: function (latLng) {
			console.log("MapView."+"setCurrentPosition()", arguments);
			this.currentLocMarker.setPosition(latLng);
		},
		setRoute: function (origin, destination, autoZoom) {
			var _this = this;
			var request = {
				origin: origin,
				destination: destination,
				travelMode: gm.TravelMode.DRIVING
			};
			var mapZoom = this.map.getZoom();
			directionsService.route(request, function (response, status) {
				if (status == gm.DirectionsStatus.OK) {
					directionsDisplay.setDirections(response);
					if (!autoZoom) {
						setTimeout(function () {
							_this.map.setZoom(mapZoom);
						}, 1);
					}
				}
			});
		}

	};

	function rand(range) {
		return Math.random() * range - range * .5;
	}

	return MapView;

});
