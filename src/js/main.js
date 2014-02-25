define(["require_config"], function () {

	// TODO: build process
	// TODO: search input field
	// TODO: route interpolation (maybe)
	// TODO: social sharing?


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
