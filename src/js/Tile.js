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

			var imgUrl = "http://cbk" + randInt(4) + ".google.com/cbk?output=tile" +
					"&panoid=" + this.pano +
					"&zoom=" + this.zoom.toFixed() +
					"&x=" + this.x.toFixed() +
					"&y=" + this.y.toFixed();

			// have to use a proxy to get around canvas.toDataUrl crossdomain restriction.
//			var proxyUrl = "img_proxy.php?pic=images/test.jpg";
//			var proxyUrl = "img_proxy.php?pic=" + imgUrl;
//			var proxyUrl = "img_proxy.php?pic=" + "http://oscarmassivehands.files.wordpress.com/2011/11/vertstrechhnds.png";
//			return proxyUrl;
			return imgUrl;
		}
	};

	function randInt(max) {
		return Math.floor(Math.random() * max);
	}

	return Tile;

});
