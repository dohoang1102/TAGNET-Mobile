function DeleteService() {
	
	var app = {
		xhr : Ti.Network.createHTTPClient(),
		db : Titanium.Database.open('mobile')
	};
	function getJobsFromSql() {
		var query = app.db.execute('SELECT ControlNumber, CompanyNumber from jobs ;'), cache = []
		if (query.rowCount > 0) {
			while (query.isValidRow()) {
				cache.push({
					controlNumber : query.fieldByName('ControlNumber'),
					companyNumber : query.fieldByName('CompanyNumber')
				});
				query.next();
			}

		}
		query.close();
		//app.db.close();
		return cache;
	}

	function getUserDataFromSql() {
		//var db = Titanium.Database.open('mobile');
		var selectFromUser = app.db.execute('select * from user');
		var _data = {};
		if (selectFromUser.rowCount > 0) {
			Ti.API.info('@@@ SQL DEBUG @@@ Rows Detected In User Table');
			_data.loggedIn = true;
			_data.username = selectFromUser.fieldByName('username');
			_data.password = selectFromUser.fieldByName('password');
			_data.longitude = selectFromUser.fieldByName('longitude');
			_data.latitude = selectFromUser.fieldByName('latitude');
			_data.location = selectFromUser.fieldByName('location');
			_data.available = selectFromUser.fieldByName('available');
		} else {
			Ti.API.info('@@@ SQL DEBUG @@@ No Rows In User Table');
			_data.loggedIn = false;
		}
		selectFromUser.close();
		selectFromUser = null;
		//db.close();
		//db = null;
		Ti.API.warn('IN DELETE : ' + JSON.stringify(_data));
		return _data;
	}

	function networkCall() {
		var x = app.xhr, _data = getUserDataFromSql();
		//Object to pass to server
		var _obj = {
			"deleteJobs" : {
				"loginParams" : {
					"username" : Ti.App.username,
					"password" : _data.password,
					"longitude" : _data.longitude,
					"latitude" : _data.latitude,
					"city" : _data.location,
					"idpSignature" : null,
					"available" : "true",
					"version" : Ti.App.version
				},
				jobIdArray : getJobsFromSql()
			}
		};

		x.setTimeout(60000);

		x.onload = function() {
			var response = this.responseText;
			Ti.API.info('@@@ XHR DEBUG @@@ json FROM DeleteService : ' + this.responseText);
			var json = JSON.parse(response);
			try {
				handleTheResponseText(json.d.removeJobIdArray);
			} catch(err) {
				Ti.API.error(err);
			}

		};
		x.onerror = function(e) {
			Ti.API.info('@@@ XHR ERROR @@@ : ' + e.error);
			app.db.close();

			//	alert('A network error occured, please confirm you have data available to your mobile device. You may also connect to wifi.')
			return false;
		};
		Ti.API.info('@@@ XHR DEBUG @@@ json TO DeleteService : ' + JSON.stringify(_obj));
		x.open("POST", "http://services.agentgrid.net/mobile/MobileService.svc/GetJobIDsToBeDeletedForIdp");
		x.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

		x.send(JSON.stringify(_obj));
		//x.send(JSON.stringify(_obj));
		return;
	}

	function handleTheResponseText(_obj) {
		if (_obj.length > 0) {
			for (var i = _obj.length - 1; i >= 0; i--) {
				app.db.execute('delete from jobs where ControlNumber = "' + _obj[i].controlNumber + '" and  CompanyNumber = "' + _obj[i].companyNumber + '";');
				//_obj.remove[i].ControlNumber, _obj.remove[i].CompanyNumber
			};
			app.db.close();
		} else {
			app.db.close();
			return;
		}
	}

	if (Ti.App.username) {

		networkCall();
	}else{
		app.db.close();
	}
	return;
}

module.exports = DeleteService;
