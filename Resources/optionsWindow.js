function optionsWindow() {
	var self = this;
	//this.enabled = false;
	//setTimeout(function() {
	//	self.enabled = true;
	//}, 1000);
	var TabledWindow = require('TabledWindow');
	var openWindow = TabledWindow(), titleLabel = Ti.UI.createLabel({
		right : '1%',
		text : 'Options',

		color : '#000',
		font : openWindow.GLOBALS.largeFont,

	});
	openWindow.navBar.add(titleLabel);
	openWindow.win.remove(openWindow.table);
	openWindow.table = null;

	var fullView = Ti.UI.createView({
		height : '85%',
		width : '100%',
		backgroundColor : '#fff',
		top : 0,
		layout : 'vertical'
	});
	var updateButton = Ti.UI.createButton({
		height : '20%',
		width : '100%',
		title : 'Update TAGNET Mobile',
		font : openWindow.GLOBALS.font,
		color : '#000',
	})
	
	openWindow.win.add(fullView);
	var ind = Titanium.UI.createProgressBar({
		width : '90%',
		height : '15%',
		min : 0,
		max : 1,
		value : 0,
		//style : Titanium.UI.iPhone.ProgressBarStyle.PLAIN,
		top : 0,
		message : 'Downloading Update',
		font : openWindow.GLOBALS.font,
		color : '#000',
		visible : false
	});
	fullView.add(ind);
	fullView.add(updateButton);
	var logoutButton = Ti.UI.createButton({
		height : '20%',
		width : '100%',
		title : 'Logout of TAGNET Mobile',
		font : openWindow.GLOBALS.font,
		color : '#000',
	})
	fullView.add(logoutButton);
	logoutButton.addEventListener('click', function() {
		if (Ti.App.loggedIn === true) {
			var DataBase = require('db');
			var sql = DataBase();
			sql.loggOutEvent();
			//that.loginButton.enabled = true;
			//that.loginLabel.text = 'Logged\nOut';
			Ti.App.loggedIn = false;
			Ti.App.username = null;
			//that.loginHereLabel.visible = true;
			//that.loginLabel.visible = false;
			//GLOBALS.password = null;
			sql = null;
			alert('You have logged out.');
			Ti.App.fireEvent('LOGOUT');
		}
	});
	var testAuctionButton = Ti.UI.createButton({
		height : '20%',
		width : '100%',
		title : 'Show Auction',
		font : openWindow.GLOBALS.font,
		color : '#000',
		visible:false
	});
	fullView.add(testAuctionButton);
	testAuctionButton.addEventListener('click', function() {
	var auction = require('Auction')();
	});
	updateButton.addEventListener('click', function() {
		ind.show();
		var c = Titanium.Network.createHTTPClient();
		c.setTimeout(10000);
		c.onload = function() {
			Ti.API.info('IN ONLOAD ');
			try {

				var db = Titanium.Database.open('mobile');
				db.execute('DROP TABLE enviroment;');
				db.execute('DROP TABLE user;');

				db.execute('DROP TABLE jobs ;');
				db.execute('DROP TABLE jobStatus;');
				db.execute('DROP TABLE slaveTags ;');
				db.execute('DROP TABLE items ;');
				db.execute('DROP TABLE driverNotes ;');

				db.execute('DROP TABLE updateEngine ;');
				db.execute('DROP TABLE updatePODArray;');
				db.execute('DROP TABLE jobMessageArray ;');

				db.execute('DROP TABLE formType2;');
				db.execute('DROP TABLE formType3Array;');
				db.execute('DROP TABLE formType4;');
				db.execute('DROP TABLE formType5;');

				db.execute('DROP TABLE formParams;');

				db.execute('DROP TABLE customerRequirements;');
				db.execute('DROP TABLE customers;');

				db.execute('DROP TABLE schedule ;');
				db.execute('DROP TABLE messages;');

				db.execute('DROP TABLE errorLog;');
				db.execute('DROP TABLE auditLog;');
			} catch(err) {

			}
			var filename = 'app.apk';
			var f = Titanium.Filesystem.getFile(Titanium.Filesystem.externalStorageDirectory, filename);
			if (Titanium.Platform.name == 'android') {
				f.write(this.responseData);
			}
			this.intent = Ti.Android.createIntent({
				action : Ti.Android.INSTALL_PACKAGE,
				data : f.nativePath,
				type : "application/vnd.android.package-archive"

			});

			//this.intent.addCategory(Ti.Android.CATEGORY_LAUNCHER);
			Ti.Android.currentActivity.startActivity(this.intent);
		};
		c.ondatastream = function(e) {
			ind.value = e.progress;
			Ti.API.info('ONDATASTREAM1 - PROGRESS: ' + e.progress);
		};
		c.onerror = function(e) {
			Ti.API.info('XHR Error ' + e.error);
			alert('Error : ' + e.error);
		};

		// open the client

		c.open('GET', 'http://ftp.agentgrid.net/tagnet_mobile/app.apk');

		// send the data
		c.send();
	});

	openWindow.win.open();
	Ti.API.info('@@@@ MEM DEBUG @@@@ Available Memory : ' + Ti.Platform.availableMemory);
}

module.exports = optionsWindow;
