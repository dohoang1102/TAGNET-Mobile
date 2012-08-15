var AUDIT = (function() {
	Ti.API.warn('AUDIT XHR FUNCTION FIRED');

	var xhr = Ti.Network.createHTTPClient();

	xhr.setTimeout(20000);
	
	xhr.open("POST", "http://ftp.agentgrid.net:3000/");
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onload = function() {
		Ti.API.info('@@@ XHR DEBUG @@@ response : ' + this.responseText);
		xhr = null;
		return;
	}
	xhr.onerror = function(e) {
		Ti.API.info('@@@ XHR ERROR @@@ : ' + e.error);
		return;
	}
	var debug = Titanium.Database.open('debug');
	var getAuditData = debug.execute('select * from  auditLog;');
	var theArray = [];
	//var _theobj;
	if (getAuditData.rowCount > 0) {
		while (getAuditData.isValidRow()) {
			////_data[i].user _data[i].data _data[i].method _data[i].client_datetime
			theArray.push({
				user : getAuditData.fieldByName('user'),
				data : getAuditData.fieldByName('data'),
				method : getAuditData.fieldByName('location'),
				client_datetime : getAuditData.fieldByName('time'),

			});

			getAuditData.next();
		}
	}
	getAuditData.close();
	debug.close();
	var user = {
		user : 'test'
	};

	Ti.API.warn(user);
	xhr.send(JSON.stringify(user));
	return;
	//(user, time, data, location) values(?, ?, ?, ?)', Ti.App.username, new Date(), json, 'REPLY GetNewDataForIdp Service');
	//debug.execute('CREATE TABLE IF NOT EXISTS errorLog(id integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, user, time, error, location, age INTEGER)');
	//debug.execute('CREATE TABLE IF NOT EXISTS auditLog(id integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, user, time, data, location, age INTEGER)');

})();
module.exports = AUDIT;
