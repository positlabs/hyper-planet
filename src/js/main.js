define(["require_config"], function () {

	// TODO: route interpolation
	//TODO: preloader gif
	//TODO: new route button

	//TODO: get api key and use for Tile urls

	require([
		'app',
		'three',
		'bower/ox/ox',
		'three.CopyShader',
		'three.ShaderPass',
		'three.RenderPass',
		'three.EffectComposer',
		'three.MaskPass'
	], function (app) {

		app.init();

	});
});
