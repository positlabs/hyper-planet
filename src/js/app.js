define(function (require) {

	var StereoProjectionView = require('StereoProjectionView');
	var MapView = require('MapView');
	var UI = require('UI');

	var Panorama = require('Panorama');
	var TilePreview = require('TilePreview');
	var TextureSequence = require('TextureSequence');

	var app = window.app = {
		init: function () {
			new ox.Events(this);

			var route = []; // array of latLngs
			var txseq = new TextureSequence();

			MapView.init(ox("#map-container"));
			MapView.setRoute("San Francisco, CA","Los Angeles, CA");

			StereoProjectionView.init(document.body);

			// map route changed
			app.on("routeChange", function (directions) {

				route = directions.routes[0].overview_path;

				// show route starting point
				var pano = new Panorama(route[0]);

				pano.on('load', function (panoCanvas) {
					var texture = StereoProjectionView.createTexture(panoCanvas);
					StereoProjectionView.setTexture(texture);
					StereoProjectionView.render();
					// new TilePreview(pano.tiles);
				});

				pano.load();

			});

			txseq.on('load', function () {
				StereoProjectionView.playTextureSequence(txseq);
			});

			app.on('play', function () {
				if (txseq.loaded) StereoProjectionView.playTextureSequence(txseq);
				else txseq.load(route);
			});

			UI.init();

		}
	};

	return window.app;

});
