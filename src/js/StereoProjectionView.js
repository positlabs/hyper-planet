define(function (require) {

	var StereoProjectionShader = require('StereoProjectionShader');
	var VirtualScroll = require('VirtualScroll');

	var shaderPass, composer;

	var StereoProjectionView = {

		init: function (parentEl) {

			var _this = this;

			var renderer, scene, camera, plane,
					width = window.innerWidth,
					height = window.innerHeight,
					near = -.1,
					far = 10000;

			renderer = new THREE.WebGLRenderer({});
			renderer.setSize(width, height);
			scene = new THREE.Scene();
			camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, near, far);
			scene.add(camera);

			renderer.domElement.id = "stereo-projection";
			parentEl.appendChild(renderer.domElement);

			plane = new THREE.Mesh(new THREE.PlaneGeometry(width, height, 1, 1));
			scene.add(plane);

			composer = new THREE.EffectComposer(renderer);
			composer.addPass(new THREE.RenderPass(scene, camera));

			shaderPass = new THREE.ShaderPass(StereoProjectionShader);
//			effect.uniforms.texture.value = THREE.ImageUtils.loadTexture('images/test3.jpg');
			shaderPass.renderToScreen = true;
			shaderPass.uniforms.scale.value = 9;
			shaderPass.uniforms.aspect.value = window.innerHeight / window.innerWidth;
			composer.addPass(shaderPass);

			// do render on frame so zoom level can be animated
//			var start_time = Date.now();
			ox.FrameImpulse.on('frame', function () {
//				var time = (Date.now() - start_time) / 1000;
//				effect.uniforms.time.value = time;
				_this.render();
			});
			ox.FrameImpulse.start();

			VirtualScroll.on(this.onWheel);
		},
		onWheel: function (e) {

			var delta = -e.deltaY / 40;
			shaderPass.uniforms.scale.value += delta;
			shaderPass.uniforms.scale.value = Math.min(17, shaderPass.uniforms.scale.value);
			shaderPass.uniforms.scale.value = Math.max(3, shaderPass.uniforms.scale.value);

		},
		createTexture: function (canvas) {
			var texture = new THREE.Texture(canvas);
			texture.needsUpdate = true;
			return texture;
		},
		setTexture: function (texture) {
			shaderPass.uniforms.texture.value = texture;
		},
		render: function () {
			composer.render();
		},
		onResize: function () {
			//TODO
		},
		playTextureSequence: function (textureSequence) {
//			console.log("StereoProjectionView."+"playTextureSequence()", arguments);
			var _this = this;
			var currentFrame = 0;
			var animInterval = setInterval(function () {
				if (currentFrame > textureSequence.textures.length) {
					clearInterval(animInterval);
				}
				_this.setTexture(textureSequence.textures[currentFrame]);
				currentFrame++;
			}, 1000 / 6);
		}


	};

	return StereoProjectionView;

});