var UPDATE = function() {
	
	Ti.API.warn(parseFloat(Ti.App.version));
	var currentVersion = parseFloat(Ti.App.version);
	var xhr = Ti.Network.createHTTPClient();

	xhr.setTimeout(10000);

	xhr.onload = function() {
		Ti.API.info('@@@ XHR DEBUG @@@ response : ' + this.responseText);
		if (this.responseText === 'true' || this.responseText === true) {
			prompt();
		} else {
			xhr = null;
			return;
		}
		xhr = null;
	}
	xhr.onerror = function(e) {
		Ti.API.info('@@@ XHR ERROR @@@ : ' + e.error);
		return false;
	}
	xhr.open("GET", "http://ftp.agentgrid.net:3000/version/" + currentVersion);
	//xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
	xhr.send();
};

function prompt() {
	var opts = {
		cancel : 1,
		options : ['Confirm', 'Cancel'],
		selectedIndex : 0,
		destructive : 1,
		title : 'New version available, would you like to update?'
	};
	var dialog = Ti.UI.createOptionDialog(opts);
	dialog.show();
	var activityIndicator = Ti.UI.createActivityIndicator({
		color : 'green',
		font : {
			fontFamily : 'Helvetica Neue',
			fontSize : 26,
			fontWeight : 'bold'
		},
		message : 'Download In Progress...',
		//style : Ti.UI.iPhone.ActivityIndicatorStyle.DARK,
		top : 10,
		left : 10,
		height : 'auto',
		width : 'auto'
	});

	dialog.addEventListener('click', function(e) {
		if (e.index === 0) {
			var InitGlobals = require('SlimGlobals');
			var GLOBALS = InitGlobals();
			var win = Ti.UI.createWindow({
				height : '100%',
				width : '100%',
				zIndex : 99,
				backgroundColor : '#000',
				top : '-85%'
			});
			var label = Ti.UI.createLabel({
				text : 'When download is complete, please use "Package Installer" to install the app.',
				font : GLOBALS.largeFont,
				top : '10%'
			});
			var ind = Titanium.UI.createProgressBar({
				width : '90%',
				height : '15%',
				min : 0,
				max : 1,
				value : 0,
				//style : Titanium.UI.iPhone.ProgressBarStyle.PLAIN,
				//top : 10,
				message : 'Downloading Update',
				//font : openWindow.GLOBALS.font,
				color : '#000',
				visible : true
			});
			win.add(label);
			win.add(ind);
			win.open();

			//activityIndicator.show();
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
				//activityIndicator.hide();
				//this.intent.addCategory(Ti.Android.CATEGORY_LAUNCHER);
				win.close();
				Ti.Android.currentActivity.startActivity(this.intent);
			};
			c.ondatastream = function(e) {
				ind.value = e.progress;
				Ti.API.info('ONDATASTREAM1 - PROGRESS: ' + e.progress);
			};
			c.onerror = function(e) {
				//activityIndicator.hide();
				Ti.API.info('XHR Error ' + e.error);
				alert('Error : ' + e.error);
				win.close();
			};

			// open the client

			c.open('GET', 'http://ftp.agentgrid.net/tagnet_mobile/app.apk');

			// send the data
			c.send();
		} else {
			return;
		}
	});

}

module.exports = UPDATE();
