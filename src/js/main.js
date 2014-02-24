define(["require_config"], function () {


	//TODO: deep linking
	//TODO: origin/destination input fields
	//TODO: use q=3 for preview frames


	// TODO: route interpolation (maybe)
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
