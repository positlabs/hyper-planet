define(function (require) {

	var LoaderView = function(){

		var div = ox.create('div');
		div.id = "loader-view";

		document.body.appendChild(div);

		app.on('loadProgress', function(percent){
			div.innerHTML = "loaded " + percent + "%";
		});

	};

	return LoaderView;

});
