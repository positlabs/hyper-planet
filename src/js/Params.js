define(function (require) {

	var qString = "";

	var Params = {
		init:function(){
			setInterval(this._checkParams, 300);
			this._checkParams();
		},
		_checkParams:function(){
			if (qString != window.location.search) {
				qString = window.location.search;

				var paramObj = {};
				var ampSplit = qString.slice(1, qString.length).split("&");
				for (var i = 0, maxi = ampSplit.length; i < maxi; i++) {
				  var eqSplit = ampSplit[i].split('=');
					paramObj[eqSplit[0]] = eqSplit[1];
				}

				app.trigger("change:params", paramObj);

			}
		},
		get: function (name) {
			var name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
			var regexS = "[\\?&]" + name + "=([^&#]*)";
			var regex = new RegExp(regexS);
			var results = regex.exec(window.location.href);
			if (results == null)
				return undefined;
			else
				return results[1];
		}
	};

	return Params;

});
