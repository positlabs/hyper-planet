define(["require_config"], function () {

	// TODO: build process
	// TODO: route interpolation (maybe)
	// TODO: social sharing?
	// TODO: instructions
	// TODO: more default routes
	// TODO: a video demonstration of various routes. can be used as the video for chrome experiments

	// TODO: progressive enhancement for splash image
	//TODO: fix hash change listener. not firing when back button is pressed

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
