define(function (require) {

	var StereoProjectionView = require('StereoProjectionView');
	var MapView = require('MapView');
	var UI = require('UI');
	var SplashView = require('SplashView');

	var Panorama = require('Panorama');
	var TilePreview = require('TilePreview');
	var TextureSequence = require('TextureSequence');
	var Params = require('Params');

	var app = window.app = {
		init: function () {
			new ox.Events(this);

			SplashView.init(ox('#splash-container'));
			MapView.init(ox('#map-container'));
			StereoProjectionView.init(ox('#projection-container'));
			UI.init(ox('#experiment-container'));
			Params.init();

			var route = []; // array of latLngs
			var txseq = new TextureSequence();

			// set to default if not set from query params
			var o = 'Fort Bragg, CA',
					d = 'Caspar, CA';
			if (!Params.get('o')) {
				MapView.setRoute(o, d, true);
			}

			app.on("change:params", Panorama.onParamChange);

			// map route changed
			app.on("routeChange", function (directions) {

				// invalidate textureseq since route changed
				if (txseq) {
					txseq.destroy();
					txseq = undefined;
				}

				route = directions.routes[0].overview_path;

				// show route starting point
				var pano = new Panorama(route[0]);

				pano.on('load', function (panoCanvas) {
					if (panoCanvas == undefined) panoCanvas = ox.create('canvas');
					var texture = StereoProjectionView.createTexture(panoCanvas);
					StereoProjectionView.setTexture(texture);
					StereoProjectionView.render();
					// new TilePreview(pano.tiles);
				});

				pano.load();

				app.trigger('pause');

			});

			// loading all of the panoramas
			app.on('load', function () {
				document.body.classList.add('state-loading');

				if (txseq && txseq.loading) return; // already loading

				if (txseq && txseq.loaded) {
					// replay the animation
					StereoProjectionView.play(txseq);
				} else {
					if (txseq) txseq.destroy();
					txseq = new TextureSequence();
					txseq.on('load', function () {
						StereoProjectionView.play(txseq);
					});
					txseq.load(route);
				}

			});

			app.on('play', function () {
				document.body.classList.remove('state-loading');
				document.body.classList.add('state-playing');
			});

			app.on('pause', function () {
				document.body.classList.remove('state-loading');
				document.body.classList.remove('state-playing');
			});


		}
	};

	return window.app;

});
