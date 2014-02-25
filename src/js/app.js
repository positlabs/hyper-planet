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
		['41.1411769,-8.60815290000005', '41.1441807,-8.579257900000016'] // france
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

			var route = []; // array of latLngs
			var panoSeq = new PanoSequence();

			var o = Params.get('o');
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
			if (!o || resetting) {
				// set to default if not set from query params
				var location = locations[Math.floor(Math.random() * locations.length)];
				var o = location[0],
						d = location[1];
				Params.set('o', o);
				Params.set('d', d);
//				Params._checkParams();
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
				var o = leg.start_location.d + ',' + leg.start_location.e;
				var d = leg.end_location.d + ',' + leg.end_location.e;
				Params.set('o', o);
				Params.set('d', d);
				Params._checkParams();

				// show route starting point
				var pano = new Panorama(route[0], 2);

				pano.on('load', function () {
					StereoProjectionView.setTexture(pano.texture);
					StereoProjectionView.render();
					// new TilePreview(pano.tiles);
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


		}
	};

	return window.app;

});
