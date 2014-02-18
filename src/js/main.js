define(["require_config"], function () {


	require([
		'StereoProjection',
		'MapView',
		'Panorama',
		'three',
		'bower/ox/ox',
		'three.CopyShader',
		'three.ShaderPass',
		'three.RenderPass',
		'three.EffectComposer',
		'three.RGBShiftShader',
		'three.DotScreenPass',
		'three.MaskPass',
		'three.DotScreenShader'
	], function (StereoProjection, MapView, Panorama) {

		var gm = google.maps;
		window.app = new ox.Events();

//		MapView.init(ox("#map-container"));


		var berkeley = new gm.LatLng(37.869085, -122.254775);
		var pano = new Panorama(berkeley);
		pano.on('load', function () {
			console.log('pano loaded!');
		});
		pano.load();

//		TileLoader.loadByLocation(berkeley);

//		StereoProjection.init(document.body);

	});
});
