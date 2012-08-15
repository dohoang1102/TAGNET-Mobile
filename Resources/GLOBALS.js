function GLOBALS() {
	//var that = _obj;
	var _obj = {};
	//var GLOBALS = GLOBALS || {};
	var db = Titanium.Database.open('mobile');
	if (!Ti.App.username) {

		var selectFromUser = db.execute('select * from user');
		if (selectFromUser.rowCount > 0) {
			Ti.API.info('@@@ SQL DEBUG @@@ Rows Detected In User Table');
			_obj.loggedIn = true;
			_obj.username = selectFromUser.fieldByName('username');
			Ti.App.username = _obj.username;

			_obj.password = selectFromUser.fieldByName('password');
			_obj.longitude = selectFromUser.fieldByName('longitude');
			_obj.latitude = selectFromUser.fieldByName('latitude');
			_obj.location = selectFromUser.fieldByName('location');
			_obj.available = selectFromUser.fieldByName('available');
			Ti.App.track = selectFromUser.fieldByName('track');
		} else {
			Ti.API.info('@@@ SQL DEBUG @@@ No Rows In User Table');
			_obj.loggedIn = false;
			Ti.App.track = 'true';
		}
		Ti.App.loggedIn = _obj.loggedIn;

		selectFromUser.close();

	} else {
		Ti.App.track = 'true';
	}

	var evSelect = db.execute('select * from enviroment');
	if (evSelect.rowCount > 0) {
		_obj.screenHeight = evSelect.fieldByName('platHeight');
		_obj.screenWidth = evSelect.fieldByName('platWidth');

	} else {
		// Height at load time, in pixels
		_obj.screenHeight = Titanium.Platform.displayCaps.platformHeight;
		// Width at load time, in pixels
		_obj.screenWidth = Titanium.Platform.displayCaps.platformWidth;
	}

	evSelect.close();
	db.close();
	db = null;
	_obj.version = Ti.App.version;
	//Ti.API.info("Ti.Platform.osname: " + Ti.Platform.osname);
	if (Ti.Platform.osname === 'android') {
		_obj.os = 'android';
	} else {
		_obj.os = 'ios';
	}

	if (_obj.screenHeight >= 300 && _obj.screenHeight <= 480) {
		_obj.sigPad = 'sig_Phone.html';
		_obj.tablet = false;
		_obj.iconSize = 96;
		_obj.medIconSize = 48;
		_obj.smallIconSize = 32;
		_obj.xSmallIconSize = 24;
		_obj.rowHeight = 300;
		_obj.fieldHeight = 40;
		_obj.loginIcon = 'img/Contact-64.png';
		_obj.loginIconSelected = 'img/Contact-64Selected.png';
		_obj.backIcon = 'img/Back-64.png';
		_obj.backIconSelected = 'img/Back-64Selected.png';
		_obj.openIcon = 'img/Clock-128.png';
		_obj.openIconSelected = 'img/Clock-128Selected.png';
		_obj.alertIcon = 'img/E-Mail-128.png';
		_obj.alertIconSelected = 'img/E-Mail-128Selected.png';
		_obj.historyIcon = 'img/Scanner-128.png';
		_obj.historyIconSelected = 'img/Scanner-128Selected.png';
		_obj.agendaIcon = 'img/3D-Design-Alt-128.png';
		_obj.agendaIconSelected = 'img/3D-Design-Alt-128Selected.png';
		_obj.optionsIcon = 'img/Wrench-48.png';
		_obj.optionsIconSelected = 'img/Wrench-48Selected.png';
		_obj.syncIcon = 'img/Sync-48.png';
		_obj.syncIconSelected = 'img/Sync-48Selected.png';
		_obj.trackIcon = 'img/Track-48.png';
		_obj.updateIcon = 'img/Update-64.png';
		_obj.updateIconSelected = 'img/Update-64Selected.png';
		_obj.cameraIcon = 'img/Camera-64.png';
		_obj.cameraIconSelected = 'img/Camera-64Selected.png';
		_obj.moreIcon = 'img/More-64.png';
		_obj.moreIconSelected = 'img/More-64Selected.png';
		_obj.helpIcon = 'img/Help-32.png';
		_obj.badgeTop = '-65%';
		_obj.largeFont = {
			fontSize : 18,
			fontWeight : 'bold'
		};
		_obj.font = {
			fontSize : 14,
			fontWeight : 'bold'
		};
		_obj.smallFont = {
			fontSize : 12,
			fontWeight : 'bold'
		};
		_obj.xSmallFont = {
			fontSize : 10,
			fontWeight : 'bold'
		};
	} else if (_obj.screenHeight >= 481 && _obj.screenHeight <= 799) {
		_obj.sigPad = 'sig_Phone.html';
		_obj.tablet = false;
		_obj.iconSize = 128;
		_obj.medIconSize = 64;
		_obj.smallIconSize = 48;
		_obj.xSmallIconSize = 32;
		_obj.rowHeight = 300;
		_obj.fieldHeight = 50;
		_obj.loginIcon = 'img/Contact-64.png';
		_obj.loginIconSelected = 'img/Contact-64Selected.png';
		_obj.backIcon = 'img/Back-64.png';
		_obj.backIconSelected = 'img/Back-64Selected.png';
		_obj.openIcon = 'img/Clock-128.png';
		_obj.openIconSelected = 'img/Clock-128Selected.png';
		_obj.alertIcon = 'img/E-Mail-128.png';
		_obj.alertIconSelected = 'img/E-Mail-128Selected.png';
		_obj.historyIcon = 'img/Scanner-128.png';
		_obj.historyIconSelected = 'img/Scanner-128Selected.png';
		_obj.agendaIcon = 'img/3D-Design-Alt-128.png';
		_obj.agendaIconSelected = 'img/3D-Design-Alt-128Selected.png';
		_obj.optionsIcon = 'img/Wrench-48.png';
		_obj.optionsIconSelected = 'img/Wrench-48Selected.png';
		_obj.syncIcon = 'img/Sync-48.png';
		_obj.syncIconSelected = 'img/Sync-48Selected.png';
		_obj.trackIcon = 'img/Track-48.png';
		_obj.updateIcon = 'img/Update-64.png';
		_obj.updateIconSelected = 'img/Update-64Selected.png';
		_obj.cameraIcon = 'img/Camera-64.png';
		_obj.cameraIconSelected = 'img/Camera-64Selected.png';
		_obj.moreIcon = 'img/More-64.png';
		_obj.moreIconSelected = 'img/More-64Selected.png';
		_obj.helpIcon = 'img/Help-32.png';
		_obj.badgeTop = '-65%';
		_obj.largeFont = {
			fontSize : 36,
			fontWeight : 'bold'
		};
		_obj.font = {
			fontSize : 24,
			fontWeight : 'bold'
		};
		_obj.smallFont = {
			fontSize : 14,
			fontWeight : 'bold'
		};
		_obj.xSmallFont = {
			fontSize : 12,
			fontWeight : 'bold'
		};
	} else if (_obj.screenHeight >= 800 && _obj.screenHeight <= 960) {
		_obj.sigPad = 'sig_Phone.html';
		_obj.tablet = false;
		_obj.iconSize = 128;
		_obj.medIconSize = 96;
		_obj.smallIconSize = 64;
		_obj.xSmallIconSize = 48;
		_obj.rowHeight = 500;
		_obj.fieldHeight = 65;
		_obj.loginIcon = 'img/Contact-64.png';
		_obj.loginIconSelected = 'img/Contact-64Selected.png';
		_obj.backIcon = 'img/Back-64.png';
		_obj.backIconSelected = 'img/Back-64Selected.png';
		_obj.openIcon = 'img/Clock-128.png';
		_obj.openIconSelected = 'img/Clock-128Selected.png';
		_obj.alertIcon = 'img/E-Mail-128.png';
		_obj.alertIconSelected = 'img/E-Mail-128Selected.png';
		_obj.historyIcon = 'img/Scanner-128.png';
		_obj.historyIconSelected = 'img/Scanner-128Selected.png';
		_obj.agendaIcon = 'img/3D-Design-Alt-128.png';
		_obj.agendaIconSelected = 'img/3D-Design-Alt-128Selected.png';
		_obj.optionsIcon = 'img/Wrench-48.png';
		_obj.optionsIconSelected = 'img/Wrench-48Selected.png';
		_obj.syncIcon = 'img/Sync-48.png';
		_obj.syncIconSelected = 'img/Sync-48Selected.png';
		_obj.trackIcon = 'img/Track-48.png';
		_obj.updateIcon = 'img/Update-64.png';
		_obj.updateIconSelected = 'img/Update-64Selected.png';
		_obj.cameraIcon = 'img/Camera-64.png';
		_obj.cameraIconSelected = 'img/Camera-64Selected.png';
		_obj.moreIcon = 'img/More-64.png';
		_obj.moreIconSelected = 'img/More-64Selected.png';
		_obj.helpIcon = 'img/Help-48.png';
		_obj.badgeTop = '-55%';
		_obj.largeFont = {
			fontSize : 36,
			fontWeight : 'bold'
		};
		_obj.font = {
			fontSize : 24,
			fontWeight : 'bold'
		};
		_obj.smallFont = {
			fontSize : 18,
			fontWeight : 'bold'
		};
		_obj.xSmallFont = {
			fontSize : 16,
			fontWeight : 'bold'
		};
	} else if (_obj.screenHeight >= 961 && _obj.screenHeight <= 1199) {
		_obj.sigPad = 'sig_Phone.html';
		_obj.tablet = false;
		_obj.iconSize = 128;
		_obj.medIconSize = 64;
		_obj.smallIconSize = 48;
		_obj.xSmallIconSize = 32;
		_obj.rowHeight = 600;
		_obj.fieldHeight = 85;
		_obj.loginIcon = 'img/Contact-64.png';
		_obj.loginIconSelected = 'img/Contact-64Selected.png';
		_obj.backIcon = 'img/Back-64.png';
		_obj.backIconSelected = 'img/Back-64Selected.png';
		_obj.openIcon = 'img/Clock-128.png';
		_obj.openIconSelected = 'img/Clock-128Selected.png';
		_obj.alertIcon = 'img/E-Mail-128.png';
		_obj.alertIconSelected = 'img/E-Mail-128Selected.png';
		_obj.historyIcon = 'img/Scanner-128.png';
		_obj.historyIconSelected = 'img/Scanner-128Selected.png';
		_obj.agendaIcon = 'img/3D-Design-Alt-128.png';
		_obj.agendaIconSelected = 'img/3D-Design-Alt-128Selected.png';
		_obj.optionsIcon = 'img/Wrench-48.png';
		_obj.optionsIconSelected = 'img/Wrench-48Selected.png';
		_obj.syncIcon = 'img/Sync-48.png';
		_obj.syncIconSelected = 'img/Sync-48Selected.png';
		_obj.trackIcon = 'img/Track-48.png';
		_obj.updateIcon = 'img/Update-64.png';
		_obj.updateIconSelected = 'img/Update-64Selected.png';
		_obj.cameraIcon = 'img/Camera-64.png';
		_obj.cameraIconSelected = 'img/Camera-64Selected.png';
		_obj.moreIcon = 'img/More-64.png';
		_obj.moreIconSelected = 'img/More-64Selected.png';
		_obj.helpIcon = 'img/Help-48.png';
		_obj.badgeTop = '-65%';
		_obj.largeFont = {
			fontSize : 42,
			fontWeight : 'bold'
		};
		_obj.font = {
			fontSize : 32,
			fontWeight : 'bold'
		};
		_obj.smallFont = {
			fontSize : 24,
			fontWeight : 'bold'
		};
		_obj.xSmallFont = {
			fontSize : 16,
			fontWeight : 'bold'
		};
	} else {
		_obj.sigPad = 'sig_Tablet.html';
		_obj.tablet = true;
		_obj.iconSize = 256;
		_obj.medIconSize = 128;
		_obj.smallIconSize = 96;
		_obj.xSmallIconSize = 64;
		_obj.rowHeight = 800;
		_obj.fieldHeight = 95;
		_obj.loginIcon = 'img/Contact-128.png';
		_obj.loginIconSelected = 'img/Contact-128Selected.png';
		_obj.backIcon = 'img/Back-128.png';
		_obj.backIconSelected = 'img/Back-128Selected.png';
		_obj.openIcon = 'img/Clock-256.png';
		_obj.openIconSelected = 'img/Clock-256Selected.png';
		_obj.alertIcon = 'img/E-Mail-256.png';
		_obj.alertIconSelected = 'img/E-Mail-256Selected.png';
		_obj.historyIcon = 'img/Scanner-256.png';
		_obj.historyIconSelected = 'img/Scanner-256Selected.png';
		_obj.agendaIcon = 'img/3D-Design-Alt-256.png';
		_obj.agendaIconSelected = 'img/3D-Design-Alt-256Selected.png';
		_obj.optionsIcon = 'img/Wrench-128.png';
		_obj.optionsIconSelected = 'img/Wrench-128Selected.png';
		_obj.syncIcon = 'img/Sync-128.png';
		_obj.syncIconSelected = 'img/Sync-128Selected.png';
		_obj.trackIcon = 'img/Track-128.png';
		_obj.updateIcon = 'img/Update-128.png';
		_obj.updateIconSelected = 'img/Update-128Selected.png';
		_obj.cameraIcon = 'img/Camera-128.png';
		_obj.cameraIconSelected = 'img/Camera-128Selected.png';
		_obj.moreIcon = 'img/More-128.png';
		_obj.moreIconSelected = 'img/More-128Selected.png';
		_obj.helpIcon = 'img/Help-48.png';
		_obj.badgeTop = '-70%';
		_obj.largeFont = {
			fontSize : 48,
			fontWeight : 'bold'
		};
		_obj.font = {
			fontSize : 42,
			fontWeight : 'bold'
		};
		_obj.smallFont = {
			fontSize : 28,
			fontWeight : 'bold'
		};
		_obj.xSmallFont = {
			fontSize : 24,
			fontWeight : 'bold'
		};
	}
	Ti.App.addEventListener('setUserPassword', function(e) {
		_obj.username = e.username;
		_obj.password = e.password;
	});
	db = null;
	selectFromUser = null;
	evSelect = null;
	return _obj;
}

module.exports = GLOBALS;
