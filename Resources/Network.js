function Network() {
	var xhr = Ti.Network.createHTTPClient();
	this.loginToServer = function(data, login, el) {
		var _login = login;
		var thatData = data;
		var loginData
		//xhr.open('GET','http://twitter.com/statuses/show/123.xml');
		Ti.API.info('@@@ XHR DEBUG @@@ loginToServer FIRED');
		if (data.longitude === null) {
			loginData = {
				"loginParams" : {
					username : data.username,
					password : data.password,
					longitude : data.longitude,
					latitude : data.latitude,
					idpSignature : data.idpSignature,
					city : data.city,
					available : false,
					version : Ti.App.version
				}
			};
		} else {
			loginData = {
				"loginParams" : {
					username : data.username,
					password : data.password,
					longitude : data.longitude,
					latitude : data.latitude,
					idpSignature : data.idpSignature,
					city : data.city,
					available : Ti.App.track,
					version : Ti.App.version
				}
			};
		}

		xhr.setTimeout(60000);

		xhr.onload = function() {
			var json = this.responseText;
			var response = JSON.parse(json);
			Ti.API.info('@@@ XHR DEBUG @@@ json FROM loginToServer : ' + json);
			if (response === null || response.d.auth === null) {
				try {
					el.hide();
				} catch(err) {

				}
				return false;
			}
			if (response.d.auth.authPass === false) {
				alert('Username or Password Incorrect.\n\nA typical username would be firstnameIDPNUMBER, ex: daniel6122.\n\nA typical password would be DRIVERNUMBER, ex: 6122.\n\nIf you continue to have issues, please confirm your TAGNET username / password with your local TAG contact.')
				try {
					el.hide();
				} catch(err) {

				}
				return false;
			}
			if (response.d.auth.authPass === true) {
				try {
					el.hide();
				} catch(err) {

				}
				if (_login === true) {
					Ti.App.loggedIn = true;
					Ti.App.username = thatData.username;
					Ti.App.track = true;
					//openWindow.GLOBALS.username = thatData.username;
					//openWindow.GLOBALS.password = thatData.password;

					Ti.App.fireEvent('setUserPassword', thatData);

					Ti.App.fireEvent('LOGIN');
					//LoginWindow.win.close();
					Ti.App.fireEvent('CLOSELOGINWINDOW');
				}
				var DataBase = require('db');
				var sql = DataBase();
				sql.loggInEvent(thatData);
				sql.saveTheResponseData(response);
				return true;

			}

		}
		xhr.onerror = function(e) {
			try {
				el.hide();
			} catch(err) {

			}
			Ti.API.info('@@@ XHR ERROR @@@ : ' + e.error);
			//	alert('A network error occured, please confirm you have data available to your mobile device. You may also connect to wifi.')
			return false;
		}
		Ti.API.info('@@@ XHR DEBUG @@@ json TO loginToServer : ' + JSON.stringify(loginData));
		xhr.open("POST", "http://services.agentgrid.net/mobile/MobileService.svc/GetNewDataForIdp");
		xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
		xhr.send(JSON.stringify(loginData));

	};
	this.manualSync = function(data) {

		var thatData = data;
		var loginData;
		//xhr.open('GET','http://twitter.com/statuses/show/123.xml');
		Ti.API.info('@@@ XHR DEBUG @@@ manualSync FIRED');

		loginData = {
			"loginParams" : {
				username : data.username,
				password : data.password,
				longitude : data.longitude,
				latitude : data.latitude,
				idpSignature : data.idpSignature,
				city : data.city,
				available : true,
				version : Ti.App.version
			}
		};

		xhr.setTimeout(60000);

		xhr.onload = function() {
			var json = this.responseText;
			var response = JSON.parse(json);
			Ti.API.info('@@@ XHR DEBUG @@@ json FROM manualSync : ' + json);
			if (response === null || response.d.auth === null) {

				return;
			}
			if (response.d.auth.authPass === false) {
				alert('Username or Password Incorrect.\n\nA typical username would be firstnameIDPNUMBER, ex: daniel6122.\n\nA typical password would be DRIVERNUMBER, ex: 6122.\n\nIf you continue to have issues, please confirm your TAGNET username / password with your local TAG contact.')

				return;
			}
			if (response.d.auth.authPass === true) {

				var DataBase = require('db');
				var sql = DataBase();
				sql.saveTheResponseData(response);
				return;

			}

		}
		xhr.onerror = function(e) {
			Ti.API.info('@@@ XHR ERROR @@@ : ' + e.error);
			//	alert('A network error occured, please confirm you have data available to your mobile device. You may also connect to wifi.')
			return;
		}
		Ti.API.info('@@@ XHR DEBUG @@@ json TO manualSync : ' + JSON.stringify(loginData));
		xhr.open("POST", "http://services.agentgrid.net/mobile/MobileService.svc/GetNewDataForIdp");
		xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
		xhr.send(JSON.stringify(loginData));

	};
	return this;
}

module.exports = Network;
