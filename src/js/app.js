define(function (require) {

	var StereoProjectionView = require('StereoProjectionView');
	var MapView = require('MapView');
	var UI = require('UI');

	var Panorama = require('Panorama');
	var TilePreview = require('TilePreview');
	var TextureSequence = require('TextureSequence');
	var Params = require('Params');

	var app = window.app = {
		init: function () {
			new ox.Events(this);

			var route = []; // array of latLngs
			var txseq = new TextureSequence();

			MapView.init(ox('#map-container'));

			// set to default if not set from query params
			var o = 'Fort Bragg, CA',
					d ='Caspar, CA';
			if(!Params.get('o')){
				MapView.setRoute(o, d, true);
			}

			StereoProjectionView.init(document.body);

			app.on("change:params", Panorama.onParamChange);
			Params.init();

			// map route changed
			app.on("routeChange", function (directions) {

				// invalidate textureseq since route changed
				if(txseq){
					txseq.destroy();
					txseq = undefined;
				}

				route = directions.routes[0].overview_path;

				// show route starting point
				var pano = new Panorama(route[0]);

				pano.on('load', function (panoCanvas) {
					if(panoCanvas == undefined) panoCanvas = ox.create('canvas');
					var texture = StereoProjectionView.createTexture(panoCanvas);
					StereoProjectionView.setTexture(texture);
					StereoProjectionView.render();
					// new TilePreview(pano.tiles);
				});

				pano.load();

			});


			app.on('play', function () {

				if(txseq && txseq.loading) return; // can't play yet

				if (txseq && txseq.loaded) {
					// replay the animation
					StereoProjectionView.play(txseq);
				} else {
					if(txseq) txseq.destroy();
					txseq = new TextureSequence();
					txseq.on('load', function () {
						StereoProjectionView.play(txseq);
					});
					txseq.load(route);
				}

			});

			UI.init();

		}
	};

	return window.app;

});
