define(["require_config"], function () {

	// TODO: route interpolation (maybe)
	// TODO: preloader gif
	// TODO: key controls for stepping through sequence
	// TODO: map marker showing current position

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
