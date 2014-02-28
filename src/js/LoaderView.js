define(function (require) {

	var LoaderView = function(element){

		var percentSpan = ox('.preloader span');
		var img = ox('.preloader img');

		app.on('loadProgress', function(percent){
			percentSpan.innerHTML = percent + "%";
		});

		app.on('play', function(){
			percentSpan.innerHTML = '';
		});

		app.on('routeChange', function(){
			percentSpan.innerHTML = '';
		});

		app.on('map:resize', function(mapSize){
			//TODO
			var left = (window.innerWidth + mapSize) * .5;
			percentSpan.style.left = left + 'px';
			img.style.left = left + 'px';
		});

	};

	return LoaderView;

});
