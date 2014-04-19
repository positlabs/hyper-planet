define(function (require) {

	var LoaderView = require('LoaderView');

	var UI = {

		init: function(element){

			var loader = new LoaderView(element);

			var info = ox('#info');
			info.on('click', function(e){
				console.log('clicked info', e);
				e.stopPropagation();
			});

			var infoBtn = ox('#info-btn');
			infoBtn.on('click', function(e){
				e.stopPropagation();
				document.body.classList.toggle('state-info');
			});

			ox('body').on('click', function(e){
				console.log('clicked projection container', e)
				document.body.classList.remove('state-info');
			})

			var playBtn = ox.create('div');
			playBtn.id = 'play-btn';
			playBtn.className = 'ui';
			playBtn.onclick = function(){
				app.trigger("load");
			};
			app.on('map:resize', function(mapSize){
				playBtn.style.left = (window.innerWidth + mapSize) * .5 + 'px';
				info.style.left = (window.innerWidth + mapSize) * .5 + 'px';
			});
			element.appendChild(playBtn);

			var mapDiv = ox('#map-div');

			var mapToggleBtn = ox.create("div", "Hide Map");
			mapToggleBtn.id = "map-toggle-button";
			mapToggleBtn.className = 'ui';
			mapToggleBtn.onclick = function(){
				var doHide = document.body.classList.contains('state-map');
				this.innerHTML = doHide ? "Show Map" : "Hide Map";
				document.body.classList.toggle('state-map');
				console.log('doHide', doHide);
				if(doHide) app.trigger('map:resize', 0);
				else app.trigger('map:resize', mapDiv.ox.width());
			};
			element.appendChild(mapToggleBtn);

		}

	};

	return UI;
});
