define(function (require) {

	var LoaderView = function(){

		var div = ox.create('div');
		div.id = "loader-view";

		document.body.appendChild(div);

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
