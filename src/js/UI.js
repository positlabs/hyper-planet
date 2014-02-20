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

		}

	};

	return UI;
});
