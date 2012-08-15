function InitDb() {
//	var auditFire = require('PostToAuditService');
	var db, that = this;
	this.db = Titanium.Database.open('mobile');
	db = this.db;
	db.execute('CREATE TABLE IF NOT EXISTS enviroment (guid PRIMARY KEY NOT NULL UNIQUE, lastDownload, lastUpdate, lastError, dbVersion, appVersion, platWidth, platHeight)');
	db.execute('CREATE TABLE IF NOT EXISTS user (id integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, username UNIQUE, password, longitude, latitude, location, available, idpSignature text, track)');

	db.execute('CREATE TABLE IF NOT EXISTS jobs (id PRIMARY KEY NOT NULL UNIQUE, companyNumber, controlNumber UNIQUE, serviceType,  bol, orderedBy, vehType, puAtReqArriveTime, dlAtReqArriveTime, pieces, weight, puAtName, puAtAddress, puAtRFD, puAtCity, puAtZip, puAtAttn, dlToName, dlToAddress, dlToRFD, dlToCity, dlToZip, dlToAttn, puAtSpecInst, dlToSpecInst, reference, puAtPhone, dlToPhone, pay, lastupdate, customerType, customerNumber, sortDate, username, isAccepted, brand, age INTEGER)');
	db.execute('CREATE TABLE IF NOT EXISTS jobStatus (id PRIMARY KEY NOT NULL UNIQUE, puComplete, puRequired,  dlComplete, dlRequired, formsComplete, isForms, puRefuse, dlRefused, age INTEGER)');
	db.execute('CREATE TABLE IF NOT EXISTS slaveTags (slaveTagJobId PRIMARY KEY NOT NULL UNIQUE ON CONFLICT REPLACE, masterTagJobId, companyNumber, controlNumber, items, weight, age INTEGER)');
	db.execute('CREATE TABLE IF NOT EXISTS items (itemId PRIMARY KEY NOT NULL UNIQUE ON CONFLICT REPLACE, tagJobId, description, quantity, age INTEGER)');
	db.execute('CREATE TABLE IF NOT EXISTS driverNotes (id integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, tagJobId, noteAuthorUserId,  userNoteCode, auditNoteCode, note, enteredDateTime, age INTEGER, UNIQUE(tagJobId, note) ON CONFLICT REPLACE)');

	db.execute('CREATE TABLE IF NOT EXISTS updateEngine (id integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, updateId, type, age INTEGER)');
	db.execute('CREATE TABLE IF NOT EXISTS updatePODArray (id integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, tagJobId UNIQUE, companyNumber, controlNumber UNIQUE, puComplete, dlComplete, dlRefuse, dlRefusalReason, dlActualArriveDateTime, dlActualDepartDateTime, dlPODFullName, dlSignatureBase64, dlWaitTime, puRefuse, puRefusalReason, puActualArriveDateTime, puActualDepartDateTime, puPODFullName, puSignatureBase64, weight, pieces, formsComplete, puEmail, dlEmail, puCustomerInitials, dlCustomerInitials, puEntered, dlEntered, age INTEGER)');
	db.execute('CREATE TABLE IF NOT EXISTS jobMessageArray (id integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, alertId UNIQUE, companyNumber, controlNumber, tagJobId, type text, messageText, enteredDateTime, responseBoolean, responseDateTime, puEstimateDateTime, dlEstimateDateTime, dlEstimateEntered, puEstimateEntered, age INTEGER, UNIQUE(controlNumber, type) ON CONFLICT REPLACE)');

	db.execute('CREATE TABLE IF NOT EXISTS formType2 (id integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, tagJobId, fieldId, response, age INTEGER, UNIQUE(tagJobId, fieldId) ON CONFLICT REPLACE )');
	db.execute('CREATE TABLE IF NOT EXISTS formType3Array (id integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, tagJobId, article, conditionReceived, conditionDelivered, additionalNote, age INTEGER)');
	db.execute('CREATE TABLE IF NOT EXISTS formType4 (id integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, tagJobId, fieldId, response, age INTEGER, UNIQUE(tagJobId, fieldId, response) ON CONFLICT REPLACE)');
	db.execute('CREATE TABLE IF NOT EXISTS formType5 (itemId PRIMARY KEY NOT NULL UNIQUE ON CONFLICT REPLACE, tagJobId, repsonseToAcceptBool, details, quantity, age INTEGER)');

	db.execute('CREATE TABLE IF NOT EXISTS formParams (id integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, fieldType, fieldDescription, responsible, required, fieldId integer, formId integer, UNIQUE(fieldId, formId) ON CONFLICT REPLACE)');

	db.execute('CREATE TABLE IF NOT EXISTS customerRequirements ( id integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, customerNumber, companyNumber, puRequired, puFlag, puValue, dlRequired, dlFlag, dlValue, slave, UNIQUE(customerNumber, companyNumber) ON CONFLICT REPLACE)');
	db.execute('CREATE TABLE IF NOT EXISTS customers ( id integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, customerNumber, companyNumber , formId, departFlag, UNIQUE(customerNumber, companyNumber , formId) ON CONFLICT REPLACE)');

	db.execute('CREATE TABLE IF NOT EXISTS schedule (id integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, controlNumber, puEstEnteredTime, puEstimateTimeStamp, dlEstimateTime, dlEstEnteredTime, tagJobId, sortDate, username, age INTEGER)');
	db.execute('CREATE TABLE IF NOT EXISTS messages (id PRIMARY KEY NOT NULL UNIQUE, companyNumber, controlNumber, enteredDateTime, messageText, responseBoolean, tagJobId, type, username, sortDate, age INTEGER)');
	db.execute('CREATE TABLE IF NOT EXISTS auctions (id PRIMARY KEY NOT NULL UNIQUE, age INTEGER)');

	db.execute('CREATE TABLE IF NOT EXISTS errorLog(id integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, user, time, error, location, age INTEGER)');
	db.execute('CREATE TABLE IF NOT EXISTS auditLog(id integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, user, time, data, location, age INTEGER)');

	/*
	 *
	 * Buid Defaults
	 *
	 */

	db.execute("INSERT OR REPLACE INTO formParams (`fieldId`,`formId`,`fieldDescription`,`fieldType`,`responsible`,`required`) VALUES (3, 2, 'Upon inspecting of the packaging was there any damage to the packaging?','checkbox','customer','yes')");

	db.execute("INSERT OR REPLACE INTO formParams (`fieldId`,`formId`,`fieldDescription`,`fieldType`,`responsible`,`required`) VALUES (4, 2, 'Did the delivery team unpack the shipment?','checkbox','customer','yes')");

	db.execute("INSERT OR REPLACE INTO formParams (`fieldId`,`formId`,`fieldDescription`,`fieldType`,`responsible`,`required`) VALUES (5, 2, 'Upon inspecting of the shipment after packaging removal, was there any damage to the shipment?','checkbox','customer','yes')");

	db.execute("INSERT OR REPLACE INTO formParams (`fieldId`,`formId`,`fieldDescription`,`fieldType`,`responsible`,`required`) VALUES (6, 2, 'Was the shipment placed in the location of your choice?','checkbox','customer','yes')");

	db.execute("INSERT OR REPLACE INTO formParams (`fieldId`,`formId`,`fieldDescription`,`fieldType`,`responsible`,`required`) VALUES (7, 2, 'Did the delivery team perform product assembly to your satisfaction?','checkbox','customer','yes')");

	db.execute("INSERT OR REPLACE INTO formParams (`fieldId`,`formId`,`fieldDescription`,`fieldType`,`responsible`,`required`) VALUES (8, 2,'Was there any damage to your residence caused by the delivery team?','checkbox','customer','yes')");

	db.execute("INSERT OR REPLACE INTO formParams (`fieldId`,`formId`,`fieldDescription`,`fieldType`,`responsible`,`required`) VALUES (9, 2,'Did the delivery team remove and dispose of the packaging and debris?','checkbox','customer','yes')");

	db.execute("INSERT OR REPLACE INTO formParams (`fieldId`,`formId`,`fieldDescription`,`fieldType`,`responsible`,`required`) VALUES (10, 2,'Are you missing any portion of your order?','checkbox','customer','yes')");

	db.execute("INSERT OR REPLACE INTO formParams (`fieldId`,`formId`,`fieldDescription`,`fieldType`,`responsible`,`required`) VALUES (11, 2,'Note damage to packaging, shipment or residence below','textfield','customer','yes')");

	/*
	 * Refusal form
	 *
	 */
	db.execute("INSERT OR REPLACE INTO formParams (`fieldId`,`formId`,`fieldDescription`,`fieldType`,`responsible`,`required`) VALUES (24, 2,'Merchandise Quality / Value','checkbox','refuse','no')");

	db.execute("INSERT OR REPLACE INTO formParams (`fieldId`,`formId`,`fieldDescription`,`fieldType`,`responsible`,`required`) VALUES (25, 2,'Size, Color, Style, Finish Issue','checkbox','refuse','no')");

	db.execute("INSERT OR REPLACE INTO formParams (`fieldId`,`formId`,`fieldDescription`,`fieldType`,`responsible`,`required`) VALUES (26, 2,'Damage / Missing Item:','checkbox','refuse','no')");

	db.execute("INSERT OR REPLACE INTO formParams (`fieldId`,`formId`,`fieldDescription`,`fieldType`,`responsible`,`required`) VALUES (27, 2,'Refusal/Refusal of service comments:','textfield','refuse','no')");

	/*
	 *
	 *
	 * HD USA
	 *
	 *
	 */
	db.execute("INSERT OR REPLACE INTO customers (`customerNumber`, `companyNumber`, `formId`, `departFlag`) VALUES (10000, 1, 2, \"true\")");

	db.execute("INSERT OR REPLACE INTO customers (`customerNumber`, `companyNumber`, `formId`, `departFlag`) VALUES (10000, 1, 3, \"true\")");

	db.execute("INSERT OR REPLACE INTO customers (`customerNumber`, `companyNumber`, `formId`, `departFlag`) VALUES (10001, 1, 2, \"true\")");

	db.execute("INSERT OR REPLACE INTO customers (`customerNumber`, `companyNumber`, `formId`, `departFlag`) VALUES (10001, 1, 3, \"true\")");

	db.execute("INSERT OR REPLACE INTO customers (`customerNumber`, `companyNumber`, `formId`, `departFlag`) VALUES (10002, 1, 2, \"true\")");

	db.execute("INSERT OR REPLACE INTO customers (`customerNumber`, `companyNumber`, `formId`, `departFlag`) VALUES (10002, 1, 3, \"true\")");

	/*
	 *
	 * Dania
	 * formType4
	 *
	 */
	db.execute("INSERT OR REPLACE INTO formParams (`fieldId`,`formId`,`fieldDescription`,`fieldType`,`responsible`,`required`) VALUES (3, 4, 'Upon inspecting of the packaging was there any damage to the packaging?','checkbox','customer','yes')");

	db.execute("INSERT OR REPLACE INTO formParams (`fieldId`,`formId`,`fieldDescription`,`fieldType`,`responsible`,`required`) VALUES (4, 4, 'Did the delivery team unpack the shipment?','checkbox','customer','yes')");

	db.execute("INSERT OR REPLACE INTO formParams (`fieldId`,`formId`,`fieldDescription`,`fieldType`,`responsible`,`required`) VALUES (5, 4, 'Upon inspecting of the shipment after packaging removal, was there any damage to the shipment?','checkbox','customer','yes')");

	db.execute("INSERT OR REPLACE INTO formParams (`fieldId`,`formId`,`fieldDescription`,`fieldType`,`responsible`,`required`) VALUES (6, 4, 'Was the shipment placed in the location of your choice?','checkbox','customer','yes')");

	db.execute("INSERT OR REPLACE INTO formParams (`fieldId`,`formId`,`fieldDescription`,`fieldType`,`responsible`,`required`) VALUES (7, 4, 'Did the delivery team perform product assembly to your satisfaction?','checkbox','customer','yes')");

	db.execute("INSERT OR REPLACE INTO formParams (`fieldId`,`formId`,`fieldDescription`,`fieldType`,`responsible`,`required`) VALUES (8, 4, 'Was there any damage to your residence caused by the delivery team?','checkbox','customer','yes')");

	db.execute("INSERT OR REPLACE INTO formParams (`fieldId`,`formId`,`fieldDescription`,`fieldType`,`responsible`,`required`) VALUES (9, 4,'Did the delivery team remove and dispose of the packaging and debris?','checkbox','customer','yes')");

	db.execute("INSERT OR REPLACE INTO formParams (`fieldId`,`formId`,`fieldDescription`,`fieldType`,`responsible`,`required`) VALUES (10, 4,'Are you missing any portion of your order?','checkbox','customer','yes')");

	db.execute("INSERT OR REPLACE INTO formParams (`fieldId`,`formId`,`fieldDescription`,`fieldType`,`responsible`,`required`) VALUES (11, 4,'Note damage to packaging, shipment or residence below','textfield','customer','yes')");

	db.execute("INSERT OR REPLACE INTO customers (`customerNumber`, `companyNumber`,`formId`, `departFlag`) VALUES (30105, 12, 4, 'true')");
	db.execute("INSERT OR REPLACE INTO customers (`customerNumber`, `companyNumber`,`formId`, `departFlag`) VALUES (30177, 12, 4, 'true')");
	db.execute("INSERT OR REPLACE INTO customers (`customerNumber`, `companyNumber`,`formId`, `departFlag`) VALUES (30175, 12, 4, 'true')");
	db.execute("INSERT OR REPLACE INTO customers (`customerNumber`, `companyNumber`,`formId`, `departFlag`) VALUES (30176, 12, 4, 'true')");
	db.execute("INSERT OR REPLACE INTO customers (`customerNumber`, `companyNumber`,`formId`, `departFlag`) VALUES (30182, 12, 4, 'true')");
	db.execute("INSERT OR REPLACE INTO customers (`customerNumber`, `companyNumber`,`formId`, `departFlag`) VALUES (30183, 12, 4, 'true')");
	db.execute("INSERT OR REPLACE INTO customers (`customerNumber`, `companyNumber`,`formId`, `departFlag`) VALUES (30180, 12, 4, 'true')");

	db.execute("INSERT OR REPLACE INTO customers (`customerNumber`, `companyNumber`,`formId`, `departFlag`) VALUES (30105, 12, 5, 'true')");
	db.execute("INSERT OR REPLACE INTO customers (`customerNumber`, `companyNumber`,`formId`, `departFlag`) VALUES (30177, 12, 5, 'true')");
	db.execute("INSERT OR REPLACE INTO customers (`customerNumber`, `companyNumber`,`formId`, `departFlag`) VALUES (30175, 12, 5, 'true')");
	db.execute("INSERT OR REPLACE INTO customers (`customerNumber`, `companyNumber`,`formId`, `departFlag`) VALUES (30176, 12, 5, 'true')");
	db.execute("INSERT OR REPLACE INTO customers (`customerNumber`, `companyNumber`,`formId`, `departFlag`) VALUES (30182, 12, 5, 'true')");
	db.execute("INSERT OR REPLACE INTO customers (`customerNumber`, `companyNumber`,`formId`, `departFlag`) VALUES (30183, 12, 5, 'true')");
	db.execute("INSERT OR REPLACE INTO customers (`customerNumber`, `companyNumber`,`formId`, `departFlag`) VALUES (30180, 12, 5, 'true')");
	
	/*
	 *
	 * customerRequirements
	 *
	 *
	 */
	db.execute('INSERT OR REPLACE into customerRequirements (customerNumber, companyNumber, puRequired, puFlag, puValue, dlRequired, slave) values (30105, 12, "false", "puAtAddress", "1350 WHARF ROAD","true", "true" )');
	db.execute('INSERT OR REPLACE into customerRequirements (customerNumber, companyNumber, puRequired, puFlag, puValue, dlRequired, slave) values (30177, 12, "false", "puAtAddress", "1350 WHARF ROAD","true", "true" )');
	db.execute('INSERT OR REPLACE into customerRequirements (customerNumber, companyNumber, puRequired, puFlag, puValue, dlRequired, slave) values (30175, 12, "false", "puAtAddress", "1350 WHARF ROAD","true", "true" )');
	db.execute('INSERT OR REPLACE into customerRequirements (customerNumber, companyNumber, puRequired, puFlag, puValue, dlRequired, slave) values (30176, 12, "false", "puAtAddress", "1350 WHARF ROAD","true", "true" )');
	db.execute('INSERT OR REPLACE into customerRequirements (customerNumber, companyNumber, puRequired, puFlag, puValue, dlRequired, slave) values (30182, 12, "false", "puAtAddress", "1350 WHARF ROAD","true", "true" )');
	db.execute('INSERT OR REPLACE into customerRequirements (customerNumber, companyNumber, puRequired, puFlag, puValue, dlRequired, slave) values (30183, 12, "false", "puAtAddress", "1350 WHARF ROAD","true" ,"true" )');
	db.execute('INSERT OR REPLACE into customerRequirements (customerNumber, companyNumber, puRequired, puFlag, puValue, dlRequired, slave) values (30180, 12, "false", "puAtAddress", "1350 WHARF ROAD","true" ,"true" )');
	db.execute('insert or replace into enviroment (guid, lastDownload, lastUpdate, dbVersion, appVersion, platWidth, platHeight) values (?, ?, ?, ?, ?, ?, ?)', Ti.App.guid, new Date(), new Date(), '1.0', Ti.App.version, Titanium.Platform.displayCaps.platformWidth, Titanium.Platform.displayCaps.platformHeight);
	/*
	 * 
	 * DISNEY
	 * 
	 * 
	 */
	db.execute("INSERT OR REPLACE INTO customers (`customerNumber`, `companyNumber`,`formId`, `departFlag`) VALUES (18888, 6, null, 'true')");
	db.close();
	db = null;
	function cleanTables() {
		var db = Titanium.Database.open('mobile');
		db.execute('BEGIN IMMEDIATE');
		var cutOff = (parseInt(new Date().valueOf()) - 432000000);
		//var cutOff = (parseInt(new Date().valueOf()) - 1);
		Ti.API.warn('CUTOFF = ' + cutOff);

		db.execute('DELETE from jobs where age < ' + cutOff + ';');
		db.execute('DELETE from jobStatus where age < ' + cutOff + ';');
		db.execute('DELETE from slaveTags where age < ' + cutOff + ';');
		db.execute('DELETE from items where age < ' + cutOff + ';');
		db.execute('DELETE from driverNotes where age < ' + cutOff + ';');
		db.execute('DELETE from updateEngine where age < ' + cutOff + ';');
		db.execute('DELETE from updatePODArray where age < ' + cutOff + ';');
		db.execute('DELETE from jobMessageArray where age < ' + cutOff + ';');
		db.execute('DELETE from formType2 where age < ' + cutOff + ';');
		db.execute('DELETE from formType3Array where age < ' + cutOff + ';');
		db.execute('DELETE from formType4 where age < ' + cutOff + ';');
		db.execute('DELETE from formType5 where age < ' + cutOff + ';');
		db.execute('DELETE from schedule where age < ' + cutOff + ';');
		db.execute('DELETE from messages where age < ' + cutOff + ';');
		db.execute('DELETE from errorLog where age < ' + cutOff + ';');
		db.execute('DELETE from auditLog where age < ' + cutOff + ';');

		db.execute('COMMIT');
		db.close();
		db = null;
	}

	function buildDebugDb() {
		var debug = Titanium.Database.open('debug');
		debug.execute('CREATE TABLE IF NOT EXISTS errorLog(id integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, user, time, error, location, age INTEGER)');
		debug.execute('CREATE TABLE IF NOT EXISTS auditLog(id integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, user, time, data, location, age INTEGER)');
		debug.close();
		return;
	}

	buildDebugDb();
	cleanTables();
	return;
}

module.exports = InitDb;
