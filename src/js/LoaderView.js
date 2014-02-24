define(function (require) {

	var LoaderView = function(element){

		var percentSpan = element.querySelector('span');
		var img = element.querySelector('img');

		app.on('loadProgress', function(percent){
			percentSpan.innerHTML = percent + "%";
		});

		app.on('play', function(){
			percentSpan.innerHTML = '';
		});

		app.on('routeChange', function(){
			percentSpan.innerHTML = '';
		});

	};

	return LoaderView;

});
