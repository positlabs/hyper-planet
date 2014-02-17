


require.config({
	paths: {

		"three": "bower/threejs/build/three",
		"three.CopyShader": "lib/threejs/CopyShader",
		"three.DotScreenShader": "lib/threejs/DotScreenShader",
		"three.EffectComposer": "lib/threejs/EffectComposer",
		"three.RenderPass": "lib/threejs/RenderPass",
		"three.MaskPass": "lib/threejs/MaskPass",
		"three.ShaderPass": "lib/threejs/ShaderPass",
		"three.DotScreenPass": "lib/threejs/DotScreenPass",
		"three.RGBShiftShader": "lib/threejs/RGBShiftShader"

	},
	shim:{
		"three.ShaderPass":{
			deps:["three"]
		},
		"three.CopyShader":{
			deps:["three"]
		},
		"three.RenderPass":{
			deps:["three"]
		},
		"three.RGBShiftShader":{
			deps:["three"]
		},
		"three.DotScreenPass":{
			deps:["three"]
		},
		"three.DotScreenShader":{
			deps:["three"]
		},
		"three.EffectComposer":{
			deps:["three"]
		},
		"three.MaskPass":{
			deps:["three"]
		}
	}

	// This will help with cache issues related to development.
	// urlArgs: "bust=" + Number(new Date())
});