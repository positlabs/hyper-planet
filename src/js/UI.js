define(function (require) {

	var LoaderView = require('LoaderView');

	var UI = {

		init: function(element){

			var loader = new LoaderView(element);

			var playBtn = ox.create("div", 'play');
			playBtn.id = 'play-btn';
			playBtn.className = 'ui';
			playBtn.onclick = function(){
				app.trigger("play");
			};
			element.appendChild(playBtn);

			var mapToggleBtn = ox.create("div", "<< Map");
			mapToggleBtn.id = "map-toggle-button";
			mapToggleBtn.className = 'ui';
			mapToggleBtn.onclick = function(){
				this.innerText = document.body.classList.contains('state-map') ? "<< Map" : "Map >>";
				document.body.classList.toggle('state-map');
			};
			element.appendChild(mapToggleBtn);

		}

	};

	return UI;
});
