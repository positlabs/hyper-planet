define(function (require) {

	var LoaderView = require('LoaderView');

	var UI = {

		init: function(element){

			var loader = new LoaderView(element);

			var playBtn = ox.create('div');
			playBtn.id = 'play-btn';
			playBtn.className = 'ui';
			playBtn.onclick = function(){
				app.trigger("load");
			};
			element.appendChild(playBtn);

			var mapToggleBtn = ox.create("div", "Hide Map");
			mapToggleBtn.id = "map-toggle-button";
			mapToggleBtn.className = 'ui';
			mapToggleBtn.onclick = function(){
				this.innerHTML = !document.body.classList.contains('state-map') ? "Hide Map" : "Show Map";
				document.body.classList.toggle('state-map');
			};
			element.appendChild(mapToggleBtn);

		}

	};

	return UI;
});
