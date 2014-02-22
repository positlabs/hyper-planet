define(function (require) {

	var SplashView = {
		init:function(element){

			ox('#view-reel').addEventListener("click", function(){
				element.classList.add("hidden");
				setTimeout(function(){
					document.body.classList.remove("state-splash");
					document.body.classList.add("state-map");
				}, 2000);
			});

		}
	};

	return SplashView;

});
