var SYNC = function() {
	Ti.API.warn('Fired Sync Service : ' + Ti.App.username);
	function fixTime(t) {
		if (t < 10) {
			t = "0" + t;
		}
		return t;
	}

	function removeSpace(str) {
		var newString;
		newString = str.replace(/\s/g, '');
		return newString;
	}

	function sanatize_timestamp(timestamp) {
		//16-04-2012 11:55:00 PM
		var newTimestamp;
		this.date = timestamp.split(" ", 1);
		this.date = this.date.toString();
		this.date = this.date.split("-");
		this.date = this.date[1] + '/' + this.date[0] + '/' + this.date[2];

		this.time = timestamp.split(" ", 2);
		this.time = this.time[1];
		this.time = this.time.toString();
		this.amorpm = timestamp.split(" ", 3);
		this.amorpm = this.amorpm[2];
		newTimestamp = this.date + ' ' + this.time + ' '+ this.amorpm;
		//Ti.API.warn('Line 30 | Sync.js | newTimeStamp = '+ newTimestamp);
		return newTimestamp;
	}

	var TODAY = new Date();
	var serviceObject = {
		hr : fixTime(TODAY.getHours()),
		min : fixTime(TODAY.getMinutes()),
		sec : fixTime(TODAY.getSeconds()),
		dd : fixTime(TODAY.getDate()),
		mm : fixTime(TODAY.getMonth() + 1),
		yy : TODAY.getFullYear()
	};

	var app = {};
	app.FireHttp = function() {

		if (Titanium.Network.online) {
			var xhr = app.network();
			var sql = app.db();
			var getUserData = sql.loggedInCheck();
			var _data = {
				username : getUserData.username,
				password : getUserData.password,
				longitude : getUserData.longitude,
				latitude : getUserData.latitude,
				idpSignature : null,
				available : Ti.App.track,
				version : Ti.App.version,
				city : getUserData.location

			};
			if (Ti.App.loggedIn === true) {

				xhr.loginToServer(_data);
			}

		}
		xhr = null;
		sql = null;
	}
	app.FireTheUpdates = function() {
		var db = Titanium.Database.open('mobile'), getTheUpdateIds, theUpdateIds = [], updatePODArray = [], jobMessageArray = [];
		getTheUpdateIds = db.execute('select * from updateEngine;');
		if (getTheUpdateIds.rowCount > 0) {
			while (getTheUpdateIds.isValidRow()) {
				theUpdateIds.push({
					tagJobId : getTheUpdateIds.fieldByName("updateId"),
					type : getTheUpdateIds.fieldByName("type")
				});
				getTheUpdateIds.next();
			}
			//(updateId, type)
			Ti.API.warn('getTheUpdateIds : ' + JSON.stringify(theUpdateIds));
		}
		getTheUpdateIds.close();
		function pod(id) {
			var _id = id, _data = {}, isSlaves = false, slaveArray = [], getCustomerNumber, getFormType2, getFormType3, getFormType4, getFormType5, formType2FieldArray = [], formType3Array = [], formType4FieldArray = [], formType5FieldArray = [];
			var getDataForUpdate = db.execute('select * from updatePODArray where tagJobId = "' + _id + '";');
			_data.puComplete = getDataForUpdate.fieldByName('puComplete');
			_data.dlComplete = getDataForUpdate.fieldByName('dlComplete');
			_data.tagJobId = getDataForUpdate.fieldByName('tagJobId');
			_data.companyNumber = parseInt(getDataForUpdate.fieldByName('companyNumber'));
			_data.controlNumber = parseInt(getDataForUpdate.fieldByName('controlNumber'));
			//_data.weight = getDataForUpdate.fieldByName('weight');
			_data.dlRefuse = getDataForUpdate.fieldByName('dlRefuse');
			_data.puRefuse = getDataForUpdate.fieldByName('puRefuse');
			_data.pieces = parseInt((getDataForUpdate.fieldByName('pieces') === null ? 1 : getDataForUpdate.fieldByName('pieces')));
			//(getFormType2.fieldByName('response') === 'N/A' ? null : getFormType2.fieldByName('response'))
			//_data.formsComplete =
			var formscomplete = getDataForUpdate.fieldByName('formsComplete');
			if (_data.dlComplete === 'true') {
				_data.dlWaitTime = '0';
				_data.dlActualArriveDateTime = getDataForUpdate.fieldByName('dlActualArriveDateTime');
				_data.dlActualDepartDateTime = getDataForUpdate.fieldByName('dlActualDepartDateTime');
				_data.dlPODFullName = getDataForUpdate.fieldByName('dlPODFullName');
				_data.dlSignatureBase64 = getDataForUpdate.fieldByName('dlSignatureBase64');
				_data.dlInitialBase64 = getDataForUpdate.fieldByName('dlCustomerInitials') || "";
				_data.dlEntered = getDataForUpdate.fieldByName('dlEntered');
				_data.dlEmail = getDataForUpdate.fieldByName('dlEmail');

			} else {
				_data.puWaitTime = '0';
				_data.puActcualArriveDateTime = getDataForUpdate.fieldByName('puActualArriveDateTime');
				_data.puPODFullName = getDataForUpdate.fieldByName('puPODFullName');
				_data.puSignatureBase64 = getDataForUpdate.fieldByName('puSignatureBase64');
				_data.puInitialBase64 = getDataForUpdate.fieldByName('puCustomerInitials') || "";
				_data.puActcualDepartDateTime = getDataForUpdate.fieldByName('puActualDepartDateTime');
				_data.puEntered = getDataForUpdate.fieldByName('puEntered');
				_data.puEmail = getDataForUpdate.fieldByName('puEmail');
			}
			getTheUpdateIds.close();
			getCustomerNumber = db.execute('select * from jobs where controlNumber = "' + _data.controlNumber + '";');
			theCustomerNumber = getCustomerNumber.fieldByName('customerNumber');
			var formCheckQuery, results = {}, form2 = false, form3 = false, form4 = false, form5 = false;

			getCustomerNumber.close();
			formCheckQuery = db.execute('select * from customers where customerNumber = ' + parseInt(theCustomerNumber) + ' and companyNumber = ' + parseInt(_data.companyNumber) + ';');
			if (formCheckQuery.rowCount > 0) {
				while (formCheckQuery.isValidRow()) {
					if (parseInt(formCheckQuery.fieldByName('formId')) === 2) {
						form2 = true;
						_data.formsComplete = formscomplete;
					}
					if (parseInt(formCheckQuery.fieldByName('formId')) === 3) {
						form3 = true;
						_data.formsComplete = formscomplete;
					}
					if (parseInt(formCheckQuery.fieldByName('formId')) === 4) {
						form4 = true;
						_data.formsComplete = formscomplete;
					}
					if (parseInt(formCheckQuery.fieldByName('formId')) === 5) {
						form5 = true;
						_data.formsComplete = formscomplete;
					}

					formCheckQuery.next();
				}
			}
			formCheckQuery.close();
			Ti.API.info('@@@ DEBUG @@@ form2 : ' + form2 + ' form3 : ' + form3 + ' form4 : ' + form4 + ' form5 : ' + form5);
			if (form2 === true && _data.dlComplete === 'true') {
				getFormType2 = db.execute('select * from formType2 where tagJobId = "' + _id + '";');
				if (getFormType2.rowCount > 0) {
					formType2FieldArray.push({
						"fieldId" : 1,
						"response" : _data.dlActualArriveDateTime
					});
					formType2FieldArray.push({
						"fieldId" : 2,
						"response" : _data.dlActualDepartDateTime
					});
					while (getFormType2.isValidRow()) {

						formType2FieldArray.push({
							"fieldId" : getFormType2.fieldByName('fieldId'),
							"response" : (getFormType2.fieldByName('response') === 'N/A' ? null : getFormType2.fieldByName('response'))
						});

						getFormType2.next();
					}
				}
				getFormType2.close();
			}
			if (form3 === true && _data.puComplete === 'true') {
				getFormType3 = db.execute('select * from formType3Array where tagJobId = "' + _id + '";');
				if (getFormType3.rowCount > 0) {

					while (getFormType3.isValidRow()) {

						formType3Array.push({
							"article" : getFormType3.fieldByName('article'),
							"conditionReceived" : getFormType3.fieldByName('conditionReceived'),
							"conditionDelivered" : getFormType3.fieldByName('conditionDelivered'),
							"additionalNote" : getFormType3.fieldByName('additionalNote'),
						});

						getFormType3.next();
					}
				}
				getFormType3.close();
			}
			if (form4 === true && _data.dlComplete === 'true') {
				getFormType4 = db.execute('select * from formType4 where tagJobId = "' + _id + '";');
				if (getFormType4.rowCount > 0) {
					formType4FieldArray.push({
						"fieldId" : 1,
						"response" : _data.dlActualArriveDateTime
					});
					formType4FieldArray.push({
						"fieldId" : 2,
						"response" : _data.dlActualDepartDateTime
					});
					while (getFormType4.isValidRow()) {

						formType4FieldArray.push({
							"fieldId" : getFormType4.fieldByName('fieldId'),
							"response" : (getFormType4.fieldByName('response') === 'N/A' ? null : getFormType4.fieldByName('response'))
						});

						getFormType4.next();
					}
				}
				getFormType4.close();
			}
			if (form5 === true && _data.dlComplete === 'true') {
				getFormType5 = db.execute('select * from formType5 where tagJobId = "' + _id + '";');
				if (getFormType5.rowCount > 0) {
					while (getFormType5.isValidRow()) {
						//Ti.API.info('TAG JOB ID , "fieldId", "response" : ' + tagJobId + ", " + form5Query.fieldByName('itemId') + ', ' + (form5Query.fieldByName('response') === 'N/A' ? null : form5Query.fieldByName('response')));
						if (getFormType5.fieldByName('details') === null) {
							formType5FieldArray.push({
								"itemId" : (getFormType5.fieldByName('itemId').toUpperCase()),
								"isRefuse" : getFormType5.fieldByName('repsonseToAcceptBool')
							});
						} else {
							formType5FieldArray.push({
								"itemId" : (getFormType5.fieldByName('itemId').toUpperCase()),
								"isRefuse" : getFormType5.fieldByName('repsonseToAcceptBool'),
								"refuseReason" : getFormType5.fieldByName('details'),
								"quantity" : getFormType5.fieldByName('quantity')
							});
						}
						Ti.API.info('@@@@@ DEBUG @@@@@ itemId: ' + (getFormType5.fieldByName('itemId').toUpperCase()))

						getFormType5.next();
					}
				}
				getFormType5.close();
			}

			Ti.API.info('@@@ DEBUG @@@ SYNC UPDATE formType2FieldArray.length : ' + formType2FieldArray.length + " formType3Array.length : " + formType3Array.length + " formType4FieldArray.length : " + formType4FieldArray.length + " formType5FieldArray.length : " + formType5FieldArray.length);
			if (formType2FieldArray.length > 0) {
				_data.podFormObj = _data.podFormObj || {};
				_data.podFormObj.formType2 = {};
				_data.podFormObj.formType2.formType2FieldArray = formType2FieldArray;
			}
			if (formType3Array.length > 0) {
				_data.podFormObj = _data.podFormObj || {};
				_data.podFormObj.formType3Array = formType3Array;
			}
			if (formType4FieldArray.length > 0) {
				_data.podFormObj = _data.podFormObj || {};
				_data.podFormObj.formType4 = {};
				_data.podFormObj.formType4.formType4FieldArray = formType4FieldArray;
			}
			if (formType5FieldArray.length > 0) {
				_data.podFormObj = _data.podFormObj || {};
				_data.podFormObj.formType5 = {};
				_data.podFormObj.formType5.formType5ItemArray = formType5FieldArray;
			}
			Ti.API.info('@@@ DEBUG @@@ SYNC UPDATE : ' + JSON.stringify(_data));
			updatePODArray.push(_data);
			var getSlaveJobs = db.execute('select * from slaveTags where masterTagJobId = "' + _id + '";');
			if (getSlaveJobs.rowCount > 0) {
				isSlaves = true;
				while (getSlaveJobs.isValidRow()) {
					slaveArray.push({
						slaveTagJobId : getSlaveJobs.fieldByName('slaveTagJobId'),
						companyNumber : getSlaveJobs.fieldByName('companyNumber'),
						controlNumber : getSlaveJobs.fieldByName('controlNumber'),
						items : getSlaveJobs.fieldByName('items'),
						weight : getSlaveJobs.fieldByName('weight')
					});
					getSlaveJobs.next();
				}
			}
			getSlaveJobs.close();
			if (slaveArray.length > 0) {
				for (var i = slaveArray.length - 1; i >= 0; i--) {
					buildSlave(_data, slaveArray[i]);
				};
			}
			//db.execute('CREATE TABLE IF NOT EXISTS slaveTags (slaveTagJobId PRIMARY KEY NOT NULL UNIQUE, masterTagJobId, companyNumber, controlNumber UNIQUE, items, weight)');
			//db.execute('CREATE TABLE IF NOT EXISTS updatePODArray (id integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, tagJobId, companyNumber, controlNumber, puComplete, dlComplete, dlRefuse, dlRefusalReason, dlActualArriveDateTime, dlActualDepartDateTime, dlPODFullName, dlSignatureBase64, dlWaitTime, puRefuse, puRefusalReason, puActualArriveDateTime, puActualDepartDateTime, puPODFullName, puSignatureBase64, weight, pieces, formsComplete, puEmail, dlEmail, puCustomerInitials, dlCustomerInitials, puEntered, dlEntered)');
		}

		function schedule(id) {
			var _id = id, getJobMessageArray;
			getJobMessageArray = db.execute('select * from jobMessageArray where tagJobId = "' + _id + '";');
			if (getJobMessageArray.rowCount > 0) {
				while (getJobMessageArray.isValidRow()) {
					jobMessageArray.push({
						"companyNumber" : parseInt(getJobMessageArray.fieldByName('companyNumber') || 1),
						"controlNumber" : parseInt(getJobMessageArray.fieldByName('controlNumber')),
						"tagJobId" : _id,
						"type" : 'message',
						"puEstimateDateTime" : getJobMessageArray.fieldByName('puEstimateDateTime'),
						"dlEstimateDateTime" : getJobMessageArray.fieldByName('dlEstimateDateTime'),
						"dlEstimateEntered" : getJobMessageArray.fieldByName('dlEstimateEntered'),
						"puEstimateEntered" : getJobMessageArray.fieldByName('puEstimateEntered')
					});
					getJobMessageArray.next();
				}
			}
			getJobMessageArray.close();
		}

		function message(id) {
			var _id = id, getJobMessageArray;
			getJobMessageArray = db.execute('select * from jobMessageArray where alertId = "' + _id + '";');
			if (getJobMessageArray.rowCount > 0) {
				while (getJobMessageArray.isValidRow()) {
					jobMessageArray.push({
						"id" : _id,
						"companyNumber" : parseInt(getJobMessageArray.fieldByName('companyNumber') || 1),
						"controlNumber" : parseInt(getJobMessageArray.fieldByName('controlNumber')),
						"tagJobId" : _id,
						"type" : 'response',
						"messageText" : getJobMessageArray.fieldByName('messageText'),
						"enteredDateTime" : getJobMessageArray.fieldByName('enteredDateTime'),
						"responseBoolean" : getJobMessageArray.fieldByName('responseBoolean'),
						"responseText" : getJobMessageArray.fieldByName('responseBoolean'),
						"responseDateTime" : getJobMessageArray.fieldByName('responseDateTime')
					});
					getJobMessageArray.next();
				}
			}
			getJobMessageArray.close();
		}

		function decline(id) {
			var _id = id, getJobMessageArray;
			getJobMessageArray = db.execute('select * from jobMessageArray where tagJobId = "' + _id + '";');
			if (getJobMessageArray.rowCount > 0) {
				while (getJobMessageArray.isValidRow()) {
					jobMessageArray.push({
						"companyNumber" : parseInt(getJobMessageArray.fieldByName('companyNumber') || 1),
						"controlNumber" : parseInt(getJobMessageArray.fieldByName('controlNumber')),
						"tagJobId" : _id,
						"type" : 'decline',
						'enteredDateTime' : getJobMessageArray.fieldByName('enteredDateTime')
					});
					getJobMessageArray.next();
				}
			}
			getJobMessageArray.close();
		}

		function buildSlave(data, slaveData) {
			var _data = data, _slaveData = slaveData, newObj = {};
			//Ti.API.info('@@@ DEBUG buildSlave @@@ _slaveData : '+ JSON.stringify(_slaveData));
			//Ti.API.info('@@@ DEBUG buildSlave @@@ _data : '+ JSON.stringify(_data));
			//_data.companyNumber = _slaveData.companyNumber;
			//_data.controlNumber = _slaveData.controlNumber;
			//_data.tagJobId = _slaveData.slaveTagJobId;
			//_data.weight = _slaveData.weight;
			//_data.pieces = _slaveData.items;
			//newObj = _data.;
			newObj = JSON.parse(JSON.stringify(_data));
			newObj.companyNumber = _slaveData.companyNumber;
			newObj.controlNumber = _slaveData.controlNumber;
			newObj.tagJobId = _slaveData.slaveTagJobId;
			//newObj.weight = _slaveData.weight;
			newObj.pieces = (_slaveData.items === null ? 1 : _slaveData.items);

			Ti.API.info('@@@ DEBUG buildSlave @@@ newObj after merge : ' + JSON.stringify(newObj));
			updatePODArray.push(newObj);
		}

		var i = theUpdateIds.length - 1;
		for (i; i >= 0; i--) {
			Ti.API.warn(theUpdateIds[i].type);
			switch(theUpdateIds[i].type) {
				case 'schedule':
					schedule(theUpdateIds[i].tagJobId);
					break;
				case 'message':
					message(theUpdateIds[i].tagJobId);
					break;
				case 'updatePODArray':
					pod(theUpdateIds[i].tagJobId);
					break;
				case 'decline':
					decline(theUpdateIds[i].tagJobId);
					break;
			};
			//theUpdateIds[i].type
			//theUpdateIds[i].tagJobId
		};
		//Ti.API.info('@@@ DEBUG @@@ SYNC UPDATE : ' + JSON.stringify(theUpdateIds));
		//Ti.API.info('@@@ DEBUG @@@ SYNC updatePODArray : ' + JSON.stringify(updatePODArray));
		//Ti.API.info('@@@ DEBUG @@@ SYNC jobMessageArray : ' + JSON.stringify(jobMessageArray));
		db.close();
		//db = null;
		if (jobMessageArray.length > 0) {

			app.sendUpdate(jobMessageArray, theUpdateIds);
			Ti.API.warn(JSON.stringify(jobMessageArray));
		}
		if (updatePODArray.length > 0) {

			var u = 0;
			for (u; u < updatePODArray.length; u++) {
				app.sendPOD(updatePODArray[u]);
			}
		}

	}
	app.sendUpdate = function(jobMessageArray, theUpdateIds) {

		if (Titanium.Network.online) {
			var xhr = app.network();
			var sql = app.db();
			var getUserData = sql.loggedInCheck();
			var _data = {
				username : getUserData.username,
				password : getUserData.password,
				longitude : getUserData.longitude,
				latitude : getUserData.latitude,
				idpSignature : null,
				available : Ti.App.track,
				version : Ti.App.version,
				//city : getUserData.location
				city : getUserData.location
			};
			//Ti.API.info('@@@ GLOBALS @@@ : ' + JSON.stringify(_data));
			if (Ti.App.loggedIn === true) {

				xhr.uppdateFromIdp(_data, jobMessageArray, theUpdateIds);
			}

		}
		xhr = null;
		sql = null;
	}
	app.sendPOD = function(updatePODArray) {

		if (Titanium.Network.online) {
			var xhr = app.network();
			var sql = app.db();
			var getUserData = sql.loggedInCheck();
			var _data = {
				username : getUserData.username,
				password : getUserData.password,
				longitude : getUserData.longitude,
				latitude : getUserData.latitude,
				idpSignature : null,
				available : Ti.App.track,
				version : Ti.App.version,
				//city : getUserData.location
				city : getUserData.location
			};
			//Ti.API.info('@@@ GLOBALS @@@ : ' + JSON.stringify(_data));
			if (Ti.App.loggedIn === true) {

				xhr.enterPOD(_data, updatePODArray);
			}

		}
		xhr = null;
		sql = null;
	}
	app.network = function() {
		var xhr = Ti.Network.createHTTPClient();
		this.loginToServer = function(data) {
			var thatData = data;
			//xhr.open('GET','http://twitter.com/statuses/show/123.xml');
			Ti.API.info('@@@ XHR DEBUG @@@ loginToServer FIRED');
			var loginData = {
				"loginParams" : {
					username : data.username,
					password : data.password,
					longitude : data.longitude,
					latitude : data.latitude,
					city : data.city,
					idpSignature : data.idpSignature,
					available : data.available,
					version : data.version
				}
			};

			xhr.setTimeout(60000);

			xhr.onload = function() {
				var json = this.responseText;
				Ti.API.warn('GETNEWJOBS JSON : ' + json);
				var response = JSON.parse(json);
				var debug = Titanium.Database.open('debug');
				debug.execute('insert into auditLog(user, time, data, location) values(?, ?, ?, ?)', Ti.App.username, new Date(), json, 'REPLY GetNewDataForIdp Service');
				//debug.execute('CREATE TABLE IF NOT EXISTS errorLog(id integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, user, time, error, location, age INTEGER)');
				//debug.execute('CREATE TABLE IF NOT EXISTS auditLog(id integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, user, time, data, location, age INTEGER)');
				debug.close();
				//Ti.API.info('@@@ XHR DEBUG @@@ json in loginToServer : ' + json);
				if (response === null || response.d.auth === null) {
					xhr = null;
					delete loginData;
					json = null;
					this.responseText = null;
					delete response;
					response = null;
					app.FireTheUpdates();
					var toast = Ti.UI.createNotification({
						message : "TAGNET : Mobile service error, reponse was NULL",
						duration : Ti.UI.NOTIFICATION_DURATION_SHORT
					});
					toast.show();
					return xhr = null;
				}
				if (response.d.auth.authPass === false) {
					//alert('Username or Password Incorrect.\n\nA typical username would be firstnameIDPNUMBER, ex: daniel6122.\n\nA typical password would be DRIVERNUMBER, ex: 6122.\n\nIf you continue to have issues, please confirm your TAGNET username / password with your local TAG contact.')
					delete loginData;
					json = null;
					this.responseText = null;
					delete response;
					response = null;
					app.FireTheUpdates();
					var toast = Ti.UI.createNotification({
						message : "TAGNET : Authorization error, check username and password.",
						duration : Ti.UI.NOTIFICATION_DURATION_SHORT
					});
					toast.show();
					return xhr = null;
				}
				if (response.d.auth.authPass === true) {

					var sql = app.db();
					sql.saveTheResponseData(response);
					xhr = null;
					sql = null
					delete loginData;
					json = null;
					this.responseText = null;
					delete response;
					response = null;
					app.FireTheUpdates();
					var toast = Ti.UI.createNotification({
						message : "TAGNET : Download Sync Complete",
						duration : Ti.UI.NOTIFICATION_DURATION_SHORT
					});
					toast.show();
					return;
				}
				try {
					delete loginData;
					json = null;
					this.responseText = null;
					delete response;
					response = null;
				} catch(err) {

				}
				xhr = null;
				app.FireTheUpdates();
			}
			xhr.onerror = function(e) {
				Ti.API.info('@@@ XHR ERROR @@@ : ' + e.error);
				var toast = Ti.UI.createNotification({
					message : "TAGNET : Network Error : " + e.error + ". Make sure you have data",
					duration : Ti.UI.NOTIFICATION_DURATION_SHORT
				});
				toast.show();
				app.FireTheUpdates();
				//alert('A network error occured, please confirm you have data available to your mobile device. You may also connect to wifi.')
				xhr = null;
				return false;
			}
			xhr.open("POST", "http://services.agentgrid.net/mobile/MobileService.svc/GetNewDataForIdp");
			xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
			xhr.send(JSON.stringify(loginData));
			var debug = Titanium.Database.open('debug');
			debug.execute('insert into auditLog(user, time, data, location) values(?, ?, ?, ?)', Ti.App.username, new Date(), JSON.stringify(loginData), 'POST GetNewDataForIdp Service');
			//debug.execute('CREATE TABLE IF NOT EXISTS errorLog(id integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, user, time, error, location, age INTEGER)');
			//debug.execute('CREATE TABLE IF NOT EXISTS auditLog(id integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, user, time, data, location, age INTEGER)');
			debug.close();
		}
		this.uppdateFromIdp = function(data, jobMessageArray, theUpdateIds) {
			var thatData = data;
			//xhr.open('GET','http://twitter.com/statuses/show/123.xml');
			Ti.API.warn('Update XHR Fired.');
			var loginData = {
				"updateObj" : {
					"loginParams" : {
						username : data.username,
						password : data.password,
						longitude : data.longitude,
						latitude : data.latitude,
						city : data.city,
						idpSignature : null,
						available : data.available,
						version : data.version
					},
					driverGeneralMessageObj : {},
					jobMessageArray : jobMessageArray,
					updatePODArray : []
				}
			};
			//'username' : serviceObject.username,
			//		'password' : serviceObject.password,
			//		'longitude' : serviceObject.idpLong,
			//		'latitude' : serviceObject.idpLat,
			//		'city' : serviceObject.idpLocation,
			//		'available' : serviceObject.available,
			//		'idpSignature' : null,
			//		"version" : serviceObject.version
			xhr.setTimeout(60000);

			xhr.onload = function() {
				var json = this.responseText;
				var debug = Titanium.Database.open('debug');
				debug.execute('insert into auditLog(user, time, data, location) values(?, ?, ?, ?)', Ti.App.username, new Date(), json, 'REPLY UpdateFromIdp Service');
				//debug.execute('CREATE TABLE IF NOT EXISTS errorLog(id integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, user, time, error, location, age INTEGER)');
				//debug.execute('CREATE TABLE IF NOT EXISTS auditLog(id integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, user, time, data, location, age INTEGER)');
				debug.close();
				var response = JSON.parse(json);
				Ti.API.info('@@@ XHR DEBUG @@@ json response in updateToServer : ' + json);
				if (response === null || response.d.auth === null) {
					jobMessageArray = null;
					//updatePODArray = null;
					delete loginData;
					loginData = null;
					json = null;
					this.reponseText = null;
					delete response;
					response = null;
					//gc();
					var toast = Ti.UI.createNotification({
						message : "TAGNET : Mobile service error, reponse was NULL",
						duration : Ti.UI.NOTIFICATION_DURATION_SHORT
					});
					toast.show();
					return xhr = null;
				}
				if (response.d.authPass === false) {
					//alert('Username or Password Incorrect.\n\nA typical username would be firstnameIDPNUMBER, ex: daniel6122.\n\nA typical password would be DRIVERNUMBER, ex: 6122.\n\nIf you continue to have issues, please confirm your TAGNET username / password with your local TAG contact.')
					jobMessageArray = null;
					//	updatePODArray = null;
					delete loginData;
					loginData = null;
					json = null;
					this.reponseText = null;
					delete response;
					response = null;
					//gc();
					var toast = Ti.UI.createNotification({
						message : "TAGNET : Authorization error, check username and password.",
						duration : Ti.UI.NOTIFICATION_DURATION_SHORT
					});
					toast.show();
					return xhr = null;
				}
				if (response.d.authPass === true || response.d.authPass === 'true') {
					//Delete the updates
					xhr = null;
					var db = Titanium.Database.open('mobile');
					var i = 0;
					try {

						for (i; i < theUpdateIds.length; i++) {

							db.execute('DELETE from updateEngine where updateId = "' + theUpdateIds[i].tagJobId + '" ;');
						}
					} catch(err) {

					}
					db.execute('DELETE from jobMessageArray;');
					db.close();
					db = null;
					jobMessageArray = null;
					//updatePODArray = null;
					theUpdateIds = null;
					delete loginData;
					loginData = null;
					json = null;
					this.reponseText = null;
					delete response;
					response = null;
					//sql = null
					//gc();
					return;
				}
				if (response.d.authPass === true && response.d.errorMsg !== null) {
					//handle the error
					jobMessageArray = null;
					//updatePODArray = null;
					delete loginData;
					loginData = null;
					json = null;
					this.reponseText = null;
					delete response;
					response = null;
					xhr = null;
					//sql = null
					//gc();
					var toast = Ti.UI.createNotification({
						message : "TAGNET : Error : " + response.d.errorMsg,
						duration : Ti.UI.NOTIFICATION_DURATION_SHORT
					});
					toast.show();
					return;
				}

				try {
					jobMessageArray = null;
					//updatePODArray = null;
					delete loginData;
					loginData = null;
					json = null;
					this.reponseText = null;
					delete response;
					response = null;
				} catch(err) {

				}
				//gc();
				xhr = null;
			}
			xhr.onerror = function(e) {
				Ti.API.info('@@@ XHR ERROR @@@ : ' + e.error);
				var toast = Ti.UI.createNotification({
					message : "TAGNET : Network Error : " + e.error + ". Make sure you have data",
					duration : Ti.UI.NOTIFICATION_DURATION_SHORT
				});
				toast.show();
				//alert('A network error occured, please confirm you have data available to your mobile device. You may also connect to wifi.')
				xhr = null;
				//gc();
				return false;
			}
			Ti.API.info('@@@ NETWORK UPDATE DEBUG @@@ : JSON.stringify(loginData) : ' + JSON.stringify(loginData))
			xhr.open("POST", "http://services.agentgrid.net/mobile/MobileService.svc/UpdateFromIdp");
			xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
			xhr.send(JSON.stringify(loginData));
			var debug = Titanium.Database.open('debug');
			debug.execute('insert into auditLog(user, time, data, location) values(?, ?, ?, ?)', Ti.App.username, new Date(), JSON.stringify(loginData), 'POST UpdateFromIdp Service');
			//debug.execute('CREATE TABLE IF NOT EXISTS errorLog(id integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, user, time, error, location, age INTEGER)');
			//debug.execute('CREATE TABLE IF NOT EXISTS auditLog(id integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, user, time, data, location, age INTEGER)');
			debug.close();

		}
		this.enterPOD = function(data, updatePODArray) {
			var thatData = data;
			//xhr.open('GET','http://twitter.com/statuses/show/123.xml');
			Ti.API.warn('enterPOD XHR Fired.');
			var loginData = {
				"updateObj" : {
					"loginParams" : {
						username : data.username,
						password : data.password,
						longitude : data.longitude,
						latitude : data.latitude,
						city : data.city,
						idpSignature : null,
						available : data.available,
						version : data.version
					},
					driverGeneralMessageObj : {},
					jobMessageArray : [],
					updatePODArray : [updatePODArray]
				}
			};
			//'username' : serviceObject.username,
			//		'password' : serviceObject.password,
			//		'longitude' : serviceObject.idpLong,
			//		'latitude' : serviceObject.idpLat,
			//		'city' : serviceObject.idpLocation,
			//		'available' : serviceObject.available,
			//		'idpSignature' : null,
			//		"version" : serviceObject.version
			xhr.setTimeout(60000);

			xhr.onload = function() {
				var json = this.responseText;
				var response = JSON.parse(json);
				var debug = Titanium.Database.open('debug');
				debug.execute('insert into auditLog(user, time, data, location) values(?, ?, ?, ?)', Ti.App.username, new Date(), json, 'REPLY UpdateFromIdp Service');
				//debug.execute('CREATE TABLE IF NOT EXISTS errorLog(id integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, user, time, error, location, age INTEGER)');
				//debug.execute('CREATE TABLE IF NOT EXISTS auditLog(id integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, user, time, data, location, age INTEGER)');
				debug.close();
				Ti.API.info('@@@ XHR DEBUG @@@ json response in updateToServer : ' + json);
				if (response === null || response.d.auth === null) {
					//jobMessageArray = null;
					updatePODArray = null;
					delete loginData;
					loginData = null;
					json = null;
					this.reponseText = null;
					delete response;
					response = null;
					//gc();
					var toast = Ti.UI.createNotification({
						message : "TAGNET : Error : reponse was NULL",
						duration : Ti.UI.NOTIFICATION_DURATION_SHORT
					});
					toast.show();
					return xhr = null;
				}
				if (response.d.authPass === false) {
					//alert('Username or Password Incorrect.\n\nA typical username would be firstnameIDPNUMBER, ex: daniel6122.\n\nA typical password would be DRIVERNUMBER, ex: 6122.\n\nIf you continue to have issues, please confirm your TAGNET username / password with your local TAG contact.')
					//jobMessageArray = null;
					updatePODArray = null;
					delete loginData;
					loginData = null;
					json = null;
					this.reponseText = null;
					delete response;
					response = null;
					//gc();
					var toast = Ti.UI.createNotification({
						message : "TAGNET : Authorization Error, please check username and password.",
						duration : Ti.UI.NOTIFICATION_DURATION_SHORT
					});
					toast.show();
					return xhr = null;
				}
				if (response.d.authPass === true && response.d.errorMsg === null) {
					//Delete the updates
					xhr = null;

					db = null;
					//jobMessageArray = null;
					updatePODArray = null;
					//theUpdateIds = null;
					delete loginData;
					loginData = null;
					json = null;
					this.reponseText = null;
					var db = Titanium.Database.open('mobile');

					db.execute('DELETE from updateEngine where type = "updatePODArray" ;');

					db.close();

					var toast = Ti.UI.createNotification({
						message : "TAGNET : Update Sync Complete",
						duration : Ti.UI.NOTIFICATION_DURATION_SHORT
					});
					toast.show();
					db = null;
					delete response;
					response = null;
					//sql = null
					//gc();
					return;
				}
				if (response.d.authPass === true && response.d.errorMsg !== null) {
					//handle the error
					//jobMessageArray = null;
					updatePODArray = null;
					delete loginData;
					loginData = null;
					json = null;
					this.reponseText = null;
					delete response;
					response = null;
					xhr = null;
					//sql = null
					//gc();
					var toast = Ti.UI.createNotification({
						message : "TAGNET : Error : " + response.d.errorMsg,
						duration : Ti.UI.NOTIFICATION_DURATION_SHORT
					});
					toast.show();
					return;
				}

				try {
					//jobMessageArray = null;
					updatePODArray = null;
					delete loginData;
					loginData = null;
					json = null;
					this.reponseText = null;
					delete response;
					response = null;
				} catch(err) {

				}
				//gc();
				xhr = null;
			}
			xhr.onerror = function(e) {
				Ti.API.info('@@@ XHR ERROR @@@ : ' + e.error);
				var toast = Ti.UI.createNotification({
					message : "TAGNET : Network Error : " + e.error + ". Make sure you have data",
					duration : Ti.UI.NOTIFICATION_DURATION_SHORT
				});
				toast.show();
				//alert('A network error occured, please confirm you have data available to your mobile device. You may also connect to wifi.')
				xhr = null;
				//gc();
				return false;
			}
			Ti.API.info('@@@ NETWORK UPDATE DEBUG @@@ : JSON.stringify(loginData) : ' + JSON.stringify(loginData))
			xhr.open("POST", "http://services.agentgrid.net/mobile/MobileService.svc/UpdateFromIdp");
			xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
			xhr.send(JSON.stringify(loginData));
			var debug = Titanium.Database.open('debug');
			debug.execute('insert into auditLog(user, time, data, location) values(?, ?, ?, ?)', Ti.App.username, new Date(), JSON.stringify(loginData), 'POST UpdateFromIdp Service');
			//debug.execute('CREATE TABLE IF NOT EXISTS errorLog(id integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, user, time, error, location, age INTEGER)');
			//debug.execute('CREATE TABLE IF NOT EXISTS auditLog(id integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, user, time, data, location, age INTEGER)');
			debug.close();
		}
		return this;
	}
	app.db = function() {
		var that = this;
		this.loggedInCheck = function() {
			var GLOBALS = {};
			//db.execute('CREATE TABLE IF NOT EXISTS user (id integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, username UNIQUE, password, longitude, latitude, location, available, idpSignature text)');
			var db = Titanium.Database.open('mobile');
			var selectFromUser = db.execute('select * from user');
			if (selectFromUser.rowCount > 0) {
				Ti.API.info('@@@ SQL DEBUG @@@ Rows Detected In User Table');
				GLOBALS.loggedIn = true;
				GLOBALS.username = selectFromUser.fieldByName('username');
				GLOBALS.password = selectFromUser.fieldByName('password');
				GLOBALS.longitude = selectFromUser.fieldByName('longitude');
				GLOBALS.latitude = selectFromUser.fieldByName('latitude');
				GLOBALS.location = selectFromUser.fieldByName('location');
				GLOBALS.available = selectFromUser.fieldByName('available');
			} else {
				Ti.API.info('@@@ SQL DEBUG @@@ No Rows In User Table');
				GLOBALS.loggedIn = false;
			}
			selectFromUser.close();
			db.close();
			db = null;
			return GLOBALS;
		};

		this.saveTheResponseData = function(data) {
			var _data = data, _newJobs = data.d.newJobArray, _newJobsLength = data.d.newJobArray.length, slaveCheck, _newMessages = data.d.newjobMessageArray, _newMessagesLength = data.d.newjobMessageArray.length;
			var slaveCheck, slaveCustomerCheck, lookForMasterQuery, masterJob, isSlave;
			var db = Titanium.Database.open('mobile');
			db.execute('BEGIN IMMEDIATE');

			if (_newJobsLength > 0) {
				for (var i = _newJobsLength - 1; i >= 0; i--) {
					//Things[i]
					Ti.API.warn('inserting job : ' + i);
					/*
					 *
					 * Slave Job Check
					 *
					 *
					 */
					slaveCheck = false, excCheck = false, isSlave = false, dup = false;

					this.dup = db.execute('select * from jobs where controlNumber = "' + _newJobs[i].controlNumber.toString() + '";');
					if (this.dup.rowCount > 0) {
						dup = true;
						var splitDate = _newJobs[i].puAtReqArriveTime.split(" ", 1);
						//var splitTime = _newJobs[i].puAtReqArriveTime.split(" ", 2);
						//var fixTime = splitTime[1].toString();
						//Ti.API.warn(fixTime);
						var fixDate = splitDate.toString();
						fixDate = fixDate.split("-");
						var sortDate = fixDate[2] + '/' + fixDate[1] + '/' + fixDate[0];
						Ti.API.info('Duplicate Order Detected : ' + _newJobs[i].controlNumber.toString() + '. Replacing Record.')
						db.execute('delete from jobs where controlNumber = "' + _newJobs[i].controlNumber.toString() + '";');
						db.execute('insert or replace into jobs ( id, companyNumber, controlNumber, serviceType,  bol, orderedBy, vehType, puAtReqArriveTime, dlAtReqArriveTime, pieces, weight, puAtName, puAtAddress, puAtRFD, puAtCity, puAtZip, puAtAttn, dlToName, dlToAddress, dlToRFD, dlToCity, dlToZip, dlToAttn, puAtSpecInst, dlToSpecInst, reference, puAtPhone, dlToPhone, pay, customerType, customerNumber, sortDate, username, isAccepted, brand, age)  values ( ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, ?, ?, ?)', _newJobs[i].id, _newJobs[i].companyNumber.toString(), _newJobs[i].controlNumber.toString(), _newJobs[i].serviceType, _newJobs[i].bol, _newJobs[i].orderedBy, _newJobs[i].vehType, sanatize_timestamp(_newJobs[i].puAtReqArriveTime), sanatize_timestamp(_newJobs[i].dlAtReqArriveTime), _newJobs[i].pieces.toString(), _newJobs[i].weight.toString(), _newJobs[i].puAtName, _newJobs[i].puAtAddress, _newJobs[i].puAtRFD, _newJobs[i].puAtCity, _newJobs[i].puAtZip, _newJobs[i].puAtAttn, _newJobs[i].dlToName, _newJobs[i].dlToAddress, _newJobs[i].dlToRFD, _newJobs[i].dlToCity, _newJobs[i].dlToZip, _newJobs[i].dlToAttn, _newJobs[i].puAtSpecInst, _newJobs[i].dlToSpecInst, _newJobs[i].reference, _newJobs[i].puPhone, _newJobs[i].dlPhone, _newJobs[i].pay, _newJobs[i].customerType, parseInt(_newJobs[i].customerNumber), sortDate, Ti.App.username, this.dup.fieldByName('isAccepted'), _newJobs[i].brandNameLong, new Date().valueOf());
						if (_newJobs[i].orderItemArray) {
							saveTheItems(_newJobs[i].orderItemArray, _newJobs[i].orderItemArray.length, _newJobs[i].id, _newJobs[i].id, excCheck, db);
						}

						if (_newJobs[i].driverNoteArray) {
							saveTheNotes(_newJobs[i].driverNoteArray, _newJobs[i].driverNoteArray.length, _newJobs[i].id, db);
						}
						this.dup.close();
					} else {

						if (_newJobs[i].serviceType !== 'EXC') {

							slaveCustomerCheck = db.execute('select * from customerRequirements where customerNumber = ' + _newJobs[i].customerNumber + ' and companyNumber = ' + _newJobs[i].companyNumber + ' and slave = "' + true + '";');
							if (slaveCustomerCheck.rowCount > 0) {
								//Ti.API.info('@@@ SQL DEBUG @@@ slaveCheck = true');
								slaveCheck = true;
							}
							slaveCustomerCheck.close();
							if (slaveCheck === true) {
								Ti.API.info('@@@ SQL DEBUG @@@ slaveCheck = true');

								lookForMasterQuery = db.execute('select * from jobs where bol = "' + _newJobs[i].bol + '" and dlToZip = "' + _newJobs[i].dlToZip + '" and serviceType <> "EXC"and controlNumber <> "' + _newJobs[i].controlNumber.toString() + '";');
								if (lookForMasterQuery.rowCount > 0) {
									isSlave = true;
									//Ti.API.info('@@@ SQL DEBUG @@@ isSlave = true');
									masterJob = lookForMasterQuery.fieldByName('id');
								}
								lookForMasterQuery.close();

							}
						} else {
							excCheck = true;
						}
					}

					if (isSlave === true) {

						Ti.API.info('@@@ SQL DEBUG @@@ SLAVE JOB DETECTED');

						db.execute('insert or replace into slaveTags (slaveTagJobId, masterTagJobId, companyNumber, controlNumber, items, weight, age) values (?, ?, ?, ?, ?, ?, ?)', _newJobs[i].id, masterJob, _newJobs[i].companyNumber.toString(), _newJobs[i].controlNumber.toString(), _newJobs[i].items, _newJobs[i].weight, new Date().valueOf());

						if (_newJobs[i].driverNoteArray) {
							saveTheNotes(_newJobs[i].driverNoteArray, _newJobs[i].driverNoteArray.length, masterJob, db);
						}
						if (_newJobs[i].orderItemArray) {
							// saveTheItems(items, itemsLength, itemId, master, excCheck, db)
							saveTheItems(_newJobs[i].orderItemArray, _newJobs[i].orderItemArray.length, masterJob, masterJob, excCheck, db);
						}
						/*
						 *
						 * End Slave Check
						 *
						 *
						 */
					} else if (dup === false) {

						if (_newJobs[i].orderItemArray) {
							saveTheItems(_newJobs[i].orderItemArray, _newJobs[i].orderItemArray.length, _newJobs[i].id, _newJobs[i].id, excCheck, db);
						}

						if (_newJobs[i].driverNoteArray) {
							saveTheNotes(_newJobs[i].driverNoteArray, _newJobs[i].driverNoteArray.length, _newJobs[i].id, db);
						}
						//16-04-2012 11:55:00 PM
						var splitDate = _newJobs[i].puAtReqArriveTime.split(" ", 1);
						var fixDate = splitDate.toString();
						fixDate = fixDate.split("-");
						var sortDate = fixDate[2] + '/' + fixDate[1] + '/' + fixDate[0];
						//var splitTime = _newJobs[i].puAtReqArriveTime.split(" ", 2);
						//var fixTime = splitTime[1].toString();
						//Ti.API.warn(fixTime);
						//Ti.API.info('@@@ SQL DEBUG @@@ this.sortDate : ' + sortDate);
						Ti.API.info('@@@ SQL DEBUG @@@ New Job Detected _newJobs[i].id, _newJobs[i].companyNumber, _newJobs[i].controlNumber: ' + _newJobs[i].id + ', ' + _newJobs[i].companyNumber + ', ' + _newJobs[i].controlNumber);
						//_newJobs[i].puAtReqArriveTime
						db.execute('insert or replace into jobs ( id, companyNumber, controlNumber, serviceType,  bol, orderedBy, vehType, puAtReqArriveTime, dlAtReqArriveTime, pieces, weight, puAtName, puAtAddress, puAtRFD, puAtCity, puAtZip, puAtAttn, dlToName, dlToAddress, dlToRFD, dlToCity, dlToZip, dlToAttn, puAtSpecInst, dlToSpecInst, reference, puAtPhone, dlToPhone, pay, customerType, customerNumber, sortDate, username, isAccepted, brand, age)  values ( ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, ?, ?, ?)', _newJobs[i].id, _newJobs[i].companyNumber.toString(), _newJobs[i].controlNumber.toString(), _newJobs[i].serviceType, _newJobs[i].bol, _newJobs[i].orderedBy, _newJobs[i].vehType, sanatize_timestamp(_newJobs[i].puAtReqArriveTime), sanatize_timestamp(_newJobs[i].dlAtReqArriveTime), _newJobs[i].pieces.toString(), _newJobs[i].weight.toString(), _newJobs[i].puAtName, _newJobs[i].puAtAddress, _newJobs[i].puAtRFD, _newJobs[i].puAtCity, _newJobs[i].puAtZip, _newJobs[i].puAtAttn, _newJobs[i].dlToName, _newJobs[i].dlToAddress, _newJobs[i].dlToRFD, _newJobs[i].dlToCity, _newJobs[i].dlToZip, _newJobs[i].dlToAttn, _newJobs[i].puAtSpecInst, _newJobs[i].dlToSpecInst, _newJobs[i].reference, _newJobs[i].puPhone, _newJobs[i].dlPhone, _newJobs[i].pay, _newJobs[i].customerType, parseInt(_newJobs[i].customerNumber), sortDate, Ti.App.username, 'false', _newJobs[i].brandNameLong, new Date().valueOf());
					}
					that.setTheJobReqs(_newJobs[i], db);
				};

			}
			if (_newMessagesLength > 0) {
				for (var m = _newMessagesLength - 1; m >= 0; m--) {
					var splitDate = _newMessages[m].enteredDateTime.split(" ", 1);
					var fixDate = splitDate.toString();
					fixDate = fixDate.split("-");
					var sortDate = fixDate[2] + '/' + fixDate[1] + '/' + fixDate[0];
					//Ti.API.info('@@@ SQL DEBUG @@@ this.sortDate : ' + sortDate);
					//Ti.API.info('@@@ SQL DEBUG @@@ New Message Detected _newMessages[m].id, _newMessages[m].companyNumber,  _newMessages[m].controlNumber :  ' + _newMessages[m].id + ', ' + _newMessages[m].companyNumber + ', ' + _newMessages[m].controlNumber);
					db.execute('insert or replace into messages (id, companyNumber, controlNumber, enteredDateTime, messageText, responseBoolean, tagJobId, type, sortDate, age) values (?,?,?,?,?,?,?,?,?, ?)', _newMessages[m].id, _newMessages[m].companyNumber, _newMessages[m].controlNumber, _newMessages[m].enteredDateTime, _newMessages[m].messageText, _newMessages[m].responseBoolean, _newMessages[m].tagJobId, _newMessages[m].type, sortDate, new Date().valueOf());
				};
			}
			if (_newJobsLength > 0 || _newMessagesLength > 0) {
				var newAlert = require('Notification');
				newAlert();
				var toast = Ti.UI.createNotification({
					message : "TAGNET : " + _newJobsLength + " New Job(s) Available.\n" + _newMessagesLength + " New Message(s) from the brokers.",
					duration : Ti.UI.NOTIFICATION_DURATION_SHORT
				});
				toast.show();
			}
			db.execute('COMMIT');
			db.close();
			db = null;
			splitDate = null, fixDate = null, sortDate = null;
			_data = null, _newJobs = null, _newJobsLength = null, _newMessages = null, _newMessagesLength = null;
			slaveCheck = null, slaveCustomerCheck = null, lookForMasterQuery = null, masterJob = null, isSlave = null;
		};
		this.setTheJobReqs = function(job, db) {
			Ti.API.info("@@@ SQL DEBUG @@@ setTheJobReqs FIRED");
			//Check for forms
			var formCheckQuery, checkForStatus, insertStatus, areForms = false, puReq = true, dlReq = true, custParms, custCompare = {};

			var checkForStatus = db.execute('select * from jobStatus where id = "' + job.id + '"');
			if (checkForStatus.rowCount > 0) {
				return;
			}
			checkForStatus.close();
			formCheckQuery = db.execute('select * from customers where customerNumber = ' + parseInt(job.customerNumber) + ' and companyNumber = ' + parseInt(job.companyNumber) + ';');
			if (formCheckQuery.rowCount > 0) {
				areForms = true;
			}
			formCheckQuery.close();
			// Check to see if PU or DL are required
			if (job.serviceType !== 'EXC') {

				custParms = db.execute('select * from customerRequirements where customerNumber = ' + job.customerNumber + ' and companyNumber = ' + job.companyNumber + ';');
				if (custParms.rowCount > 0) {
					custCompare.puRequired = custParms.fieldByName('puRequired');
					custCompare.puFlag = custParms.fieldByName('puFlag');
					custCompare.puValue = custParms.fieldByName('puValue');
					custCompare.dlRequired = custParms.fieldByName('dlRequired');
					custCompare.dlFlag = custParms.fieldByName('dlFlag');
					custCompare.dlValue = custParms.fieldByName('dlValue');
					//Ti.API.info("@@@ SQL DEBUG @@@ " + custCompare.puRequired);
					//Ti.API.info("@@@@@ SQL DEBUG @@@@@ " + custCompare.puFlag);
					//Ti.API.info("@@@@@ SQL DEBUG @@@@@ " + custCompare.puValue);
					//Ti.API.info("@@@@@ SQL DEBUG @@@@@ " + custCompare.dlRequired);
					//Ti.API.info("@@@@@ SQL DEBUG @@@@@ " + custCompare.dlFlag);
					//Ti.API.info("@@@@@ SQL DEBUG @@@@@ " + custCompare.dlValue);
					//Ti.API.info("@@@@@ SQL DEBUG @@@@@ " + job[custCompare.puFlag]);
					//Ti.API.info("@@@@@ SQL DEBUG @@@@@ " + job['' + custCompare.puFlag]);
					if (custCompare.puRequired === false || custCompare.puRequired === 'false') {
						//Ti.API.info("@@@@@ SQL DEBUG @@@@@ " + removeSpace(custCompare.puValue));
						var a = removeSpace(job['' + custCompare.puFlag]);
						var b = removeSpace(custCompare.puValue);

						if (a === b) {

							//	Ti.API.info("@@@@@ SQL DEBUG @@@@@ Pickup Not Required for : " + job.id);
							puReq = false;

						}
					}
					if (custCompare.dlRequired === false || custCompare.dlRequired === 'false') {
						//Ti.API.info("@@@@@ SQL DEBUG @@@@@ " + removeSpace(custCompare.dlValue));
						var c = removeSpace(job['' + custCompare.dlFlag]);
						var d = removeSpace(custCompare.dlValue);

						if (c === d) {
							//Ti.API.info("@@@@@ SQL DEBUG @@@@@ Delivery Not Required for : " + job.id);
							dlReq = false;
						}
					}
				}
				custParms.close();

			}

			db.execute('insert into jobStatus  (id, puComplete, puRequired,  dlComplete, dlRequired, formsComplete, isForms, puRefuse, dlRefused, age) values (?,?,?,?,?,?,?,?,?, ?)', job.id, false, puReq, false, dlReq, false, areForms, false, false, new Date().valueOf())
			//db.execute('CREATE TABLE IF NOT EXISTS jobStatus (id integer PRIMARY KEY NOT NULL UNIQUE, puComplete, puRequired,  dlComplete, dlRequired, formsComplete, isForms, puRefuse, dlRefused)');
			formCheckQuery = null, checkForStatus = null, insertStatus = null, areForms = null, puReq = null, dlReq = null, custParms = null, custCompare = null;

			checkForStatus = null;
			return;
		};
		return this;
	}
	function saveTheItems(items, itemsLength, itemId, master, excCheck, db) {
		//Ti.API.info("@@@ SQL DEBUG @@@ master: " + master);
		//Ti.API.info("@@@ SQL DEBUG @@@ excCheck: " + excCheck);
		var that_itemArray, that_itemLength, that_jobId, i;
		that_itemArray = items, that_itemLength = itemsLength, that_jobId = itemId, guiTagJobId = master, exchange = excCheck;
		for (var i = that_itemLength - 1; i >= 0; i--) {

			//Ti.API.info('@@@ SQL DEBUG @@@ that_jobId : guiTagJobId ' + that_jobId + " : " + guiTagJobId);
			//Ti.API.info('@@@ SQL DEBUG @@@ Quantity: ' + parseInt(that_itemArray[i].quantity));
			if (exchange === true && (parseInt(that_itemArray[i].quantity) < 0)) {
				//Ti.API.info('@@@ SQL DEBUG @@@  exchange === true && (parseInt(that_itemArray[i].quantity) < 0 ');

				//Ti.API.info('@@@ SQL DEBUG @@@ that_itemArray[i].itemId : ' + that_itemArray[i].itemId)
				db.execute('insert or replace into items ( itemId, tagJobId, description, quantity, age) values ( ?, ?, ?, ?, ?)', that_itemArray[i].itemId, guiTagJobId, that_itemArray[i].description, 1, new Date().valueOf());

			} else if (exchange === false && parseInt(that_itemArray[i].quantity) > 0) {
				//Ti.API.info('@@@ SQL DEBUG @@@ exchange === false that_itemArray[i].quantity > 0 ');

				//Ti.API.info('@@@ SQL DEBUG @@@ that_itemArray[i].itemId : ' + that_itemArray[i].itemId)
				db.execute('insert or replace into items ( itemId, tagJobId, description, quantity, age) values ( ?, ?, ?, ?, ?)', that_itemArray[i].itemId, guiTagJobId, that_itemArray[i].description, that_itemArray[i].quantity, new Date().valueOf());

			} else {

			}

		}
		return;
	}

	function saveTheNotes(noteArray, noteLength, jobId, db) {
		//Ti.API.info('@@@ XHR DB DEBUG @@@ : Note(s) detected')
		var that_noteArray, that_noteLength, that_jobId, i;
		that_noteArray = noteArray, that_noteLength = noteLength, that_jobId = jobId;
		for (var i = that_noteLength - 1; i >= 0; i--) {
			db.execute('insert or replace into driverNotes ( tagJobId, noteAuthorUserId,  userNoteCode, auditNoteCode, note, enteredDateTime, age) values ( ?, ?, ?, ?, ?, ?, ?)', that_jobId, that_noteArray[i].noteAuthorUserId, that_noteArray[i].userNoteCode, that_noteArray[i].auditNoteCode, that_noteArray[i].note, that_noteArray[i].enteredDateTime, new Date().valueOf());
		}
		return;
	}

	function gc() {
		//	var auditFire = require('PostToAuditService');
		var atfsys = require('uk.me.thepotters.atf.sys');
		Ti.API.info("module is => " + atfsys);

		atfsys.OptimiseMemory();
		return;
	}


	app.FireHttp();
	setTimeout(gc, 90000);
	return;
}

module.exports = SYNC;
