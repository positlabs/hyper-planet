define(function (require) {

	require('bower/underscore/underscore');
	require("bower/ox/ox");
	var Tile = require('Tile');

	var gm = google.maps;
	var sv = new gm.StreetViewService();

	var Panorama = function (latLng, quality) {

		new ox.Events(this);

		this.latLng = latLng;
		this.tiles = [];
		this.texture = {};

		this.quality = quality != undefined ? quality : 1;

		this.processPanoData = _.bind(this.processPanoData, this);
		this.assembleImage = _.bind(this.assembleImage, this);
		this.onLoadFailed = _.bind(this.onLoadFailed, this);

	};

	Panorama.prototype = {
		assembleImage: function (e) {

			// assemble the image from the tiles
			var tileWidth = this.data.tiles.tileSize.width;
			var tileHeight = this.data.tiles.tileSize.height;
			var canvas = ox.create('canvas');
			canvas.width = this.units.x * tileWidth;
			canvas.height = canvas.width * this.aspectRatio;
			var ctx = canvas.getContext('2d');

			// draw all of the tiles to canvas
			for (var i = 0, maxi = this.tiles.length; i < maxi; i++) {
				var tile = this.tiles[i];
				ctx.drawImage(tile.img, tile.x * tileWidth, tile.y * tileHeight);
			}
			// document.body.appendChild(canvas);

			// determine the area of the image we need to pull out
			// walk the black pixels at the bottom of the picture
			var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			var blackBarHeight = 0;

			var hitColorPixel = false;
			while (hitColorPixel == false) {
				var pixel = getPixel(imageData, canvas.width * .5, canvas.height - blackBarHeight - 1);
				if (getPixelValue(pixel) == 0) {
					// just check every 3rd pixel for performance reasons
					blackBarHeight += 3;
				} else {
					hitColorPixel = true;
				}
			}

			// note: this is a hack because we don't know how big the actual pano is...
			// there is sometimes a black bar on the bottom and right of the image
			// subtract 2x blackBarHeight from width, 1x from height
			// rotate canvas 180deg, crop out what we don't need
			var outCanvas = ox.create('canvas');
			outCanvas.width = canvas.width - blackBarHeight * 2;
			outCanvas.height = canvas.height - blackBarHeight;
			var outCtx = outCanvas.getContext('2d');
			outCtx.rotate(Math.PI);
			outCtx.translate(-outCanvas.width, -outCanvas.height);
			outCtx.drawImage(canvas, 0, 0);

			// debugging
			//			outCanvas.ox.css({
			//				position:"absolute",
			//				top:0,
			//				left:0,
			//				webkitTransformOrigin: "16% 16%",
			//				webkitTransform:"rotate(.5turn) scale(.2)"
			//			});
			//			document.body.appendChild(outCanvas);

			this.canvas = outCanvas;
			this.createTexture();
			this.trigger('load');
		},

		createTexture: function () {
			this.texture = TextureFactory.createTexture(this.canvas);
		},

		///
		///
		/// loading stuff
		///
		///

		load: function () {
			this.loadByLocation(this.latLng);
		},
		onLoadFailed: function () {
			this.trigger("load");
		},
		loadByLocation: function (latLng) {
			var funcName = '__' + latLng.d + '_' + latLng.e;

			var _this = this;
			window[funcName] = function(data, status){
				if (status == gm.StreetViewStatus.OK) {
					_this.processPanoData(data);
				} else {
					console.log('Street View data not found for this location.', status, data);
					_this.onLoadFailed();
				}
			};
			sv.getPanoramaByLocation(latLng, 50, window[funcName]);
		},

		processPanoData: function (panoData) {
			// console.log("Panorama."+"processPanoData()", arguments);

			var _this = this;

			var panoTiles = panoData.tiles;
			var aspectRatio = panoTiles.worldSize.height / panoTiles.worldSize.width;
			var tilesX = Math.ceil(26 / Math.pow(2, 5 - this.quality));
			var tilesY = Math.ceil(tilesX * aspectRatio);

			this.id = panoData.location.pano;
			this.units = {x: tilesX, y: tilesY};
			this.aspectRatio = aspectRatio;
			this.tiles = [];
			this.data = panoData;

			for (var y = 0; y < tilesY; y++) {
				for (var x = 0; x < tilesX; x++) {
					var tile = new Tile(this.id, panoData.location.latLng, this.quality, x, y);
					this.tiles.push(tile);
				}
			}

			// queue the tiles to load
			var queue = [].concat(this.tiles);
			var toLoad = queue.length;

			while (queue.length > 0) {

				(function () {
					var tile = queue.pop();
					tile.load(function (img) {
						toLoad--;
						if (toLoad == 0) {
							_this.assembleImage();
						}
					});
				})();

			}

		}

	};

	var TextureFactory;
	Panorama.init = function (StereoProjectionView) {
		TextureFactory = StereoProjectionView;
	};

	// pixel brightness
	function getPixelValue(pixel) {
		return pixel[0] + pixel[1] + pixel[2];
	}

	function getPixel(imgData, x, y) {
		var index = (x + y * imgData.width) * 4;
		return [ imgData.data[index + 0], imgData.data[index + 1], imgData.data[index + 2], imgData.data[index + 3]];
	}

	return Panorama;

});
