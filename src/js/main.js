define(["require_config"], function () {


	require([
		'StereoProjection',
		'MapView',
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
	], function (StereoProjection, MapView) {

		MapView.init(document.body);
//		StereoProjection.init(document.body);

	});
});
