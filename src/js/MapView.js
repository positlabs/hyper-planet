define(function (require) {

	var gm = google.maps;
	var geocoder = new gm.Geocoder();
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
				_this.setRoute(e.latLng, new gm.LatLng(e.latLng.k + rand(.002), e.latLng.A + rand(.002)));
			});

			directionsDisplay.setMap(this.map);

			gm.event.addListener(directionsDisplay, 'directions_changed', function () {
				var directions = directionsDisplay.getDirections();
				console.log("directions", directions);
				app.trigger('routeChange', directions);
			});

			// add sv coverage layer
			var streetViewLayer = new google.maps.StreetViewCoverageLayer();
			streetViewLayer.setMap(this.map);

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
			this.onPlaceChanged = _.bind(this.onPlaceChanged, this);
			this.setCurrentPosition = _.bind(this.setCurrentPosition, this);
			app.on('change:currentLocation', this.setCurrentPosition);

			// set up search field

			var searchInput = ox('.search-field input');
			var autocompleteEl;
			this.searchBox = new gm.places.SearchBox(searchInput);
			setTimeout(function () {
				searchInput.setAttribute('autocomplete', 'on');
				autocompleteEl = ox('.pac-container');
				autocompleteEl.remove();
				ox('#map-container .search-field').appendChild(autocompleteEl);
			}, 1000);

			searchInput.on('keydown', function (e) {
				setTimeout(tryPositioningAutocomplete, 100);
				setTimeout(tryPositioningAutocomplete, 500);
				setTimeout(tryPositioningAutocomplete, 1000);
			});

			function tryPositioningAutocomplete() {
				autocompleteEl.ox.css({
					marginTop: -autocompleteEl.offsetHeight + 'px'
				});
			}

			gm.event.addListener(this.searchBox, 'places_changed', function (e) {
				var places = _this.searchBox.getPlaces();
				_this.onPlaceChanged(places);
				searchInput.value = "";
				tryPositioningAutocomplete();
			});

			// grabby bar
			var grabbybar = ox('.grabby-bar');
			var grabbed = false;
			grabbybar.addEventListener('mousedown', function (e) {
				grabbed = true;
				document.body.classList.add('state-grabbed');
			});
			document.body.addEventListener('mouseup', function (e) {
				grabbed = false;
				document.body.classList.remove('state-grabbed');
			});
			document.body.addEventListener('mousemove', function (e) {
				if (!grabbed) return;
				e.preventDefault();
				var min = window.innerWidth * .15;
				var max = window.innerWidth * .5;
				var newWidth = e.pageX + 12;
				newWidth = Math.max(min, newWidth);
				newWidth = Math.min(max, newWidth);

				parentEl.style.width = newWidth + 'px';
				gm.event.trigger(_this.map, "resize");

				app.trigger('map:resize', newWidth);

			});
		},
		onPlaceChanged: function (places) {
			console.log("MapView." + "onPlaceChanged()", arguments);
			var _this = this;
			geocoder.geocode({ 'address': places[0].formatted_address}, function (results, status) {
				if (status == gm.GeocoderStatus.OK) {
					_this.map.panTo(results[0].geometry.location);
				} else {
					console.log("Geocode was not successful for the following reason: " + status);
				}
			});

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
