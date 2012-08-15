function DashBoard() {
	
	var loadGlobals = require('GLOBALS');
	var GLOBALS = loadGlobals();
	
	var that = this, inbackGround = false;
	this.win = Titanium.UI.createWindow({
		title : 'TAGNET MOBILE',
		//backgroundColor : '#fff',
		backgroundImage:'road_sky_1280_800.jpeg',
		//backgroundImage: GLOBALS.mainBar,
		orientationModes : [Titanium.UI.PORTRAIT], // UI restricted to portrait mode
		fullscreen : false,
		exitOnClose : true,
		layout : 'vertical',
		height : '100%',
		navBarHidden : true
	});

	this.navBar = Ti.UI.createView({
		height : '15%',
		layout : 'absolute',
		backgroundColor:'#55ffffff',
		//backgroundImage : GLOBALS.mainBar,
		//backgroundImage : GLOBALS.mainBar,
		//borderColor:'#000',
		//borderWidth:1,
		//backgroundColor:'#fff',
		top : 0
	});
	this.loginButton = Ti.UI.createButton({
		left : 0,
		//:'6%',
		height : GLOBALS.medIconSize,
		width : GLOBALS.medIconSize,
		backgroundImage : GLOBALS.loginIcon,
		backgroundSelectedImage : GLOBALS.loginIconSelected,
		backgroundDisabledImage : GLOBALS.loginIconSelected,
		visible : true
	});
	this.loginLabel = Ti.UI.createLabel({
		left : 0,
		//text : 'Logged Out',
		//right : '1%',
		bottom : 0,
		color : '#000',
		font : GLOBALS.smallFont,
		visible : false
	});
	this.loginHereLabel = Ti.UI.createLabel({
		left : GLOBALS.medIconSize / 5,
		text : 'Login',
		//right : '1%',
		bottom : 0,
		color : '#000',
		font : GLOBALS.smallFont,
		visible : true
	});
	this.openLogin = function() {
		var self = this;
		inbackGround = false;
		this.enabled = false;
		this.touchEnabled = false;
		var LoginWindow = require('LoginWindow')();
		
		//loginWindow.win.open();
		setTimeout(function() {
			self.enabled = true;
			self.touchEnabled = true;
		}, 1000);
	}
	Ti.App.addEventListener('LOGIN', function() {
		//that.loginLabel.hide();
		that.loginHereLabel.visible = false;
		that.loginLabel.visible = true;
		that.loginLabel.text = GLOBALS.username;
		//this.loginLabel.removeEventListener('click', that.openLogin);
		//that.loginButton.hide();
		//that.loginLabel.enabled = false;
		that.loginButton.enabled = false;

	});
	Ti.App.addEventListener('LOGOUT', function() {
		//that.loginLabel.hide();
		Ti.App.loggedIn = false;
		Ti.App.username = null;

		that.loginHereLabel.visible = true;
		that.loginLabel.visible = false;
		that.loginLabel.text = 'Logged Out';
		//this.loginLabel.removeEventListener('click', that.openLogin);
		//that.loginButton.hide();
		//that.loginLabel.enabled = true;
		that.loginButton.enabled = true;
		//var service = require('StopService');

	});
	this.loginButton.addEventListener('click', this.openLogin);
	this.loginLabel.addEventListener('longpress', function() {
		inbackGround = false;
		if (Ti.App.loggedIn === true) {
			var DataBase = require('db');
			var sql = DataBase();
			sql.loggOutEvent();
			that.loginButton.enabled = true;
			that.loginLabel.text = 'Logged\nOut';
			Ti.App.loggedIn = false;
			Ti.App.username = null;
			that.loginHereLabel.visible = true;
			that.loginLabel.visible = false;
			//GLOBALS.password = null;
			sql = null;
			alert('You have logged out.');
		}
	});
	//this.loginLabel.addEventListener('click', this.openLogin);

	this.tagnetLabel = Ti.UI.createLabel({
		right : '1%',
		text : 'TAGNET Mobile',
		top : '6%',
		color : '#000',
		font : GLOBALS.largeFont,

	});
	this.versionLabel = Ti.UI.createLabel({
		right : '1%',
		bottom : '6%',
		text : 'Version: ' + GLOBALS.version,

		color : '#000',
		font : GLOBALS.smallFont,

	});
	this.navBar.add(this.loginHereLabel);
	this.navBar.add(this.loginButton);
	this.navBar.add(this.loginLabel);
	this.navBar.add(this.tagnetLabel);
	this.navBar.add(this.versionLabel);
	//this.loginLabel.addEventListener('touchstart', textColorOnClick);
	//this.loginLabel.addEventListener('touchend', textColorOffClick);
	function textColorOnClick() {
		this.color = '#C0C0C0';
	}

	function textColorOffClick() {
		this.color = '#000';
	}

	/*
	 *
	 *
	 *
	 * Top Shelf
	 *
	 *
	 *
	 */
	this.topShelf = Ti.UI.createView({
		height : '30%',
		layout : 'horizontal',
		backgroundColor:'#55ffffff'
	});
	this.leftHalf = Ti.UI.createView({
		height : '100%',
		width : '50%',
		left : 0,
		layout : 'vertical',
		badge : false
	});
	this.openBadge = Ti.UI.createButton({
		top : '5%',
		height : GLOBALS.iconSize,
		width : GLOBALS.iconSize,
		backgroundImage : GLOBALS.openIcon,
		backgroundSelectedImage : GLOBALS.openIconSelected,
		backgroundDisabledImage : GLOBALS.openIconSelected
	});
	this.openLabel = Ti.UI.createLabel({
		text : 'Open Jobs',
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		color : '#000',
		font : GLOBALS.font,

	});
	this.openBadge.addEventListener('click', function() {
		inbackGround = false;
		var DisplayOrders = require('DisplayOrders');
		DisplayOrders();
	});

	//this.openLabel.addEventListener('click', openJobsWindow);

	//this.openLabel.addEventListener('touchstart', textColorOnClick);
	//this.openLabel.addEventListener('touchend', textColorOffClick);
	this.rightHalf = Ti.UI.createView({
		height : '100%',
		width : '50%',
		right : 0,
		layout : 'vertical',
		badge : false
	});
	this.alertBadge = Ti.UI.createButton({
		top : '5%',
		height : GLOBALS.iconSize,
		width : GLOBALS.iconSize,
		backgroundImage : GLOBALS.alertIcon,
		backgroundSelectedImage : GLOBALS.alertIconSelected,
		backgroundDisabledImage : GLOBALS.alertIconSelected
	});
	this.alertLabel = Ti.UI.createLabel({
		text : 'Inbox',
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,

		color : '#000',
		font : GLOBALS.font,

	});
	this.alertBadge.addEventListener('click', function() {
		inbackGround = false;
		var inBoxWindow = require('InBox');
		var Custom = require('Custom');
		var TabledWindow = require('TabledWindow');
		inBoxWindow(Custom, TabledWindow);
	});

	//this.alertLabel.addEventListener('click', inBoxWindow);

	//this.alertLabel.addEventListener('touchstart', textColorOnClick);
	//this.alertLabel.addEventListener('touchend', textColorOffClick);
	this.leftHalf.add(this.openBadge);
	this.leftHalf.add(this.openLabel);

	this.rightHalf.add(this.alertBadge);
	this.rightHalf.add(this.alertLabel);
	this.topShelf.add(this.leftHalf);
	this.topShelf.add(this.rightHalf);

	/*
	 *
	 *
	 *
	 * Bottom Shelf
	 *
	 *
	 *
	 */
	this.bottomShelf = Ti.UI.createView({
		height : '30%',
		layout : 'horizontal',
		
		backgroundColor:'#55ffffff'
	});
	this.bottomLeftHalf = Ti.UI.createView({
		height : '100%',
		width : '50%',
		left : 0,
		layout : 'vertical'
	});
	this.historyBadge = Ti.UI.createButton({
		
		backgroundImage : GLOBALS.historyIcon,
		backgroundSelectedImage : GLOBALS.historyIconSelected,
		backgroundDisabledImage : GLOBALS.historyIconSelected,
		height : GLOBALS.iconSize,
		width : GLOBALS.iconSize
	});
	this.historyLabel = Ti.UI.createLabel({
		text : 'Complete Jobs',
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		color : '#000',
		font : GLOBALS.font,

	});
	this.historyBadge.addEventListener('click', function() {
		inbackGround = false;
		var historyWindow = require('HistoryWindow');
		historyWindow();
	});

	//this.historyLabel.addEventListener('click', historyWindow);

	//this.historyLabel.addEventListener('touchstart', textColorOnClick);
	//this.historyLabel.addEventListener('touchend', textColorOffClick);
	this.bottomRightHalf = Ti.UI.createView({
		height : '100%',
		width : '50%',
		right : 0,
		layout : 'vertical'
	});
	this.agendaBadge = Ti.UI.createButton({
		
		backgroundImage : GLOBALS.agendaIcon,
		backgroundSelectedImage : GLOBALS.agendaIconSelected,
		backgroundDisabledImage : GLOBALS.agendaIconSelected,
		height : GLOBALS.iconSize,
		width : GLOBALS.iconSize
	});
	this.agendaLabel = Ti.UI.createLabel({
		text : 'Current\nSchedule',
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		color : '#000',
		font : GLOBALS.font,

	});
	this.agendaBadge.addEventListener('click', function() {
		inbackGround = false;
		var agendaWindow = require('AgendaWindow');
		agendaWindow()
	});

	//this.agendaLabel.addEventListener('click', agendaWindow);

	//this.agendaLabel.addEventListener('touchstart', textColorOnClick);
	//this.agendaLabel.addEventListener('touchend', textColorOffClick);
	this.bottomLeftHalf.add(this.historyBadge);
	this.bottomLeftHalf.add(this.historyLabel);

	this.bottomRightHalf.add(this.agendaBadge);
	this.bottomRightHalf.add(this.agendaLabel);
	this.bottomShelf.add(this.bottomLeftHalf);
	this.bottomShelf.add(this.bottomRightHalf);

	
	

	this.footer = Ti.UI.createView({
		height : '15%',
		layout : 'horizontal',
		backgroundColor : '#000',
		//backgroundImage : GLOBALS.mainBar,
		bottom : 0
	});

	this.searchWrap = Ti.UI.createView({
		layout : 'absolute',
		width : '25%',
		//left : 0,
		backgroundColor : '#000',
		borderWidth : 1,
		borderColor : '#303030',
		height : '100%',
		backgroundSelectedColor : '#303030',
		backgroundDisabledColor : '#303030',
	});
	this.searchBadge = Ti.UI.createButton({
		//image : GLOBALS.optionsIcon,
		backgroundImage : 'img/Uparrow-128.png',
		//backgroundSelectedImage :GLOBALS.optionsIconSelected,
		height : GLOBALS.smallIconSize,
		width : GLOBALS.smallIconSize,
		//	top : 0,
		touchEnabled : false
	});

	this.searchLabel = Ti.UI.createLabel({
		text : 'Quick POD',
		bottom : 0,
		color : '#fff',
		font : GLOBALS.smallFont,
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER
	});
	var search = require('Search'), searchVisible = false;
	this.win.add(search.view.fullView);

	Ti.App.addEventListener('hideSearchView', function() {
		inbackGround = false;
		that.searchLabel.text = "Quick POD";
		//search.controller.hide();
		searchVisible = false
	})
	this.searchWrap.addEventListener('click', function() {
		inbackGround = false;
		if (searchVisible === false) {
			that.searchLabel.text = "Hide\nQuick POD";
			search.controller.show();

			searchVisible = true;
		} else {
			that.searchLabel.text = "Quick POD";
			search.controller.hide();
			searchVisible = false
		}

		//optionsWindow();
	});
	this.searchWrap.add(this.searchBadge);
	this.searchWrap.add(this.searchLabel);
	this.footer.add(this.searchWrap);

	this.optionsWrap = Ti.UI.createView({
		layout : 'absolute',
		width : '25%',
		//left : 0,
		backgroundColor : '#000',
		borderWidth : 1,
		borderColor : '#303030',
		height : '100%',
		backgroundSelectedColor : '#303030',
		backgroundDisabledColor : '#303030',
	});
	this.optionsBadge = Ti.UI.createButton({
		//image : GLOBALS.optionsIcon,
		backgroundImage : GLOBALS.optionsIcon,
		//backgroundSelectedImage :GLOBALS.optionsIconSelected,
		height : GLOBALS.smallIconSize,
		width : GLOBALS.smallIconSize,
		//	top : 0,
		touchEnabled : false
	});

	this.optionsLabel = Ti.UI.createLabel({
		text : 'Options',
		bottom : 0,
		color : '#fff',
		font : GLOBALS.smallFont,
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER
	});
	this.optionsWrap.addEventListener('click', function() {
		inbackGround = false;
		var optionsWindow = require('optionsWindow');
		optionsWindow();
	});

	//this.optionsLabel.addEventListener('click', optionsWindow);

	//this.optionsLabel.addEventListener('touchstart', textColorOnClick);
	//this.optionsLabel.addEventListener('touchend', textColorOffClick);
	this.optionsWrap.add(this.optionsBadge);
	this.optionsWrap.add(this.optionsLabel);
	this.footer.add(this.optionsWrap);
	this.syncWrap = Ti.UI.createView({
		layout : 'absolute',
		width : '25%',
		//right : 0,
		backgroundColor : '#000',
		borderWidth : 1,
		borderColor : '#303030',
		height : '100%',
		backgroundSelectedColor : '#303030',
		backgroundDisabledColor : '#303030',
	});
	this.syncBadge = Ti.UI.createButton({
		//image : GLOBALS.syncIcon,
		backgroundImage : GLOBALS.syncIcon,
		//backgroundSelectedImage : GLOBALS.syncIconSelected,
		height : GLOBALS.smallIconSize,
		width : GLOBALS.smallIconSize,
		//top : 0,
		touchEnabled : false
	});

	this.syncLabel = Ti.UI.createLabel({
		text : 'Sync Now',
		bottom : 0,
		color : '#fff',
		font : GLOBALS.smallFont,
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER
	});

	this.syncWrap.add(this.syncBadge);
	this.syncWrap.add(this.syncLabel);
	//this.syncLabel.addEventListener('touchstart', textColorOnClick);
	//this.syncLabel.addEventListener('touchend', textColorOffClick);
	this.syncWrap.addEventListener('click', function() {
		inbackGround = false;
		/*
		 var Network = require('Network');
		 var xhr = Network();
		 var db = require('db');
		 //var AppTabGroup = require('ui/AppTabGroup');
		 //new initDb();
		 sql = db();
		 var getUserData = sql.loggedInCheck();
		 var _data = {
		 username : getUserData.username,
		 password : getUserData.password,
		 longitude : getUserData.longitude,
		 latitude : getUserData.latitude,
		 idpSignature : null,
		 available : true,
		 city : getUserData.location,
		 version : Ti.App.version
		 };
		 Ti.API.info('@@@ GLOBALS @@@ : ' + JSON.stringify(_data));
		 xhr.manualSync(_data);

		 var dialog = Ti.UI.createAlertDialog({
		 message : 'Sync in progress ... you may continue using the app in the meantime.\n\nThis process also runs automatically in the background every 3 minutes.',
		 ok : 'Okay',
		 title : 'Syncing updates, and downloading new data from TAGNET.'
		 }).show();
		 xhr = null;
		 getUserData = null;
		 sql = null;
		 */
		var toast = Ti.UI.createNotification({
						message : "TAGNET : Syncing with TAGNET",
						duration : Ti.UI.NOTIFICATION_DURATION_SHORT
					});
					toast.show();
		Ti.API.warn('app.sync run()');
		var startSync = require('Sync');
		var run = startSync();
	});

	this.footer.add(this.syncWrap);

	this.trackWrap = Ti.UI.createView({
		layout : 'absolute',
		width : '24.2%',
		//right : 0,
		backgroundColor : '#000',
		borderWidth : 1,
		borderColor : '#303030',
		height : '100%',
		backgroundSelectedColor : '#303030',
		backgroundDisabledColor : '#303030',
	});
	this.trackBadge = Ti.UI.createButton({
		//image : GLOBALS.trackIcon,
		backgroundImage : GLOBALS.trackIcon,
		height : GLOBALS.smallIconSize,
		width : GLOBALS.smallIconSize,
		//top : 0,
		touchEnabled : false
	});

	this.trackLabel = Ti.UI.createLabel({
		//text : 'Open For Business',
		bottom : 0,
		//color : 'green',
		font : GLOBALS.smallFont,
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER
	});
	if (Ti.App.track === 'true' || Ti.App.track === true) {
		this.trackLabel.text = 'Open For Business';
		this.trackLabel.color = 'green';
	} else {
		this.trackLabel.text = 'Closed For Business';
		this.trackLabel.color = 'red';
	}
	this.trackWrap.add(this.trackBadge);
	this.trackWrap.add(this.trackLabel);
	this.footer.add(this.trackWrap);
	this.trackWrap.addEventListener('click', function() {
		inbackGround = false;
		if (Ti.App.username) {

			//var start = service();
			var DataBase = require('db');
			var sql = DataBase();

			if (that.trackLabel.text === 'Open For Business') {
				that.trackLabel.text = 'Closed For Business';
				that.trackLabel.color = 'red';
				alert('You are now "Closed For Business".\n\nThis means: while closed, you will not recieve jobs, or messages from TAGNET. Our brokers will view your status unavailable.\n\nTouch button again to toggle "Open".');
				//start.fireEvent('pause', 1);

				sql.updateTracking(false);
			} else {
				alert('You are now "Open For Business".\n\nThis means: while open, you are now eligible to recieve new jobs, or messages from TAGNET. Our brokers will view your status available.\n\nTouch button again to toggle "Closed".');
				that.trackLabel.text = 'Open For Business';
				that.trackLabel.color = 'green';
				//GLOBALS.tracking = true;

				sql.updateTracking(true);
			}

			//schedIntent = null;

			//locIntent = null;

			//syncIntent = null;
		}

	});

	this.ShiftLayout = function() {

	}
	this.badgeLabel1 = Ti.UI.createLabel({
		//text : count + '',

		color : '#fff',
		font : GLOBALS.smallFont,
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER
	}), this.badge1 = Ti.UI.createView({
		backgroundImage : 'img/Red-badge-32.png',
		//top : '-55%',
		right : '20%',
		//height : GLOBALS.smallIconSize,
		//width : GLOBALS.smallIconSize,
		layout : 'absolute',
		visible : false
	});
	this.badge1.top = GLOBALS.badgeTop;
	if (GLOBALS.tablet === true) {
		this.badge1.width = GLOBALS.xSmallIconSize;
		this.badge1.height = GLOBALS.xSmallIconSize;
		//badge.top = '-65%';

	} else {
		this.badge1.width = GLOBALS.smallIconSize;
		this.badge1.height = GLOBALS.smallIconSize;

	}
	this.badge1.add(this.badgeLabel1);
	this.leftHalf.add(this.badge1)

	this.badgeLabel2 = Ti.UI.createLabel({
		//text : count + '',

		color : '#fff',
		font : GLOBALS.smallFont,
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER
	}), this.badge2 = Ti.UI.createView({
		backgroundImage : 'img/Red-badge-32.png',
		//top : '-55%',
		right : '20%',
		//height : GLOBALS.smallIconSize,
		//width : GLOBALS.smallIconSize,
		layout : 'absolute',
		visible : false
	});
	this.badge2.top = GLOBALS.badgeTop;
	if (GLOBALS.tablet === true) {
		this.badge2.width = GLOBALS.xSmallIconSize;
		this.badge2.height = GLOBALS.xSmallIconSize;
		//badge.top = '-65%';

	} else {
		this.badge2.width = GLOBALS.smallIconSize;
		this.badge2.height = GLOBALS.smallIconSize;

	}
	this.badge2.add(this.badgeLabel2);
	this.rightHalf.add(this.badge2);
	var warningLabel = Ti.UI.createLabel({
		color : 'red',
		text : 'PLEASE KEEP MOBILE DEVICE PLUGGED IN TO CHARGER WHILE IN VEHICLE.',
		height:'10%',
		width:'100%',
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		font:{fontSize:GLOBALS.smallFont,
		fontWeight:'bold'}
	});
	this.win.add(this.navBar);
	this.win.add(this.topShelf);
	this.win.add(this.bottomShelf);
	this.win.add(warningLabel);
	this.win.add(this.footer);
	if (Ti.App.loggedIn === true) {
		Ti.App.fireEvent('LOGIN');
	}
	this.win.addEventListener('android:back', function(e) {
		var atfsys = require('uk.me.thepotters.atf.sys');
		Ti.API.info("module is => " + atfsys);

		atfsys.OptimiseMemory();
		if (Ti.App.track === true || Ti.App.track === 'true') {
			Ti.API.warn('App Running In Background');
			inbackGround = true;
			this.intent = Ti.Android.createIntent({
				action : Ti.Android.ACTION_MAIN

			});

			this.intent.addCategory(Ti.Android.CATEGORY_HOME);
			Ti.Android.currentActivity.startActivity(this.intent);
			//Titanium.Android.currentActivity.finish();
			//this.activity = Titanium.Android.currentActivity;
			//this.activity.finish();

		} else {
			Ti.API.warn('App Shutdown');

			Titanium.Android.currentActivity.finish();
			atfsys.KillMyProcess();
			that.win.close();
		}
		var autoKill = setTimeout(function() {
			if (inbackGround === true) {
				Ti.API.warn('App Shutdown : AutoKill');
				Titanium.Android.currentActivity.finish();
				atfsys.KillMyProcess();
				that.win.close();
			} else {
				return;
			}
		}, 7200000);
		//
		//that.win.close();
	});
	this.win.open();
	function checkToAddBadge() {
		try {

			var db = Titanium.Database.open('mobile'), checkJobs, checkInbox, queryForActiveJobs, queryForUnreadJobs, queryForMessages;
			//var loadopenWindow.GLOBALS = require('openWindow.GLOBALS');
			//var openWindow.GLOBALS = new loadopenWindow.GLOBALS();
			queryForActiveJobs = db.execute('select jobs.*, jobStatus.* from jobs, jobStatus where jobs.username = "' + Ti.App.username + '" and jobs.id = jobStatus.id and jobs.isAccepted = "true" and jobStatus.dlComplete <> "true";');
			checkJobs = queryForActiveJobs.rowCount;
			queryForActiveJobs.close()
			queryForUnreadJobs = db.execute('select * from jobs where username = "' + Ti.App.username + '" and isAccepted = "false" ;');

			queryForUnreadJobs.close()
			queryForMessages = db.execute('select * from messages;');
			queryForMessages.close();
			db.close();
			db = null;
			checkInbox = (queryForUnreadJobs.rowCount + queryForMessages.rowCount);

			//alert('Jobs: ' + checkJobs + ' Inbox: ' + checkInbox);

			if (parseInt(checkJobs) > 0) {
				that.badge1.visible = true;
				that.badgeLabel1.text = checkJobs;
			} else {
				that.badge1.visible = false;
			}

			if (parseInt(checkInbox) > 0) {
				that.badge2.visible = true;
				that.badgeLabel2.text = checkInbox;

			} else {
				that.badge2.visible = false;
			}
			queryForActiveJobs = null;
			checkJobs = null;
			queryForUnreadJobs = null;
			queryForMessages = null;
			checkInbox = null;
		} catch(err) {

		}
		return setTimeout(function() {
			checkToAddBadge();
		}, 10000);
	}

	checkToAddBadge();
	//alert('EXPERIMENTAL BRANCH:\nWIDTH: '+Titanium.Platform.displayCaps.platformWidth+'\nHEIGHT: '+ Titanium.Platform.displayCaps.platformHeight);
	return;
}

module.exports = DashBoard;
