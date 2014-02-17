define(function (require) {

	var StereoProjectionShader = require('StereoProjectionShader');

	var StereoProjection = {

		init: function () {

			var composer, renderer, scene, camera, plane,
					width = window.innerWidth,
					height = window.innerHeight,
					near = -.1,
					far = 10000;

			renderer = new THREE.WebGLRenderer({});
			renderer.setSize(width, height);
			scene = new THREE.Scene();
			camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, near, far);
			scene.add(camera);

			document.body.appendChild(renderer.domElement);

			plane = new THREE.Mesh(new THREE.PlaneGeometry(width, height, 1, 1));
			scene.add(plane);

			composer = new THREE.EffectComposer(renderer);
			composer.addPass(new THREE.RenderPass(scene, camera));

			var effect = new THREE.ShaderPass(StereoProjectionShader);
			effect.uniforms.texture.value = THREE.ImageUtils.loadTexture('images/test3.jpg');
			effect.renderToScreen = true;
			composer.addPass(effect);

			var start_time = Date.now();
			ox.FrameImpulse.on('frame', function () {
				var time = (Date.now() - start_time) / 1000;

//					transform: pano_orientation.toMat4().mul(new core.Mat4().rotate(pano_heading + Math.PI / 2, 0,0,1)),
//				effect.uniforms.scale.value = Math.pow(2, 3);
				effect.uniforms.scale.value = 8;
				effect.uniforms.time.value = time;
//				effect.uniforms.transform.value = [];
				effect.uniforms.aspect.value = window.innerHeight / window.innerWidth;

				composer.render();
			});
			ox.FrameImpulse.start();


		}


	};

	return StereoProjection;

});
