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
	newTimestamp = this.date + ' ' + this.time + ' ' + this.amorpm;
	return newTimestamp;
}

function DataBase() {
	var that = this;
	this.loggedInCheck = function() {
		//db.execute('CREATE TABLE IF NOT EXISTS user (id integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, username UNIQUE, password, longitude, latitude, location, available, idpSignature text)');
		var db = Titanium.Database.open('mobile');
		var selectFromUser = db.execute('select * from user');
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
		db.close();
		db = null;
		return _data;
	};
	this.loggInEvent = function(data) {
		//db.execute('CREATE TABLE IF NOT EXISTS user (id integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, username UNIQUE, password, longitude, latitude, location, available, idpSignature text)');
		var db = Titanium.Database.open('mobile');
		var selectFromUser = db.execute('select * from user');
		if (selectFromUser.rowCount > 0) {
			db.execute('DELETE FROM user;')
			db.execute('INSERT INTO user (username, password, longitude, latitude, available, idpSignature, track) values (?,?,?,?,?,?, ?)', data.username, data.password, data.longitude, data.latitude, 'true', null, true);

			Ti.API.info('@@@ SQL DEBUG @@@ Rows Detected In User Table. Deleteing users & Inserting new records.');
		} else {
			Ti.API.info('@@@ SQL DEBUG @@@ No Rows In User Table, Inserting new records');
			db.execute('INSERT OR REPLACE INTO user (username, password, longitude, latitude, available, idpSignature, track) values (?,?,?,?,?,?,?)', data.username, data.password, data.longitude, data.latitude, 'true', null, true);
		}
		selectFromUser.close();
		db.close();
		selectFromUser = null;
		db = null;
	};
	this.loggOutEvent = function() {
		//db.execute('CREATE TABLE IF NOT EXISTS user (id integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, username UNIQUE, password, longitude, latitude, location, available, idpSignature text)');
		var db = Titanium.Database.open('mobile');
		var selectFromUser = db.execute('select * from user');
		if (selectFromUser.rowCount > 0) {
			db.execute('DELETE FROM user;')
			//db.execute('INSERT INTO user (username, password, longitude, latitude, available, idpSignature) values (?,?,?,?,?,?)', data.username, data.password, data.longitude, data.latitude, 'true', null);

			Ti.API.info('@@@ SQL DEBUG @@@ Rows Detected In User Table. Deleteing users - Logging Out.');
		}
		selectFromUser.close();
		db.close();
		db = null;
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
					var fixDate = splitDate.toString();
					fixDate = fixDate.split("-");
					var sortDate = fixDate[2] + '/' + fixDate[1] + '/' + fixDate[0];
					Ti.API.info('Duplicate Order Detected : ' + _newJobs[i].controlNumber.toString() + '. Replacing Record.')
					db.execute('delete from jobs where controlNumber = "' + _newJobs[i].controlNumber.toString() + '";');
					db.execute('insert or replace into jobs ( id, companyNumber, controlNumber, serviceType,  bol, orderedBy, vehType, puAtReqArriveTime, dlAtReqArriveTime, pieces, weight, puAtName, puAtAddress, puAtRFD, puAtCity, puAtZip, puAtAttn, dlToName, dlToAddress, dlToRFD, dlToCity, dlToZip, dlToAttn, puAtSpecInst, dlToSpecInst, reference, puAtPhone, dlToPhone, pay, customerType, customerNumber, sortDate, username, isAccepted, brand, age)  values ( ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, ?, ?, ?)', _newJobs[i].id, _newJobs[i].companyNumber.toString(), _newJobs[i].controlNumber.toString(), _newJobs[i].serviceType, _newJobs[i].bol, _newJobs[i].orderedBy, _newJobs[i].vehType, sanatize_timestamp(_newJobs[i].puAtReqArriveTime), sanatize_timestamp(_newJobs[i].dlAtReqArriveTime), _newJobs[i].pieces.toString(), _newJobs[i].weight.toString(), _newJobs[i].puAtName, _newJobs[i].puAtAddress, _newJobs[i].puAtRFD, _newJobs[i].puAtCity, _newJobs[i].puAtZip, _newJobs[i].puAtAttn, _newJobs[i].dlToName, _newJobs[i].dlToAddress, _newJobs[i].dlToRFD, _newJobs[i].dlToCity, _newJobs[i].dlToZip, _newJobs[i].dlToAttn, _newJobs[i].puSpecialInstruction, _newJobs[i].dlSpecialInstruction, _newJobs[i].reference, _newJobs[i].puPhone, _newJobs[i].dlPhone, _newJobs[i].pay, _newJobs[i].customerType, parseInt(_newJobs[i].customerNumber), sortDate, Ti.App.username, this.dup.fieldByName('isAccepted'), _newJobs[i].brandNameLong, new Date().valueOf());
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
					//Ti.API.info('@@@ SQL DEBUG @@@ this.sortDate : ' + sortDate);
					Ti.API.info('@@@ SQL DEBUG @@@ New Job Detected _newJobs[i].id, _newJobs[i].companyNumber, _newJobs[i].controlNumber: ' + _newJobs[i].id + ', ' + _newJobs[i].companyNumber + ', ' + _newJobs[i].controlNumber);
					//_newJobs[i].puAtReqArriveTime
					db.execute('insert or replace into jobs ( id, companyNumber, controlNumber, serviceType,  bol, orderedBy, vehType, puAtReqArriveTime, dlAtReqArriveTime, pieces, weight, puAtName, puAtAddress, puAtRFD, puAtCity, puAtZip, puAtAttn, dlToName, dlToAddress, dlToRFD, dlToCity, dlToZip, dlToAttn, puAtSpecInst, dlToSpecInst, reference, puAtPhone, dlToPhone, pay, customerType, customerNumber, sortDate, username, isAccepted, brand, age)  values ( ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, ?, ?, ?)', _newJobs[i].id, _newJobs[i].companyNumber.toString(), _newJobs[i].controlNumber.toString(), _newJobs[i].serviceType, _newJobs[i].bol, _newJobs[i].orderedBy, _newJobs[i].vehType, sanatize_timestamp(_newJobs[i].puAtReqArriveTime), sanatize_timestamp(_newJobs[i].dlAtReqArriveTime), _newJobs[i].pieces.toString(), _newJobs[i].weight.toString(), _newJobs[i].puAtName, _newJobs[i].puAtAddress, _newJobs[i].puAtRFD, _newJobs[i].puAtCity, _newJobs[i].puAtZip, _newJobs[i].puAtAttn, _newJobs[i].dlToName, _newJobs[i].dlToAddress, _newJobs[i].dlToRFD, _newJobs[i].dlToCity, _newJobs[i].dlToZip, _newJobs[i].dlToAttn, _newJobs[i].puSpecialInstruction, _newJobs[i].dlSpecialInstruction, _newJobs[i].reference, _newJobs[i].puPhone, _newJobs[i].dlPhone, _newJobs[i].pay, _newJobs[i].customerType, parseInt(_newJobs[i].customerNumber), sortDate, Ti.App.username, 'false', _newJobs[i].brandNameLong, new Date().valueOf());
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
				message : "TAGNET : " + _newJobsLength + " New Jobs Available",
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
	this.updateJobStatus = function(id, type) {
		var db = Titanium.Database.open('mobile');
		if (type === 0) {
			//db.execute('insert into jobStatus  (id, puComplete, puRequired,  dlComplete, dlRequired, formsComplete, isForms, puRefuse, dlRefused) values (?,?,?,?,?,?,?,?,?)', job.id, false, puReq, false, dlReq, false, areForms, false, false)
			db.execute('UPDATE jobStatus set puComplete = "true" where id ="' + id + '";');
			db.close();
			return;
		}
		if (type === 1) {
			db.execute('UPDATE jobStatus set dlComplete = "true" where id ="' + id + '";');
			db.close();
			return;
		}
		if (type === 2) {
			db.execute('UPDATE jobStatus set dlComplete = "true", formsComplete = "true" where id ="' + id + '";');
			db.close();
			return;
		}

	}
	this.selectWhichForms = function(job) {
		Ti.API.info("@@@ SQL DEBUG @@@ customerNumber = " + parseInt(job.customerNumber) + ' and companyNumber = ' + parseInt(job.companyNumber));
		var db = Titanium.Database.open('mobile'), formCheckQuery, results = {}, form2 = false, form3 = false, form4 = false, form5 = false, departRequired = false;
		formCheckQuery = db.execute('select * from customers where customerNumber = ' + parseInt(job.customerNumber) + ' and companyNumber = ' + parseInt(job.companyNumber) + ';');
		if (formCheckQuery.rowCount > 0) {
			//	Ti.API.warn('LINE 304 | db.js | formCheckQuery : '+JSON.stringify(formCheckQuery)+' | show the reults of the query.');
			while (formCheckQuery.isValidRow()) {
				//	Ti.API.warn('LINE 306 | db.js | formCheckQuery.fieldByName(\'departFlag\') : '+JSON.stringify(formCheckQuery.fieldByName('departFlag'))+' | show the reults of the query.');
				departRequired = formCheckQuery.fieldByName('departFlag');
				if (parseInt(formCheckQuery.fieldByName('formId')) === 2) {
					form2 = true;
				}
				if (parseInt(formCheckQuery.fieldByName('formId')) === 3) {
					form3 = true;
				}
				if (parseInt(formCheckQuery.fieldByName('formId')) === 4) {
					form4 = true;
				}
				if (parseInt(formCheckQuery.fieldByName('formId')) === 5) {
					form5 = true;
				}

				formCheckQuery.next();
			}
		}
		formCheckQuery.close();
		db.close();
		results = {
			two : form2,
			three : form3,
			four : form4,
			five : form5,
			depart : departRequired
		};
		var _obj = {
			results : results
		};
		formCheckQuery = null;
		db = null;
		return _obj;
	};
	this.selectSlaveJobs = function(tagJobId) {
		var _tagJobId = tagJobId;
		var db = Titanium.Database.open('mobile');
		var selectSlaveTags, slaveTagArray = [];
		selectSlaveTags = db.execute('select * from slaveTags where masterTagJobId = "' + _tagJobId + '";');
		if (selectSlaveTags.rowCount > 0) {
			while (selectSlaveTags.isValidRow()) {
				slaveTagArray.push({
					masterTagJobId : selectSlaveTags.fieldByName('masterTagJobId'),
					slaveTagJobId : selectSlaveTags.fieldByName('selectSlaveTags'),
					companyNumber : selectSlaveTags.fieldByName('companyNumber'),
					controlNumber : selectSlaveTags.fieldByName('controlNumber'),
					items : selectSlaveTags.fieldByName('items'),
					weight : selectSlaveTags.fieldByName('weight')
				});
				selectSlaveTags.next();
			}
		}
		selectSlaveTags.close();
		db.close();
		db = null;
		selectSlaveTags = null;
		var _obj = {
			results : slaveTagArray
		};

		return _obj;
		//db.execute('CREATE TABLE IF NOT EXISTS slaveTags (slaveTagJobId PRIMARY KEY NOT NULL UNIQUE, masterTagJobId, companyNumber, controlNumber, items, weight)');
	};
	this.selectJobsToAccept = function() {
		var db = Titanium.Database.open('mobile');
		var selectNewJobs, jobsArray = [];
		selectNewJobs = db.execute('select jobs.*, jobStatus.* from jobs, jobStatus where isAccepted = "false" and username = "' + Ti.App.username + '" and jobs.id = jobStatus.id LIMIT 50;');
		Ti.API.info('@@@ SQL DEBUG @@@@ selectNewJobs.rowCount : ' + selectNewJobs.rowCount);
		if (selectNewJobs.rowCount > 0) {
			while (selectNewJobs.isValidRow()) {
				Ti.API.info('@@@ SQL DEBUG @@@@ controlNumber : ' + selectNewJobs.fieldByName('controlNumber'));
				jobsArray.push({
					"bol" : selectNewJobs.fieldByName('bol'),
					"companyNumber" : selectNewJobs.fieldByName('companyNumber'),
					"controlNumber" : selectNewJobs.fieldByName('controlNumber'),
					"customerNumber" : selectNewJobs.fieldByName('customerNumber'),
					"customerType" : selectNewJobs.fieldByName('customerType'),
					"deadlineDateTime" : selectNewJobs.fieldByName('deadlineDateTime'),
					"dlAtReqArriveTime" : selectNewJobs.fieldByName('dlAtReqArriveTime'),
					"dlSpecialInstruction" : selectNewJobs.fieldByName('dlToSpecInst'),
					"puSpecialInstruction": selectNewJobs.fieldByName('puAtSpecInst'),
					"dlToAddress" : selectNewJobs.fieldByName('dlToAddress'),
					"dlToAttn" : selectNewJobs.fieldByName('dlToAttn'),
					"dlToCity" : selectNewJobs.fieldByName('dlToCity'),
					"dlToName" : selectNewJobs.fieldByName('dlToName'),
					"dlToRFD" : selectNewJobs.fieldByName('dlToRFD'),
					"dlToZip" : selectNewJobs.fieldByName('dlToZip'),
					"expires" : selectNewJobs.fieldByName('expires'),
					//"homeDirectOrigMovementCode" : selectNewJobs.fieldByName('homeDirectOrigMovementCode'),
					//"homeDirectdestMovementCode" : selectNewJobs.fieldByName('homeDirectdestMovementCode'),
					"id" : selectNewJobs.fieldByName('id'),
					"orderType" : selectNewJobs.fieldByName('orderType'),
					"orderedBy" : selectNewJobs.fieldByName('orderedBy'),
					"pay" : selectNewJobs.fieldByName('pay'),
					"pieces" : selectNewJobs.fieldByName('pieces'),
					"puAtAddress" : selectNewJobs.fieldByName('puAtAddress'),
					"puAtAttn" : selectNewJobs.fieldByName('puAtAttn'),
					"puAtCity" : selectNewJobs.fieldByName('puAtCity'),
					"puAtName" : selectNewJobs.fieldByName('puAtName'),
					"puAtRFD" : selectNewJobs.fieldByName('puAtRFD'),
					"puAtReqArriveTime" : selectNewJobs.fieldByName('puAtReqArriveTime'),
					"puAtZip" : selectNewJobs.fieldByName('puAtZip'),
					"reference" : selectNewJobs.fieldByName('reference'),
					"serviceType" : selectNewJobs.fieldByName('serviceType'),
					"type" : selectNewJobs.fieldByName('type'),
					"vehType" : selectNewJobs.fieldByName('vehType'),
					"weight" : selectNewJobs.fieldByName('weight'),
					"type" : "direct",
					"puComplete" : selectNewJobs.fieldByName('puComplete'),
					"puRequired" : selectNewJobs.fieldByName('puRequired'),
					"dlComplete" : selectNewJobs.fieldByName('dlComplete'),
					"dlRequired" : selectNewJobs.fieldByName('dlRequired'),
					"formsComplete" : selectNewJobs.fieldByName('formsComplete'),
					"isForms" : selectNewJobs.fieldByName('isForms'),
					"puRefuse" : selectNewJobs.fieldByName('puRefuse'),
					"dlRefused" : selectNewJobs.fieldByName('dlRefused'),
					"brand" : selectNewJobs.fieldByName('brand'),
					"sortDate" : selectNewJobs.fieldByName('sortDate')
				});
				selectNewJobs.next();
			}
		}
		selectNewJobs.close();
		db.close();
		db = null;
		selectNewJobs = null;
		var _obj = {
			results : jobsArray
		};

		return _obj;
	};
	this.selectJobs = function() {
		var db = Titanium.Database.open('mobile');
		var selectNewJobs, jobsArray = [];
		selectNewJobs = db.execute('select jobs.*, jobStatus.* from jobs, jobStatus where isAccepted = "true" and username = "' + Ti.App.username + '" and jobs.id = jobStatus.id and jobStatus.dlComplete <> "true" order by jobs.dlAtReqArriveTime ASC;');
		Ti.API.info('@@@ SQL DEBUG @@@@ selectNewJobs.rowCount : ' + selectNewJobs.rowCount);
		if (selectNewJobs.rowCount > 0) {
			while (selectNewJobs.isValidRow()) {
				Ti.API.info('@@@ SQL DEBUG @@@@ controlNumber : ' + selectNewJobs.fieldByName('controlNumber'));
				jobsArray.push({
					"bol" : selectNewJobs.fieldByName('bol'),
					"companyNumber" : selectNewJobs.fieldByName('companyNumber'),
					"controlNumber" : selectNewJobs.fieldByName('controlNumber'),
					"customerNumber" : selectNewJobs.fieldByName('customerNumber'),
					"customerType" : selectNewJobs.fieldByName('customerType'),
					"deadlineDateTime" : selectNewJobs.fieldByName('deadlineDateTime'),
					"dlAtReqArriveTime" : selectNewJobs.fieldByName('dlAtReqArriveTime'),
					"dlSpecialInstruction" : selectNewJobs.fieldByName('dlSpecialInstruction'),
					"dlToAddress" : selectNewJobs.fieldByName('dlToAddress'),
					"dlToAttn" : selectNewJobs.fieldByName('dlToAttn'),
					"dlToCity" : selectNewJobs.fieldByName('dlToCity'),
					"dlToName" : selectNewJobs.fieldByName('dlToName'),
					"dlToRFD" : selectNewJobs.fieldByName('dlToRFD'),
					"dlToZip" : selectNewJobs.fieldByName('dlToZip'),
					"expires" : selectNewJobs.fieldByName('expires'),
					//"homeDirectOrigMovementCode" : selectNewJobs.fieldByName('homeDirectOrigMovementCode'),
					//"homeDirectdestMovementCode" : selectNewJobs.fieldByName('homeDirectdestMovementCode'),
					"id" : selectNewJobs.fieldByName('id'),
					"orderType" : selectNewJobs.fieldByName('orderType'),
					"orderedBy" : selectNewJobs.fieldByName('orderedBy'),
					"pay" : selectNewJobs.fieldByName('pay'),
					"pieces" : selectNewJobs.fieldByName('pieces'),
					"puAtAddress" : selectNewJobs.fieldByName('puAtAddress'),
					"puAtAttn" : selectNewJobs.fieldByName('puAtAttn'),
					"puAtCity" : selectNewJobs.fieldByName('puAtCity'),
					"puAtName" : selectNewJobs.fieldByName('puAtName'),
					"puAtRFD" : selectNewJobs.fieldByName('puAtRFD'),
					"puAtReqArriveTime" : selectNewJobs.fieldByName('puAtReqArriveTime'),
					"puAtZip" : selectNewJobs.fieldByName('puAtZip'),
					"reference" : selectNewJobs.fieldByName('reference'),
					"serviceType" : selectNewJobs.fieldByName('serviceType'),
					"type" : selectNewJobs.fieldByName('type'),
					"vehType" : selectNewJobs.fieldByName('vehType'),
					"weight" : selectNewJobs.fieldByName('weight'),
					"type" : "direct",
					"puComplete" : selectNewJobs.fieldByName('puComplete'),
					"puRequired" : selectNewJobs.fieldByName('puRequired'),
					"dlComplete" : selectNewJobs.fieldByName('dlComplete'),
					"dlRequired" : selectNewJobs.fieldByName('dlRequired'),
					"formsComplete" : selectNewJobs.fieldByName('formsComplete'),
					"isForms" : selectNewJobs.fieldByName('isForms'),
					"puRefuse" : selectNewJobs.fieldByName('puRefuse'),
					"dlRefused" : selectNewJobs.fieldByName('dlRefused'),
					"sortDate" : selectNewJobs.fieldByName('sortDate'),
					"brand" : selectNewJobs.fieldByName('brand'),
					puAtPhone : selectNewJobs.fieldByName('puAtPhone'),
					dlToPhone : selectNewJobs.fieldByName('dlToPhone'),
				});
				selectNewJobs.next();
			}
		}
		selectNewJobs.close();
		db.close();
		db = null;
		selectNewJobs = null;
		var _obj = {
			results : jobsArray
		};

		return _obj;
	};
	this.selectHistoryJobs = function() {
		var db = Titanium.Database.open('mobile');
		var selectNewJobs, jobsArray = [];
		selectNewJobs = db.execute('select jobs.*, jobStatus.* from jobs, jobStatus where isAccepted = "true" and username = "' + Ti.App.username + '" and jobs.id = jobStatus.id and jobStatus.dlComplete = "true" order by jobs.dlAtReqArriveTime ASC;');
		Ti.API.info('@@@ SQL DEBUG @@@@ selectNewJobs.rowCount : ' + selectNewJobs.rowCount);
		if (selectNewJobs.rowCount > 0) {
			while (selectNewJobs.isValidRow()) {
				Ti.API.info('@@@ SQL DEBUG @@@@ controlNumber : ' + selectNewJobs.fieldByName('controlNumber'));
				jobsArray.push({
					"bol" : selectNewJobs.fieldByName('bol'),
					"companyNumber" : selectNewJobs.fieldByName('companyNumber'),
					"controlNumber" : selectNewJobs.fieldByName('controlNumber'),
					"customerNumber" : selectNewJobs.fieldByName('customerNumber'),
					"customerType" : selectNewJobs.fieldByName('customerType'),
					"deadlineDateTime" : selectNewJobs.fieldByName('deadlineDateTime'),
					"dlAtReqArriveTime" : selectNewJobs.fieldByName('dlAtReqArriveTime'),
					"dlSpecialInstruction" : selectNewJobs.fieldByName('dlSpecialInstruction'),
					"dlToAddress" : selectNewJobs.fieldByName('dlToAddress'),
					"dlToAttn" : selectNewJobs.fieldByName('dlToAttn'),
					"dlToCity" : selectNewJobs.fieldByName('dlToCity'),
					"dlToName" : selectNewJobs.fieldByName('dlToName'),
					"dlToRFD" : selectNewJobs.fieldByName('dlToRFD'),
					"dlToZip" : selectNewJobs.fieldByName('dlToZip'),
					"expires" : selectNewJobs.fieldByName('expires'),
					//"homeDirectOrigMovementCode" : selectNewJobs.fieldByName('homeDirectOrigMovementCode'),
					//"homeDirectdestMovementCode" : selectNewJobs.fieldByName('homeDirectdestMovementCode'),
					"id" : selectNewJobs.fieldByName('id'),
					"orderType" : selectNewJobs.fieldByName('orderType'),
					"orderedBy" : selectNewJobs.fieldByName('orderedBy'),
					"pay" : selectNewJobs.fieldByName('pay'),
					"pieces" : selectNewJobs.fieldByName('pieces'),
					"puAtAddress" : selectNewJobs.fieldByName('puAtAddress'),
					"puAtAttn" : selectNewJobs.fieldByName('puAtAttn'),
					"puAtCity" : selectNewJobs.fieldByName('puAtCity'),
					"puAtName" : selectNewJobs.fieldByName('puAtName'),
					"puAtRFD" : selectNewJobs.fieldByName('puAtRFD'),
					"puAtReqArriveTime" : selectNewJobs.fieldByName('puAtReqArriveTime'),
					"puAtZip" : selectNewJobs.fieldByName('puAtZip'),
					"reference" : selectNewJobs.fieldByName('reference'),
					"serviceType" : selectNewJobs.fieldByName('serviceType'),
					"type" : selectNewJobs.fieldByName('type'),
					"vehType" : selectNewJobs.fieldByName('vehType'),
					"weight" : selectNewJobs.fieldByName('weight'),
					"type" : "direct",
					"puComplete" : selectNewJobs.fieldByName('puComplete'),
					"puRequired" : selectNewJobs.fieldByName('puRequired'),
					"dlComplete" : selectNewJobs.fieldByName('dlComplete'),
					"dlRequired" : selectNewJobs.fieldByName('dlRequired'),
					"formsComplete" : selectNewJobs.fieldByName('formsComplete'),
					"isForms" : selectNewJobs.fieldByName('isForms'),
					"puRefuse" : selectNewJobs.fieldByName('puRefuse'),
					"dlRefused" : selectNewJobs.fieldByName('dlRefused'),
					"sortDate" : selectNewJobs.fieldByName('sortDate'),
					"brand" : selectNewJobs.fieldByName('brand'),
					puAtPhone : selectNewJobs.fieldByName('puAtPhone'),
					dlToPhone : selectNewJobs.fieldByName('dlToPhone'),
				});
				selectNewJobs.next();
			}
		}
		selectNewJobs.close();
		db.close();
		db = null;
		selectNewJobs = null;
		var _obj = {
			results : jobsArray
		};

		return _obj;
	};
	this.selectItems = function(id) {
		Ti.API.info("@@@ SQL DEBUG @@@ selectItems FIRED");
		var db = Titanium.Database.open('mobile'), itemQuery, itemsArray = [];
		itemQuery = db.execute('select * from items where tagJobId = "' + id + '";');
		//CREATE TABLE IF NOT EXISTS items (itemId PRIMARY KEY NOT NULL UNIQUE ON CONFLICT REPLACE, tagJobId, description, quantity)
		if (itemQuery.rowCount > 0) {
			while (itemQuery.isValidRow()) {
				itemsArray.push({
					itemId : itemQuery.fieldByName('itemId'),
					tagJobId : itemQuery.fieldByName('tagJobId'),
					description : itemQuery.fieldByName('description'),
					quantity : itemQuery.fieldByName('quantity')
				});
				itemQuery.next();
			}
		}
		itemQuery.close();
		itemQuery = null;
		db.close();
		db = null;
		var _obj = {
			results : itemsArray
		};
		//this.results = itemsArray;
		return _obj;
	};
	this.acceptThisJob = function(id, response, time) {
		Ti.API.info("@@@ SQL DEBUG @@@ acceptThisJob FIRED");
		var db = Titanium.Database.open('mobile'), _data = {};
		db.execute('UPDATE jobs set isAccepted = "' + response + '" where id = "' + id + '";');
		if (response === false || response === 'false') {
			//"companyNumber" : d.companyNumberM,
			//"controlNumber" : d.controlNumberM,
			//"tagJobId" : d.tagJobIdM,
			//"type" : d.typeM,
			//'enteredDateTime' :
			var getJobData = db.execute('select * from jobs where id = "' + id + '";');

			_data.companyNumber = getJobData.fieldByName('companyNumber');
			_data.controlNumber = getJobData.fieldByName('controlNumber');
			_data.tagJobId = getJobData.fieldByName('tagJobId');
			//_data.text = getJobData.fieldByName('messageText');

			db.execute('insert into jobMessageArray (companyNumber, controlNumber, tagJobId, type, enteredDateTime, age) VALUES(?, ?, ?, ?, ?, ?)', _data.companyNumber, _data.controlNumber, id, 'decline', time, new Date().valueOf());
			db.execute('delete from jobs where id = "' + id + '";')
		}
		db.close();
		db = null;
	};
	this.saveSchedForJob = function(obj) {
		var _obj = obj;
		Ti.API.info("@@@ SQL DEBUG @@@ saveSchedForJob FIRED");
		var db = Titanium.Database.open('mobile');
		//db.execute('CREATE TABLE IF NOT EXISTS schedule (id integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, controlNumber, puEstEnteredTime, puEstimateTimeStamp, dlEstimateTime, dlEstEnteredTime, tagJobId, sortDate, username)');
		db.execute('INSERT into schedule (controlNumber, puEstEnteredTime, puEstimateTimeStamp, dlEstimateTime, dlEstEnteredTime, tagJobId, sortDate, username, age) values (?, ?, ?, ?, ?, ?, ?, ?, ?)', _obj.controlNumber, _obj.puEstEnteredTime, _obj.puEstimateTimeStamp, _obj.dlEstimateTime, _obj.dlEstEnteredTime, _obj.tagJobId, _obj.sortDate, _obj.username, new Date().valueOf());
		//db.execute('CREATE TABLE IF NOT EXISTS jobMessageArray (id integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, alertId, companyNumber, controlNumber, tagJobId, type text, messageText, enteredDateTime, responseBoolean, responseDateTime, puEstimateDateTime, dlEstimateDateTime, dlEstimateEntered, puEstimateEntered)');
		/*
		 *
		 * "companyNumber" : d.companyNumberM,
		 "controlNumber" : d.controlNumberM,
		 "tagJobId" : d.tagJobIdM,
		 "type" : 'message',
		 "puEstimateDateTime" : d.puEstimateDateTimeM,
		 "dlEstimateDateTime" : d.dlEstimateDateTimeM,
		 "dlEstimateEntered" : d.dlEstimateEntered,
		 "puEstimateEntered" : d.puEstimateEntered
		 *
		 */
		db.execute('insert into jobMessageArray (companyNumber, controlNumber, tagJobId, type, puEstimateDateTime, dlEstimateDateTime, dlEstimateEntered, puEstimateEntered, age) values ( ?, ?, ?, ?, ?, ?, ?, ?, ?)', _obj.companyNumber, _obj.controlNumber, _obj.tagJobId, "schedule", _obj.puEstimateTimeStamp, _obj.dlEstimateTime, _obj.dlEstEnteredTime, _obj.puEstEnteredTime, new Date().valueOf());
		db.close();
		db = null;
		_obj = null;
	};
	this.updateSchedForJob = function(obj) {
		var _obj = obj;
		Ti.API.info("@@@ SQL DEBUG @@@ acceptThisJob FIRED");
		var db = Titanium.Database.open('mobile');
		//db.execute('CREATE TABLE IF NOT EXISTS schedule (id integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, controlNumber, puEstEnteredTime, puEstimateTimeStamp, dlEstimateTime, dlEstEnteredTime, tagJobId, sortDate, username)');
		db.execute('UPDATE schedule SET controlNumber = "' + _obj.controlNumber + '", puEstEnteredTime = "' + _obj.puEstEnteredTime + '", puEstimateTimeStamp = "' + _obj.puEstimateTimeStamp + '", dlEstimateTime = "' + _obj.dlEstimateTime + '", dlEstEnteredTime = "' + _obj.dlEstEnteredTime + '", sortDate = "' + _obj.sortDate + '", username = "' + _obj.username + '" WHERE tagJobId= "' + _obj.tagJobId + '";');
		//db.execute('CREATE TABLE IF NOT EXISTS jobMessageArray (id integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, alertId, companyNumber, controlNumber, tagJobId, type text, messageText, enteredDateTime, responseBoolean, responseDateTime, puEstimateDateTime, dlEstimateDateTime, dlEstimateEntered, puEstimateEntered)');
		/*
		 *
		 * "companyNumber" : d.companyNumberM,
		 "controlNumber" : d.controlNumberM,
		 "tagJobId" : d.tagJobIdM,
		 "type" : 'message',
		 "puEstimateDateTime" : d.puEstimateDateTimeM,
		 "dlEstimateDateTime" : d.dlEstimateDateTimeM,
		 "dlEstimateEntered" : d.dlEstimateEntered,
		 "puEstimateEntered" : d.puEstimateEntered
		 *
		 */
		db.execute('insert into jobMessageArray (companyNumber, controlNumber, tagJobId, type, puEstimateDateTime, dlEstimateDateTime, dlEstimateEntered, puEstimateEntered, age) values ( ?, ?, ?, ?, ?, ?, ?, ?, ?)', _obj.companyNumber, _obj.controlNumber, _obj.tagJobId, 'message', _obj.puEstimateTimeStamp, _obj.dlEstimateTime, _obj.dlEstEnteredTime, _obj.puEstEnteredTime, new Date().valueOf());
		db.close();
		db = null;
		_obj = null;
	};
	this.selectSchedForView = function() {
		var db = Titanium.Database.open('mobile'), schedSelect, schedArray = [];
		schedSelect = db.execute('select schedule.*, jobs.reference, jobs.puAtAddress, jobs.puAtAttn, jobs.puAtCity, jobs.puAtName, jobs.puAtRFD, jobs.puAtReqArriveTime, jobs.puAtZip, jobs.dlToAddress, jobs.dlToAttn, jobs.dlToCity, jobs.dlToName, jobs.dlToRFD, jobs.dlToZip, jobs.puAtName, jobs.dlToName, jobs.puAtCity, jobs.dlToCity, jobs.puAtReqArriveTime, jobs.dlAtReqArriveTime, jobs.sortDate,  jobStatus.* from schedule, jobs, jobStatus where schedule.controlNumber = jobs.controlNumber and jobs.id = jobStatus.id and jobStatus.dlComplete <> "true";');
		if (schedSelect.rowCount > 0) {
			while (schedSelect.isValidRow()) {
				schedArray.push({
					id : schedSelect.fieldByName('tagJobId'),
					controlNumber : schedSelect.fieldByName('controlNumber'),
					puName : schedSelect.fieldByName('puName'),
					dlName : schedSelect.fieldByName('dlName'),
					puZip : schedSelect.fieldByName('puZip'),
					reference : schedSelect.fieldByName('reference'),
					dlZip : schedSelect.fieldByName('dlZip'),
					puTime : schedSelect.fieldByName('puTime'),
					dlTime : schedSelect.fieldByName('dlTime'),
					sortDate : schedSelect.fieldByName('sortDate'),
					"puAtAddress" : schedSelect.fieldByName('puAtAddress'),
					"puAtAttn" : schedSelect.fieldByName('puAtAttn'),
					"puAtCity" : schedSelect.fieldByName('puAtCity'),
					"puAtName" : schedSelect.fieldByName('puAtName'),
					"puAtRFD" : schedSelect.fieldByName('puAtRFD'),
					"puAtReqArriveTime" : schedSelect.fieldByName('puAtReqArriveTime'),
					"puAtZip" : schedSelect.fieldByName('puAtZip'),
					"dlToAddress" : schedSelect.fieldByName('dlToAddress'),
					"dlToAttn" : schedSelect.fieldByName('dlToAttn'),
					"dlToCity" : schedSelect.fieldByName('dlToCity'),
					"dlToName" : schedSelect.fieldByName('dlToName'),
					"dlToRFD" : schedSelect.fieldByName('dlToRFD'),
					"dlToZip" : schedSelect.fieldByName('dlToZip'),
					puEstimateDateTime : schedSelect.fieldByName('puEstimateTimeStamp'),
					dlEstimateTime : schedSelect.fieldByName('dlEstimateTime'),
					"puComplete" : schedSelect.fieldByName('puComplete'),
					"puRequired" : schedSelect.fieldByName('puRequired'),
					"dlComplete" : schedSelect.fieldByName('dlComplete'),
					"dlRequired" : schedSelect.fieldByName('dlRequired'),
				});
				schedSelect.next();
			}
		}
		schedSelect.close();
		db.close();
		schedSelect = null;
		db = null;

		//this.results = schedArray;
		var _obj = {
			results : schedArray
		};
		db = null;
		return _obj;
		/*controlNumber : jobData.controlNumber,
		 puName : jobData.puAtName,
		 dlName : jobData.dlToName,
		 puZip : jobData.puAtCity,
		 dlZip : jobData.dlToCity,
		 puTime : jobData.puAtReqArriveTime,
		 dlTime : jobData.dlAtReqArriveTime,
		 type : jobData.type,
		 sortDate : jobData.sortDate
		 */
	};
	this.answerTheMessage = function(id, response, time) {
		Ti.API.info("@@@ SQL DEBUG @@@ answerTheMessage FIRED");
		var db = Titanium.Database.open('mobile'), _data = {};
		//db.execute('CREATE TABLE IF NOT EXISTS messages (id PRIMARY KEY NOT NULL UNIQUE, companyNumber, controlNumber, enteredDateTime, messageText, responseBoolean, tagJobId, type, username, sortDate)');
		var getAlertData = db.execute('select * from messages where id = "' + id + '";');
		_data.companyNumber = getAlertData.fieldByName('companyNumber');
		_data.controlNumber = getAlertData.fieldByName('controlNumber');
		_data.tagJobId = getAlertData.fieldByName('tagJobId');
		_data.text = getAlertData.fieldByName('messageText');
		getAlertData.close();
		getAlertData = null;
		db.execute('delete from messages where id = "' + id + '";');

		db.execute('insert into jobMessageArray(alertId, companyNumber, controlNumber, tagJobId, type, messageText, enteredDateTime, responseDateTime, responseBoolean, age) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', id, _data.companyNumber, _data.controlNumber, _data.tagJobId, 'response', _data.text, time, time, response, new Date().valueOf());
		db.close();
		db = null;
	};
	this.addUpdateToQueue = function(id, type) {
		Ti.API.info("@@@ SQL DEBUG @@@ addUpdateToQueue FIRED : " + id + " " + type);
		var db = Titanium.Database.open('mobile');
		db.execute('INSERT into updateEngine (updateId, type, age) VALUES (?, ?, ?)', id, type, new Date().valueOf());
		db.close();
		db = null;
		//db.execute('CREATE TABLE IF NOT EXISTS updateEngine (id integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, updateId, type)');
	};
	this.selectMessages = function() {
		var db = Titanium.Database.open('mobile');
		var selectMessages, messageArray = [];
		//selectMessages = db.execute('select * from messages where enteredDateTime is null or enteredDateTime ="";');
		selectMessages = db.execute('select * from messages;');
		Ti.API.info('@@@ SQL DEBUG @@@@ selectMessages.rowCount : ' + selectMessages.rowCount);
		if (selectMessages.rowCount > 0) {
			while (selectMessages.isValidRow()) {
				Ti.API.info('@@@ SQL DEBUG @@@@ controlNumber : ' + selectMessages.fieldByName('controlNumber'));
				//db.execute('CREATE TABLE IF NOT EXISTS messages (id PRIMARY KEY NOT NULL UNIQUE, companyNumber, controlNumber, enteredDateTime, messageText, responseBoolean, tagJobId, type)');
				messageArray.push({
					"id" : selectMessages.fieldByName('id'),
					"companyNumber" : selectMessages.fieldByName('companyNumber'),
					"controlNumber" : selectMessages.fieldByName('controlNumber'),
					"enteredDateTime" : selectMessages.fieldByName('enteredDateTime'),
					"messageText" : selectMessages.fieldByName('messageText'),
					"responseBoolean" : selectMessages.fieldByName('responseBoolean'),
					"tagJobId" : selectMessages.fieldByName('tagJobId'),
					"type" : "message",
					"sortDate" : selectMessages.fieldByName('sortDate')
				});
				selectMessages.next();
			}
		}
		selectMessages.close();
		db.close();
		selectMessages = null;
		db = null;
		var _obj = {
			results : messageArray
		};
		//this.results = messageArray;
		return _obj;
	};
	this.selectFormType2 = function() {
		var db = Titanium.Database.open('mobile');
		var selectFormQuery = db.execute('SELECT * FROM formParams where formId = 2 and `responsible` <> "refuse" order by fieldId;');
		//formParams (`fieldId`,`formId`,`fieldDescription`,`fieldType`,`responsible`,`required`)
		var formArray = [];
		while (selectFormQuery.isValidRow()) {

			formArray.push({
				fieldId : selectFormQuery.fieldByName('fieldId'),
				formId : selectFormQuery.fieldByName('formId'),
				fieldDescription : selectFormQuery.fieldByName('fieldDescription'),
				fieldType : selectFormQuery.fieldByName('fieldType')
			});

			selectFormQuery.next();
		}
		selectFormQuery.close();
		selectFormQuery = null;
		db.close();
		db = null;
		var _obj = {
			results : formArray
		};
		//this.results = formArray;
		return _obj;
	};
	this.insertPopOrPod = function(data, type) {
		var _data = data, _type = type, db = Titanium.Database.open('mobile');
		Ti.API.info('@@@ SQL DEBUG @@@ _data : ' + JSON.stringify(_data) + " type : " + type);
		if (_type === 0) {
			//_data.puComplete = true;
			//_data.dlComplete = false;
			//_data.puRefuse = false;
			//_data.dlRefuse = false;
			db.execute('INSERT OR REPLACE INTO updatePODArray (tagJobId, companyNumber, controlNumber, puComplete, dlComplete, dlRefuse,  puRefuse, puActualArriveDateTime, puActualDepartDateTime, puPODFullName, puSignatureBase64, weight, pieces, formsComplete, puEmail, puCustomerInitials, puEntered, age) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', _data.tagJobId, _data.companyNumber, _data.controlNumber, _data.puComplete, _data.dlComplete, _data.dlRefuse, _data.puRefuse, _data.puActualArriveDateTime, _data.puActualDepartDateTime, _data.puPODFullName, _data.signature, _data.weight, _data.pieces, _data.formsComplete, _data.puEmail, _data.init, _data.puEntered, new Date().valueOf())
		} else {
			//_data.dlComplete = true;
			//_data.puComplete = false;
			//_data.puRefuse = false;
			//_data.dlRefuse = false;
			//tagJobId, companyNumber, controlNumber, puComplete, dlComplete, dlRefuse, puRefuse, dlActualArriveDateTime, dlActualDepartDateTime, dlPODFullName, dlSignatureBase64, weight, pieces, formsComplete, dlEmail, dlCustomerInitials, dlEntered
			var checkForUpdate = db.execute('select * from updatePODArray where tagJobId ="' + _data.tagJobId + '";');
			if (checkForUpdate.rowCount > 0) {
				db.execute('UPDATE updatePODArray SET puComplete= "' + _data.puComplete + '", dlComplete= "' + _data.dlComplete + '", dlRefuse= "' + _data.dlRefuse + '", puRefuse= "' + _data.puRefuse + '", dlActualArriveDateTime= "' + _data.dlActualArriveDateTime + '", dlActualDepartDateTime= "' + _data.dlActualDepartDateTime + '", dlPODFullName= "' + _data.dlPODFullName + '", dlSignatureBase64= "' + _data.signature + '", weight= "' + _data.weight + '", pieces= "' + _data.pieces + '", formsComplete= "' + _data.formsComplete + '", dlEmail= "' + _data.dlEmail + '", dlCustomerInitials= "' + _data.init + '", dlEntered = "' + _data.dlEntered + '" WHERE tagJobId ="' + _data.tagJobId + '" ;');
				//, companyNumber, controlNumber, puComplete, dlComplete, dlRefuse, puRefuse, dlActualArriveDateTime, dlActualDepartDateTime, dlPODFullName, dlSignatureBase64, weight, pieces, formsComplete, dlEmail, dlCustomerInitials, dlEntered) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', _data.tagJobId, _data.companyNumber, _data.controlNumber, _data.puComplete, _data.dlComplete, _data.dlRefuse, _data.puRefuse, _data.dlActualArriveDateTime, _data.dlActualDepartDateTime, _data.dlPODFullName, _data.signature, _data.weight, _data.pieces, _data.formsComplete, _data.dlEmail, _data.dlCustomerInitials, _data.dlEntered);
			} else {

				db.execute('INSERT OR REPLACE INTO updatePODArray (tagJobId, companyNumber, controlNumber, puComplete, dlComplete, dlRefuse, puRefuse, dlActualArriveDateTime, dlActualDepartDateTime, dlPODFullName, dlSignatureBase64, weight, pieces, formsComplete, dlEmail, dlCustomerInitials, dlEntered,  age) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', _data.tagJobId, _data.companyNumber, _data.controlNumber, _data.puComplete, _data.dlComplete, _data.dlRefuse, _data.puRefuse, _data.dlActualArriveDateTime, _data.dlActualDepartDateTime, _data.dlPODFullName, _data.signature, _data.weight, _data.pieces, _data.formsComplete, _data.dlEmail, _data.init, _data.dlEntered, new Date().valueOf());
			}
			checkForUpdate.close();
		}

		db.close();
		db = null;
		checkForUpdate = null;
		//db.execute('CREATE TABLE IF NOT EXISTS updatePODArray (id integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, tagJobId, companyNumber, controlNumber, puComplete, dlComplete, dlRefuse, dlRefusalReason, dlActualArriveDateTime, dlActualDepartDateTime, dlPODFullName, dlSignatureBase64, dlWaitTime, puRefuse, puRefusalReason, puActualArriveDateTime, puActualDepartDateTime, puPODFullName, puSignatureBase64, weight, pieces, formsComplete, puEmail, dlEmail, puCustomerInitials, dlCustomerInitials, puEntered, dlEntered)');
		/* {
		 _data.tagJobId : "",
		 _data.companyNumber : "",
		 _data.controlNumber : "",
		 _data.puComplete : "",
		 _data.dlComplete : "",
		 _data.dlRefuse : "",
		 _data.dlRefusalReason : "",
		 _data.dlActualArriveDateTime : "",
		 _data.dlActualDepartDateTime : "",
		 _data.dlPODFullName : "",
		 _data.dlSignatureBase64 : "",
		 _data.dlWaitTime : "",
		 _data.puRefuse : "",
		 _data.puRefusalReason : "",
		 _data.puActualArriveDateTime : "",
		 _data.puActualDepartDateTime : "",
		 _data.puPODFullName : "",
		 _data.puSignatureBase64 : "",
		 _data.weight : "",
		 _data.pieces : "",
		 _data.formsComplete : "",
		 _data.puEmail : "",
		 _data.dlEmail : "",
		 _data.puCustomerInitials : "",
		 _data.dlCustomerInitials : "",
		 _data.puEntered : "",
		 _data.dlEntered : ""
		 }
		 */

	};
	this.selectDriverNotes = function(id) {
		var db = Titanium.Database.open('mobile');
		var results = [], notesQuery;
		notesQuery = db.execute('select * from driverNotes where tagJobId = "' + id + '" order by enteredDateTime ASC;');
		if (notesQuery.rowCount > 0) {
			while (notesQuery.isValidRow()) {
				Ti.API.info('@@@ DEBUG @@@ notesQuery.fieldByName("note") : ' + notesQuery.fieldByName('note'));
				results.push({
					note : notesQuery.fieldByName('note')
				});
				notesQuery.next();
				//db.execute('CREATE TABLE IF NOT EXISTS driverNotes (id integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, tagJobId, noteAuthorUserId,  userNoteCode, auditNoteCode, note, enteredDateTime, UNIQUE(tagJobId, note) ON CONFLICT REPLACE)');
			}
		}
		notesQuery.close();
		//this.results = results;
		var _obj = {
			results : results
		};
		db.close();
		db = null;
		notesQuery = null;
		return _obj;
	};
	this.saveForm5 = function(data) {
		var _data = data, db = Titanium.Database.open('mobile');
		db.execute('delete from formType5 where tagJobId = "' + _data.tagJobId + '" and  itemId = "' + _data.itemId + '" ; ');
		Ti.API.info('@@@ SQL DEBUG @@@: _data: ' + JSON.stringify(_data));

		db.execute('INSERT OR REPLACE INTO formType5(itemId, tagJobId, repsonseToAcceptBool, details, quantity, age) VALUES (?, ?, ?, ?, ?, ?)', _data.itemId, _data.tagJobId, _data.repsonseToAcceptBool, _data.details, _data.quantity, new Date().valueOf());
		db.close();
		db = null;
		_data = null;
		return;
		//db.execute('CREATE TABLE IF NOT EXISTS formType5 (itemId PRIMARY KEY NOT NULL UNIQUE ON CONFLICT REPLACE, tagJobId, repsonseToAcceptBool, details, quantity)');
	};
	this.saveForm2 = function(data) {

		var _data = data, db = Titanium.Database.open('mobile');
		Ti.API.info('@@@ SQL DEBUG saveForm2 @@@: _data: ' + JSON.stringify(_data));
		db.execute('delete from formType2 where tagJobId = "' + _data.tagJobId + '" and  fieldId = "' + _data.fieldId + '" ; ');
		db.execute('INSERT OR REPLACE INTO formType2(tagJobId, fieldId, response, age) VALUES (?, ?, ?, ?)', _data.tagJobId, _data.fieldId, _data.response, new Date().valueOf());
		db.close();
		db = null;
		_data = null;
		return;
		//db.execute('CREATE TABLE IF NOT EXISTS formType2 (id integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, tagJobId, fieldId, response, UNIQUE(tagJobId, fieldId, response) ON CONFLICT REPLACE)');
	};
	this.saveForm4 = function(data) {
		var _data = data, db = Titanium.Database.open('mobile');
		Ti.API.info('@@@ SQL DEBUG saveForm4 @@@: _data: ' + JSON.stringify(_data));
		db.execute('delete from formType4 where tagJobId = "' + _data.tagJobId + '" and  fieldId = "' + _data.fieldId + '" ; ');
		db.execute('INSERT OR REPLACE INTO formType4(tagJobId, fieldId, response, age) VALUES (?, ?, ?, ?)', _data.tagJobId, _data.fieldId, _data.response, new Date().valueOf());
		db.close();
		db = null;
		_data = null;
		return;
		//db.execute('CREATE TABLE IF NOT EXISTS formType2 (id integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, tagJobId, fieldId, response, UNIQUE(tagJobId, fieldId, response) ON CONFLICT REPLACE)');
	};
	this.updateTracking = function(value) {
		var _value = value, db = Titanium.Database.open('mobile');
		Ti.API.info('@@@ SQL DEBUG updateTracking @@@: value : ' + _value);
		try {

			db.execute('UPDATE user SET track = "' + _value + '" where username = "' + Ti.App.username + '";');
			Ti.App.track = _value;
		} catch(err) {

		}

		db.close();
		db = null;
		_value = null;
		return;
		//db.execute('CREATE TABLE IF NOT EXISTS formType2 (id integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, tagJobId, fieldId, response, UNIQUE(tagJobId, fieldId, response) ON CONFLICT REPLACE)');
	};
	this.deleteTheJobs = function(controlNumber) {
		var db = Titanium.Database.open('mobile');
		db.execute('delete from jobs where controlNumber = "' + controlNumber + '";');
		db.execute('delete from schedule where  controlNumber = "' + controlNumber + '";');
		db.close();
		db = null;
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

module.exports = DataBase;
