define(function (require) {

	var StereoProjectionShader = {

		uniforms: {

			"texture": { type: "t", value: null },
			"center": { type: "v2", value: new THREE.Vector2(0.5, 0.5) },
			"scale": { type: "f", value: 1.0 },
			"aspect": { type: "f", value: 1.0 },
			"time": { type: "f", value: 1.0 }

		},

		vertexShader: [

			"varying vec2 vUv;",

			"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform sampler2D texture;",
			"uniform float scale;",
			"uniform float aspect;",
			"uniform float time;",
			"uniform mat3 transform;",

			"#define PI 3.141592653589793",

			"varying vec2 vUv;",

			"float pattern() {",

			"float s = sin( angle ), c = cos( angle );",

			"vec2 tex = vUv * tSize - center;",
			"vec2 point = vec2( c * tex.x - s * tex.y, s * tex.x + c * tex.y ) * scale;",

			"return ( sin( point.x ) * sin( point.y ) ) * 4.0;",

			"}",

			"void main() {",
			"vec2 rads = vec2(PI * 2., PI);",

			"vec2 pnt = (vUv - .5) * vec2(scale, scale * aspect);",

			// Project to Sphere
			"float x2y2 = pnt.x * pnt.x + pnt.y * pnt.y;",
			"vec3 sphere_pnt = vec3(2. * pnt, x2y2 - 1.) / (x2y2 + 1.);",
			"sphere_pnt *= transform;",

			// Convert to Spherical Coordinates
			"float r = length(sphere_pnt);",
			"float lon = atan(sphere_pnt.y, sphere_pnt.x);",
			"float lat = acos(sphere_pnt.z / r);",

			"gl_FragColor = texture2D(texture, vec2(lon, lat) / rads);",

			"}"

		].join("\n")

	};

	return StereoProjectionShader;

});
