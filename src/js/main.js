define(["require_config"], function () {

	//TODO: origin/destination input fields
	//TODO: download higher res textures if user is paused on a frame

	// TODO: route interpolation (maybe)
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
