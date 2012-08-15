function TabledWindow() {
	var that = this;

	if ( typeof Object.create !== "function") {
		Object.create = function(o) {
			function F() {
			}


			F.prototype = o;
			return F();
		};
	}

	var loadGlobals = require('GLOBALS');
	this.GLOBALS = loadGlobals();
	var GLOBALS = this.GLOBALS;
	this.win = Titanium.UI.createWindow({
		navBarHidden:true,
		modal:true,
		backgroundColor : '#fff',
		orientationModes : [Titanium.UI.PORTRAIT], // UI restricted to portrait mode
		fullscreen : false,
		exitOnClose : false,
		layout : 'vertical',
		height : '100%',
		visible : true
	});
	/*this.win = Titanium.UI.createView({
	 title : 'TAGNET MOBILE',
	 backgroundColor : '#fff',
	 orientationModes : [Titanium.UI.PORTRAIT], // UI restricted to portrait mode
	 fullscreen : false,
	 exitOnClose : false,
	 layout : 'vertical',
	 height : GLOBALS.screenHeight,
	 width : GLOBALS.screenWidth,
	 top : '-84%',
	 //bottom:0,
	 zIndex : 99,
	 visible : true
	 });
	 */
	this.navBar = Ti.UI.createView({
		height : '15%',
		layout : 'absolute',
		//backgroundColor:'#fff',
		//backgroundColor:"#fff",
		//backgroundImage : GLOBALS.mainBar,
		//backgroundImage : GLOBALS.mainBar,
		top : 0
	});
	this.backButton = Ti.UI.createButton({
		left : 0,
		height : GLOBALS.medIconSize,
		width : GLOBALS.medIconSize,
		backgroundImage : GLOBALS.backIconSelected,
		backgroundSelectedImage : GLOBALS.backIcon,
		backgroundDisabledImage : GLOBALS.backIcon
	});
	 this.backLabel = Ti.UI.createLabel({
		left : GLOBALS.medIconSize,
		text : 'Back',

		color : '#000',
		font : GLOBALS.font,

	});

	this.backLabel.addEventListener('touchstart', textColorOnClick);
	this.backLabel.addEventListener('touchend', textColorOffClick);
	function textColorOnClick() {
		this.color = '#C0C0C0';
	}

	function textColorOffClick() {
		this.color = '#000';
	}


	this.table = Titanium.UI.createTableView({
		separatorColor : '#000'
	});
	this.navBar.add(this.backButton);
	this.navBar.add(this.backLabel);
	this.win.add(this.navBar);
	this.win.add(this.table);
	this.gcWindow = function(e) {

		if (that.win !== null) {
			that.win.close();
			//that.navBar.remove(this.backButton);
			//that.navBar.remove(this.backLabel);
			//that.win.remove(that.navBar);
			var gc = require('GC');

			gc(that.win);
			gc(that.navBar);
			//cleanWindow(that.win);
			try {
				that.win.remove(that.table);
				that.table = null;
			} catch(err) {

			}
			that.navBar = null;

			//this.backButton = null;
			//this.backLabel = null;

			this.enabled = false;

			InitGlobals = null;
			that.GLOBALS = null;
			GLOBALS = null;
			try {
				sql = null;
			} catch(err) {

			}

			try {
				db = null;
			} catch(err) {

			}
			that.win = null;
			that = null;
			//var atfsys = require('uk.me.thepotters.atf.sys');
			//Ti.API.info("module is => " + atfsys);

			//atfsys.OptimiseMemory();
			var atfsys = require('uk.me.thepotters.atf.sys');
			//Ti.API.info("module is => " + atfsys);
			atfsys.OptimiseMemory();
			Ti.API.info('@@@@ GC WINDOW MEM DEBUG @@@@ Available Memory : ' + Ti.Platform.availableMemory);

		}

	}
	this.backButton.addEventListener('click', this.gcWindow);
	this.backLabel.addEventListener('click', this.gcWindow);

	return this;

}

module.exports = TabledWindow;
