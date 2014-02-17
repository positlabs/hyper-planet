define(["require_config"], function () {

	require([
		'three',
		'bower/ox/ox',
		'three.CopyShader',
		'three.ShaderPass',
		'three.RenderPass',
		'three.EffectComposer',
		'three.RGBShiftShader',
		'three.DotScreenPass',
		'three.MaskPass',
		'three.DotScreenShader'
	], function () {

//		var camera, scene, renderer, composer;
//		var object, light;
//
//		renderer = new THREE.WebGLRenderer();
//		renderer.setSize( window.innerWidth, window.innerHeight );
//		document.body.appendChild( renderer.domElement );
//
//		camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
//		camera.position.z = 400;
//
//		scene = new THREE.Scene();
//		scene.fog = new THREE.Fog( 0x000000, 1, 1000 );
//
//		object = new THREE.Object3D();
//		scene.add( object );
//
//		var geometry = new THREE.SphereGeometry( 1, 4, 4 );
//		var material = new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading } );
//
//		for ( var i = 0; i < 100; i ++ ) {
//
//			var mesh = new THREE.Mesh( geometry, material );
//			mesh.position.set( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 ).normalize();
//			mesh.position.multiplyScalar( Math.random() * 400 );
//			mesh.rotation.set( Math.random() * 2, Math.random() * 2, Math.random() * 2 );
//			mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 50;
//			object.add( mesh );

//		}

//		scene.add( new THREE.AmbientLight( 0x222222 ) );

//		light = new THREE.DirectionalLight( 0xffffff );
//		light.position.set( 1, 1, 1 );
//		scene.add( light );

		// postprocessing
//
//		composer = new THREE.EffectComposer( renderer );
//		composer.addPass( new THREE.RenderPass( scene, camera ) );
//
//		var effect = new THREE.ShaderPass( THREE.DotScreenShader );
//		effect.uniforms[ 'scale' ].value = 4;
//		composer.addPass( effect );
//
//		var effect = new THREE.ShaderPass( THREE.RGBShiftShader );
//		effect.uniforms[ 'amount' ].value = 0.0015;
//		effect.renderToScreen = true;
//		composer.addPass( effect );
//
//		ox.FrameImpulse.on('frame', function(){
//
//			object.rotation.x += 0.005;
//			object.rotation.y += 0.01;
//
//			composer.render();
//		});
//		ox.FrameImpulse.start();

///////////////////////
///////////////////////
///////////////////////
///////////////////////
///////////////////////
///////////////////////
///////////////////////
///////////////////////
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

		var effect = new THREE.ShaderPass(THREE.DotScreenShader);
		effect.uniforms[ 'scale' ].value = 4;
		effect.renderToScreen = true;
		composer.addPass(effect);

		ox.FrameImpulse.on('frame', function () {
			composer.render();
		});
		ox.FrameImpulse.start();

	});
});
