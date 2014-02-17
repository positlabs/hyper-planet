define(function (require) {

	require('three');
	var StereoProjectionShader = {

		uniforms: {

			"texture": { type: "t", value: null },
			"scale": { type: "f", value: 1 },
			"aspect": { type: "f", value: 16/9 },
			"time": { type: "f", value: 1.0 },
			"transform": { type: "v3", value: new THREE.Vector3(1, 1, 1) }

		},

		vertexShader: [

			"varying vec2 vUv;",
			"void main() {",
			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			"}"

//			"uniform mat4 projection;",
//			"attribute vec3 position;",
//			"attribute vec2 texcoord;",
//			"varying vec2 v_texcoord;",
//			"void main(){",
//			"v_texcoord = texcoord;",
//			"gl_Position = projection * vec4(position, 1.);",
//			"}"

		].join("\n"),

		fragmentShader: [

			"varying vec2 vUv;",
			"uniform sampler2D texture;",
			"uniform float scale;",
			"uniform float aspect;",
			"uniform float time;",
			"uniform vec3 transform;",

			"#define PI 3.141592653589793",

			"void main() {",
			"vec2 rads = vec2(PI * 2., PI);",

			"vec2 pnt = (vUv - .5) * vec2(scale, scale * aspect);",

			//			Project to Sphere
			"float x2y2 = pnt.x * pnt.x + pnt.y * pnt.y;",
			"vec3 sphere_pnt = vec3(2. * pnt, x2y2 - 1.) / (x2y2 + 1.);",
			"sphere_pnt *= transform;",

			//			Convert to Spherical Coordinates
			"float r = length(sphere_pnt);",
			"float lon = atan(sphere_pnt.y, sphere_pnt.x) + PI;",
			"float lat = acos(sphere_pnt.z / r);",

			"gl_FragColor = texture2D(texture, vec2(lon, lat) / rads);",
//			"gl_FragColor = texture2D(texture, vUv);",


			"}"

		].join("\n")

	};

	return StereoProjectionShader;

});
