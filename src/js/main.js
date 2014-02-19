define(["require_config"], function () {


	require([
		'StereoProjection',
		'MapView',
		'Panorama',
		'TilePreview',
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
	], function (StereoProjection, MapView, Panorama, TilePreview) {

		var gm = google.maps;
		window.app = new ox.Events();

//		MapView.init(ox("#map-container"));


		var berkeley = new gm.LatLng(37.869085, -122.254775);
		var LA = new gm.LatLng(34.04926,-118.24896);
		var santamonicaPier = new gm.LatLng(34.00908,-118.49739);
		var pano = new Panorama(santamonicaPier);
		pano.on('load', function (panoCanvas) {
			console.log('pano loaded!');
//			new TilePreview(pano.tiles);

			StereoProjection.init(document.body, panoCanvas);


		});
		pano.load();


	});
});
