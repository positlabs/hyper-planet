define(function (require) {

	/*
			adds tile images to the body. use for quickie preview of tiles
	 */

	var TilePreview = function(tiles){

		var container = ox.create('div');
		for (var i = 0, maxi = tiles.length; i < maxi; i++) {
		  container.appendChild(tiles[i].img);
		}
		document.body.appendChild(container);

	};

	return TilePreview;
});
