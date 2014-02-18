define(function (require) {

	function Tile(pano, latLng, zoom, x, y) {
		this.pano = pano;
		this.latLng = latLng;
		this.zoom = zoom;
		this.x = x;
		this.y = y;
		this.img = undefined;
	}

	Tile.prototype = {
		load: function (callback) {
			var _this = this;
			ox.loadImage(this.getUrl(), function (img) {
				_this.img = img;
				callback(img);
			});
		},
		getKey: function () {
			return [ this.pano, this.zoom, this.x, this.y ].join(",");
		},
		getUrl: function () {
			return "http://cbk" + randInt(4) + ".google.com/cbk?output=tile" +
					"&panoid=" + this.pano +
					"&zoom=" + this.zoom.toFixed() +
					"&x=" + this.x.toFixed() +
					"&y=" + this.y.toFixed();
		}
	};

	function randInt(max) {
		return Math.floor(Math.random() * max);
	}

	return Tile;

});
