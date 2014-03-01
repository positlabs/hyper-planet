define(function (require) {

	var hashString = "";
	var paramObj = {};

	var Params = {
		init: function () {
			setInterval(this._checkParams, 300);
			this._checkParams();
		},
		_checkParams: function () {
			if (hashString != window.location.hash) {
				hashString = window.location.hash;

				var ampSplit = hashString.slice(2, hashString.length).split('&');
				for (var i = 0, maxi = ampSplit.length; i < maxi; i++) {
					var eqSplit = ampSplit[i].split('=');
					paramObj[eqSplit[0]] = eqSplit[1];
				}

				app.trigger("change:params", paramObj);

			}
		},
		get: function (name) {
			return paramObj[name];
		},
		set: function (key, value) {
			paramObj[key] = value;

			var keyValArr = [];
			for (p in paramObj) {
				keyValArr.push(p + '=' + paramObj[p]);
			}
			var hash = '#/' + keyValArr.join('&');
			window.location.hash = hash;
		}
	};

	return Params;

});
