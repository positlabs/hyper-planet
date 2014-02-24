define(function (require) {

	var StereoProjectionShader = require('StereoProjectionShader');
	var VirtualScroll = require('VirtualScroll');

	var shaderPass,
			composer,
			renderer,
			camera;

	var defaultZoom = 9;

	var StereoProjectionView = {

		init: function (parentEl) {

			var _this = this;

			var scene,
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

			composer = new THREE.EffectComposer(renderer);
			composer.addPass(new THREE.RenderPass(scene, camera));

			shaderPass = new THREE.ShaderPass(StereoProjectionShader);
			shaderPass.renderToScreen = true;
			shaderPass.uniforms.scale.value = defaultZoom;
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

			this.onResize = _.bind(this.onResize, this);
			window.addEventListener('resize', this.onResize);

			this.pause = _.bind(this.pause, this);
			this.stop = _.bind(this.stop, this);
			app.on('stop', this.stop);

			this.onKeydown = _.bind(this.onKeydown, this);
			window.addEventListener('keydown', this.onKeydown);
		},
		onWheel: function (e) {

			// only allow zoom when timelapse is playing
			var zoomEnabled = document.body.classList.contains('state-playing');
			if (zoomEnabled) {
				var delta = -e.deltaY / 40;
				shaderPass.uniforms.scale.value += delta;
				shaderPass.uniforms.scale.value = Math.min(20, shaderPass.uniforms.scale.value);
				shaderPass.uniforms.scale.value = Math.max(3, shaderPass.uniforms.scale.value);
			}

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
			var w = window.innerWidth,
					h = window.innerHeight;
			renderer.setSize(w, h);
			shaderPass.uniforms.aspect.value = window.innerHeight / window.innerWidth;

		},
		onKeydown: function (e) {
			switch (e.keyCode) {
				case 32:
					if (this.playing) {
						this.pause();
					} else if (this.paused) {
						this.resume();
					}
					break;
				case 37:
					//left
					this.scrub(-1);
					break;
				case 39:
					//right
					this.scrub(1);
					break;
			}
		},
		play: function (textureSequence) {
			console.log("StereoProjectionView." + "play()", arguments);
			app.trigger('play');

			shaderPass.uniforms.scale.value = defaultZoom;

			this.textures = textureSequence.textures;
			this.currentFrame = 0;
			this.resume();
		},
		resume: function(){
			var _this = this;
			this.playing = true;
			this.animInterval = setInterval(function () {
				_this.scrub(1, true);
			}, 1000 / 10);
		},
		stop: function () {
			this.paused = false;
			this.playing = false;
			if (this.animInterval) {
				clearInterval(this.animInterval);
			}
		},
		pause: function () {
			if (this.playing) {
				this.paused = true;
			}
			this.playing = false;
			if (this.animInterval) {
				clearInterval(this.animInterval);
			}
		},
		scrub: function (delta, force) {
			if (this.paused || force) {
				this.currentFrame += delta;
				if(this.currentFrame < 0 ){
					// delta is negative and we hit the beginning of the array, go to the end
					this.currentFrame = this.textures.length + delta;
				}else if(this.currentFrame > this.textures.length){
					// delta is positive and we hit the end of the array, go to the beginning
					this.currentFrame = this.currentFrame % this.textures.length;
				}
				this.setTexture(this.textures[this.currentFrame]);
			}
		}

	};

	return StereoProjectionView;

});
