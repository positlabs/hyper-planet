define(function (require) {

	var LoaderView = function(element){

		var div = ox.create('div');
		div.id = "loader-view";
		div.className = "ui";
		element.appendChild(div);

		var percentSpan = ox.create('span');
		div.appendChild(percentSpan);

		var gif = ox.create('img');
		div.appendChild(gif);

		app.on('loadProgress', function(percent){
			div.style.opacity = 1;
			percentSpan.innerHTML = percent + "%";
		});

		app.on('routeChange', function(){
			div.style.opacity = 0;
		});

	};

	return LoaderView;

});
