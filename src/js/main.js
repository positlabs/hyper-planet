define(["require_config"], function () {

	// TODO: build process

	// TODO: search input field

	// TODO: route interpolation (maybe)
	// TODO: map marker showing current position
	// TODO: social sharing?

	// TODO: download higher res textures if user is paused on a frame

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
