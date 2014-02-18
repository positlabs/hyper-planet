define(function (require) {

	require("bower/ox/ox");
	var Tile = require('Tile');

	var gm = google.maps;
	var sv = new gm.StreetViewService();

	require('bower/underscore/underscore');

	var Panorama = function (latLng) {
		console.log("Panorama."+"Panorama()", arguments);
		new ox.Events(this);
		this.latLng = latLng;
		this.tiles = [];

		this.assembleImage = _.bind(this.assembleImage, this);
	};

	Panorama.prototype = {
		load: function () {
			console.log("Panorama."+"load()", arguments);
			PanoLoader.once("load", this.assembleImage);
			PanoLoader.loadByLocation(this.latLng);
		},

		assembleImage: function (e) {
			console.log("Panorama."+"assembleImage()", arguments);
			this.tiles = e.tiles;
			//TODO: assemble the image from the tiles, rotate 180deg
			this.trigger("load");
		},

		setData:function(data){
			this.data = data;
		}

	};


	///////////////////////////
	// PanoLoader
	///////////////////////////
	///////////////////////////
	///////////////////////////
	///////////////////////////

	// limit concurrent Tile loads to 4 by making a queue
	var loading = []; // holds the 4 loading tiles
	//TODO: set zoom somewhere
	var zoom = 2;

	var PanoLoader = new ox.Events({

		loadById: function (id) {
			sv.getPanoramaById(id, window.processSVData);
		},

		loadByLocation: function (latLng) {
			console.log("PanoLoader."+"loadByLocation()", arguments);
			sv.getPanoramaByLocation(latLng, 50, window.processSVData);
		},

		processPanoData: function (panoData) {
			console.log("PanoLoader."+"processPanoData()", arguments);

			var panorama = new Panorama(panoData);

			// how many tiles are there to load?
			var panoTiles = panoData.tiles;

			//FIXME: not working well for some reason...
			var aspect = panoTiles.worldSize.height / panoTiles.worldSize.width;
			var tilesX = Math.pow(2, zoom);
			var tilesY = Math.ceil(tilesX * aspect);

			var panoId = panoData.location.pano;

			console.log("tilesX", tilesX);
			console.log("tilesY", tilesY);
			console.log("panoId", panoId);

//			this.tiles[panoId] = [];

			var tiles = [];
			for (var y = 0; y < tilesY; y++) {
				for (var x = 0; x < tilesX; x++) {
					var tile = new Tile(panoId, panoData.location.latLng, zoom, x, y);
					tiles.push(tile);
//					this.tiles[panoId].push(tile);
				}
			}

			// queue the tiles to load
//			var queue = [].concat(this.tiles[panoId]);
			var queue = [].concat(tiles);
			var toLoad = queue.length;

			function loadTiles() {
				console.log("loadTiles." + "loadTiles()", arguments);

				while (loading.length < 4 && queue.length > 0) {

					(function () {
						var _tiles = tiles;
						var tile = queue.pop();
						loading.push(tile);
						tile.load(function (img) {
							// remove tile from loading array
							loading.splice(loading.indexOf(tile), 1);
							toLoad--;
							console.log("toLoad", toLoad);
							if (toLoad == 0) {

								// dispatch event to notify this pano is loaded
								PanoLoader.trigger("load", {id: tile.pano, tiles: _tiles});
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

		// tile groups stored by pano id
//		tiles: {}

	});

	// needs to be global scope because it's a jsonp callback
	window.processSVData = function (data, status) {
		if (status == gm.StreetViewStatus.OK) {
			PanoLoader.processPanoData(data);
		} else {
			alert('Street View data not found for this location.');
		}
	};


	return Panorama;

});
