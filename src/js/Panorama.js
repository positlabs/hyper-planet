define(function (require) {

	require('bower/underscore/underscore');
	require("bower/ox/ox");
	var Tile = require('Tile');

	var gm = google.maps;
	var sv = new gm.StreetViewService();

	var Panorama = function (latLng, quality) {
//		console.log("Panorama." + "Panorama()", arguments);

		new ox.Events(this);

		this.latLng = latLng;
		this.tiles = [];
		this.texture = {};

		this.quality = quality != undefined ? quality : 1;

		this.assembleImage = _.bind(this.assembleImage, this);
		this.onLoadFailed = _.bind(this.onLoadFailed, this);

	};

	Panorama.init = function(){
		app.on('cancelLoad', function(){
			PanoLoader.loadCancelFlag = true;
			loading = [];
		});
	};

	Panorama.prototype = {
		load: function () {
			//			console.log("Panorama." + "load()", arguments);
			PanoLoader.once("load", this.assembleImage);
			PanoLoader.once("loadFailed", this.onLoadFailed);
			PanoLoader.loadByLocation(this.latLng, this.quality);
		},
		onLoadFailed:function(){
			this.trigger("load");
		},
		assembleImage: function (e) {
			//			console.log("Panorama." + "assembleImage()", arguments);
			this.tiles = e.tiles;
			this.data = e.data;
			this.id = e.id;

			// assemble the image from the tiles
			var tileWidth = e.data.tiles.tileSize.width;
			var tileHeight = e.data.tiles.tileSize.height;
			var canvas = ox.create('canvas');
			canvas.width = e.units.x * tileWidth;
			canvas.height = canvas.width * e.aspectRatio;
			var ctx = canvas.getContext('2d');

			// draw all of the tiles to canvas
			for (var i = 0, maxi = e.tiles.length; i < maxi; i++) {
				var tile = e.tiles[i];
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
			// rotate canvas 108deg, crop out what we don't need
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
			this.trigger('load', outCanvas);
		}

	};

	// pixel brightness
	function getPixelValue(pixel) {
		return pixel[0] + pixel[1] + pixel[2];
	}

	function getPixel(imgData, x, y) {
		var index = (x + y * imgData.width) * 4;
		return [ imgData.data[index + 0], imgData.data[index + 1], imgData.data[index + 2], imgData.data[index + 3]];
	}


	///////////////////////////
	// PanoLoader
	///////////////////////////
	///////////////////////////
	///////////////////////////
	///////////////////////////

	// limit concurrent Tile loads to 4 by making a queue
	var loading = []; // holds the 4 loading tiles

	var PanoLoader = new ox.Events({

		loadById: function (id) {
			sv.getPanoramaById(id, window.processSVData);
		},

		loadByLocation: function (latLng, quality) {
			//			console.log("PanoLoader." + "loadByLocation()", arguments);
			this.quality = quality;
			sv.getPanoramaByLocation(latLng, 50, window.processSVData);
		},

		processPanoData: function (panoData) {
			//			console.log("PanoLoader." + "processPanoData()", arguments);

			this.loadCancelFlag = false;
			var panoTiles = panoData.tiles;

			var aspectRatio = panoTiles.worldSize.height / panoTiles.worldSize.width;

			var tilesX = Math.ceil(26 / Math.pow(2, 5 - this.quality));
			var tilesY = Math.ceil(tilesX * aspectRatio);
			var panoId = panoData.location.pano;

			var tiles = [];
			for (var y = 0; y < tilesY; y++) {
				for (var x = 0; x < tilesX; x++) {
					var tile = new Tile(panoId, panoData.location.latLng, this.quality, x, y);
					tiles.push(tile);
				}
			}

			// queue the tiles to load
			var queue = [].concat(tiles);
			var toLoad = queue.length;
			var _this = this;

			function loadTiles() {
				//				console.log("loadTiles." + "loadTiles()", arguments);

				while ((loading.length < 4 && queue.length > 0) && _this.loadCancelFlag == false) {

					(function () {
						// scoping vars
						var _tiles = tiles;
						var _panoData = panoData;
						var _units = {x: tilesX, y: tilesY};
						var _aspectRatio = aspectRatio;

						var tile = queue.pop();
						loading.push(tile);
						tile.load(function (img) {
							// remove tile from loading array
							loading.splice(loading.indexOf(tile), 1);
							toLoad--;
							if (toLoad == 0) {
								// dispatch event to notify this pano is loaded
								PanoLoader.trigger("load", {
									id: tile.pano,
									tiles: _tiles,
									data: _panoData,
									units: _units,
									aspectRatio: _aspectRatio
								});
							}
						});
					})();

				}

				if (queue.length == 0) {
					clearInterval(loadPoll);
				}
			}

			var loadPoll = setInterval(loadTiles, 50);
		}

	});

	// needs to be global scope because it's a jsonp callback
	window.processSVData = function (data, status) {
		if (status == gm.StreetViewStatus.OK) {
			PanoLoader.processPanoData(data);
		} else {
			console.log('Street View data not found for this location.', status, data);
			PanoLoader.trigger("loadFailed");
		}
	};

	return Panorama;

});
