define(function (require) {

	var StereoProjectionShader = require('StereoProjectionShader');

	var shaderPass, composer;

	var StereoProjection = {

		init: function (parentEl) {

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

			// TODO - remove this. only use for debugging.
			renderer.domElement.id = "stereo-projection";
			parentEl.appendChild(renderer.domElement);

			plane = new THREE.Mesh(new THREE.PlaneGeometry(width, height, 1, 1));
			scene.add(plane);

			composer = new THREE.EffectComposer(renderer);
			composer.addPass(new THREE.RenderPass(scene, camera));

			shaderPass = new THREE.ShaderPass(StereoProjectionShader);
//			effect.uniforms.texture.value = THREE.ImageUtils.loadTexture('images/test3.jpg');

			/*

			var start_time = Date.now();
			ox.FrameImpulse.on('frame', function () {
				var time = (Date.now() - start_time) / 1000;
//					transform: pano_orientation.toMat4().mul(new core.Mat4().rotate(pano_heading + Math.PI / 2, 0,0,1)),
//				effect.uniforms.scale.value = Math.pow(2, 3);
				effect.uniforms.scale.value = 12;
				effect.uniforms.time.value = time;
//				effect.uniforms.transform.value = [];
				effect.uniforms.aspect.value = window.innerHeight / window.innerWidth;

				composer.render();
			});
			ox.FrameImpulse.start();
			 */

		},
		render:function(textureCanvas){

			var texture = new THREE.Texture(textureCanvas);
			texture.needsUpdate = true;
			shaderPass.renderToScreen = true;
			shaderPass.uniforms.texture.value = texture;
			shaderPass.uniforms.scale.value = 9;
			shaderPass.uniforms.aspect.value = window.innerHeight / window.innerWidth;
			composer.addPass(shaderPass);
			composer.render();

			//TODO: what do we output? texture? image data?
		}


	};

	return StereoProjection;

});
