define(["require_config"], function () {

	// TODO: build process
	// TODO: social sharing?
	// TODO: instructions
	// TODO: more default routes
	// TODO: a video demonstration of various routes. can be used as the video for chrome experiments

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
