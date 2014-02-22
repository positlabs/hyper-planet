define(function (require) {

	var LoaderView = function(element){

		var div = ox.create('div');
		div.id = "loader-view";
		div.className = "ui";

		element.appendChild(div);

		app.on('loadProgress', function(percent){
			div.style.opacity = 1;
			div.innerHTML = "loaded " + percent + "%";
		});

		app.on('routeChange', function(){
			div.style.opacity = 0;
		});

	};

	return LoaderView;

});
