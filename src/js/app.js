define(function (require) {

	var StereoProjectionView = require('StereoProjectionView');
	var MapView = require('MapView');
	var UI = require('UI');
	var SplashView = require('SplashView');

	var Panorama = require('Panorama');
	var TilePreview = require('TilePreview');
	var PanoSequence = require('PanoSequence');
	var Params = require('Params');

	// preset locations
	var locations = [
		['34.1944244,-115.72303220000003', '34.309857,-115.70233310000003'], // death valley
		['22.3168416,114.21253260000003', '22.2907293,114.21436410000001'], // hong kong 1
		['22.3033724,114.15849890000004', '22.3279743,114.15112150000004'], // hong kong 2
		['41.1411769,-8.60815290000005', '41.1441807,-8.579257900000016'], // france,
		['24.7060896,-81.13010500000001', '24.6486217,-81.32246069999997'], // florida keys
		['43.6382463,-79.39469650000001', '43.6507498,-79.38637210000002'] // toronto
	];

	var app = window.app = {
		init: function () {
			new ox.Events(this);

			Panorama.init(StereoProjectionView);
			SplashView.init(ox('#splash-container'));
			MapView.init(ox('#map-container'));
			StereoProjectionView.init(ox('#projection-container'));
			UI.init(ox('#experiment-container'));
			Params.init();

//			setTimeout(function () {

				var route = []; // array of latLngs
				var panoSeq = new PanoSequence();

				var o = Params.get('o');
				var d = Params.get('d');

				var resetting = false; // are we picking a new location?

				if (o) {
					// check if params match one of the defaults.
					// if it does, kick it out of the list and pick another one
					var d = Params.get('d');
					for (var i = 0, maxi = locations.length; i < maxi; i++) {
						var loc = locations[i];
						if (loc[0] == o && loc[1] == d) {
							// remove this location from defaults
							locations.splice(i, 1);
							resetting = true;
							i = maxi;
						}
					}
				}

				// if destination wasn't set, or if we're forcing a new location
//				if (!o || resetting) {
				if (!o) {
					// set to default if not set from query params
					var location = locations[Math.floor(Math.random() * locations.length)];
					console.log("location", location);

					var o = location[0],
						d = location[1];
					Params.set('o', o);
					Params.set('d', d);

					MapView.setRoute(o, d, true);
				} else if (o && d) {
					MapView.setRoute(o, d, true);
				}

				// map route changed
				app.on("routeChange", function (directions) {

					// invalidate textureseq since route changed
					if (panoSeq) {
						panoSeq.destroy();
						panoSeq = undefined;
					}

					route = directions.routes[0].overview_path;

					// set url params from directions
					var leg = directions.routes[0].legs[0];

					// FIXME: lat/long letters keep changing...
					// k:lat
					// A:long

					// var o = leg.start_location.k + ',' + leg.start_location.A;
					// var d = leg.end_location.k + ',' + leg.end_location.A;

					// var o = leg.start_location.k + ',' + leg.start_location.B;
					// var d = leg.end_location.k + ',' + leg.end_location.B;
					var startloc = new app.LatLng(leg.start_location);
					var endloc = new app.LatLng(leg.end_location);

					var o = startloc.lat + ',' + startloc.long;
					var d = endloc.lat + ',' + endloc.long;
					Params.set('o', o);
					Params.set('d', d);
					Params._checkParams();

					// show route starting point
					var pano = new Panorama(route[0], 2);
					pano.quality = 0;

					pano.on('load', function () {
						StereoProjectionView.setTexture(pano.texture);
						StereoProjectionView.render();
						// new TilePreview(pano.tiles);
						if (pano.quality < 3) {
							pano.quality++;
							pano.load();
						}
					});

					pano.load();

					app.trigger('stop'); // stopping timelapse

				});

				// loading all of the panoramas
				app.on('load', function () {
					document.body.classList.add('state-loading');

					if (panoSeq && panoSeq.loading) return; // already loading

					if (panoSeq && panoSeq.loaded) {
						// replay the animation
						StereoProjectionView.play(panoSeq);
					} else {
						if (panoSeq) panoSeq.destroy();
						panoSeq = new PanoSequence();
						panoSeq.on('load', function () {
							StereoProjectionView.play(panoSeq);
						});
						panoSeq.load(route);
					}

				});

				app.on('play', function () {
					document.body.classList.remove('state-loading');
					document.body.classList.add('state-playing');
				});

				app.on('stop', function () {
					document.body.classList.remove('state-loading');
					document.body.classList.remove('state-playing');
				});

//			}, 5000);
		},

		// convert google.maps.LatLng into something more predictable
		LatLng: function(latLng){
			console.log	(latLng);

			var split = latLng.toString().replace('(','').replace(')','').split(', ');
			this.lat = Number(split[0]);
			this.long = Number(split[1]);
			this.original = latLng;

		}

	};

	return window.app;

});
