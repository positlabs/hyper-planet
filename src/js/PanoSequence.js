define(function (require) {

	var Panorama = require('Panorama');
	var StereoProjectionView = require('StereoProjectionView');

	var TextureSequence = function () {

		var _this = this;
		new ox.Events(this);

		app.on('routeChange', function () {
			_this.loaded = false;
		});

	};

	TextureSequence.prototype.load = function (route) {

		var _this = this;
		this.route = route;
//		this.textures = [];
		this.panos = [];
		this.loaded = false;
		this.loading = true;

		for (var i = 0, maxi = route.length; i < maxi; i++) {
			this.panos.push(new Panorama(route[i]));
		}

		var currentPanoIndex = 0;

		// load panos one at a time
		function loadPano() {
			if(_this.destroyed) return;

			var pano = _this.panos[currentPanoIndex];
			pano.once('load', function () {
				if(_this.destroyed) return;
				console.log("loaded ", currentPanoIndex, ' / ', _this.panos.length);
				app.trigger("loadProgress", Math.round(currentPanoIndex / _this.panos.length * 100));
				if (currentPanoIndex < _this.panos.length) {
					// load next pano
					loadPano();
				} else {
					// done loading panos. filter out the bad ones
					filterBadPanos();
				}
			});
			pano.load();
			currentPanoIndex++;
		}

		function filterBadPanos() {
			if(_this.destroyed) return;
			var newPanos = _this.panos.concat([]);
			for (var i = 0, maxi = _this.panos.length; i < maxi; i++) {
				var pano = _this.panos[i];
				if(pano.canvas){
					newPanos.push(pano); //only save the panos that have valid streetview data
				}
			}
			_this.panos = newPanos;
			_this.loaded = true;
			_this.loading = false;
			_this.trigger('load');
		}

		// start loading
		loadPano();

	};

	TextureSequence.prototype.destroy = function(){
		this.destroyed = true;
	};

	return TextureSequence;
});
