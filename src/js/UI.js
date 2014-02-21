define(function (require) {

	var LoaderView = require('LoaderView');

	var UI = {

		init: function(){

			var loader = new LoaderView();

			var playBtn = ox.create("div", 'play');
			playBtn.id = 'play-btn';
			playBtn.onclick = function(){
				app.trigger("play");
			};
			document.body.appendChild(playBtn);

			var mapToggleBtn = ox.create("div", "<< Map");
			mapToggleBtn.id = "map-toggle-button";
			mapToggleBtn.onclick = function(){
				this.innerText = document.body.classList.contains('state-map') ? "<< Map" : "Map >>";
				document.body.classList.toggle('state-map');
			};
			document.body.appendChild(mapToggleBtn);

		}

	};

	return UI;
});
