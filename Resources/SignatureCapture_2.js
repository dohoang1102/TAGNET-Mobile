var SIG = function(data) {
	var self = this;
	var InitGlobals = require('SlimGlobals');
	var Paint = require('ti.paint');
	var GLOBALS = InitGlobals();
	if ( typeof Object.create !== "function") {
		Object.create = function(o) {
			function F() {
			}


			F.prototype = o;
			return F();
		};
	}
	var SignatureCapture = {
		win : Titanium.UI.createView({
			//title : 'TAGNET MOBILE',
			backgroundImage:'pod_bg.jpg',
			//orientationModes : [Titanium.UI.LANDSCAPE_LEFT], // UI restricted to portrait mode
			//fullscreen : false,
			//exitOnClose : false,
			layout : 'vertical',
			visible : true,
			height : '100%',
			width : '100%',
			zIndex : 99,
			top : '-100%'
		}),

		widthWrap : Ti.UI.createView({
			height : '85%',
			backgroundColor : '#99000000',
			layout : 'vertical',
			//backgroundColor : '#ccc',
			width : '100%'
			//top : 0,
			//title : 'Customer Name\nand Signature'
		}),
		navBar : Ti.UI.createView({
			height : '15%',
			layout : 'absolute',
			//backgroundImage : GLOBALS.mainBar,
			//backgroundImage : GLOBALS.mainBar,
			top : 0,
			title : 'Customer Name\nand Signature'
		}),
		titleLabel : Ti.UI.createLabel({
			right : '1%',
			//bottom : '6%',
			text : 'Sign below\nUse finger or stylus.',
			color : '#000',
			font : GLOBALS.smallFont,
		}),
		backButton : Ti.UI.createButton({
			left : 0,
			height : GLOBALS.medIconSize,
			width : GLOBALS.medIconSize,
			backgroundImage : GLOBALS.backIcon,
			backgroundSelectedImage : GLOBALS.backIconSelected,
			backgroundDisabledImage : GLOBALS.backIconSelected
		}),
		backLabel : Ti.UI.createLabel({
			left : GLOBALS.medIconSize,
			text : 'Back',

			color : '#000',
			font : GLOBALS.font,

		}),
		saveButton : Ti.UI.createButton({
			height : '100%',
			width : '49%',
			font : GLOBALS.smallFont,
			title : 'Save & Continue'
		}),
		clearButton : Ti.UI.createButton({

			width : '50%',
			font : GLOBALS.smallFont,
			height : '100%',
			title : 'Clear'
		}),
		buttonView : Ti.UI.createView({
			top : '2%',
			layout : 'horizontal',
			width : '83%',
			height : '15%'
			//height : '30%'
		}),

		initView : Ti.UI.createView({
			top : '2%',
			layout : 'vertical',
			width : '100%',
			height : '30%'
		}),
		initLabel : Ti.UI.createLabel({
			//left : '1%',
			text : 'Initial Here',
			color : '#fff',
			font : GLOBALS.font,
			width : '100%',
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		}),
		initialWrapper : Ti.UI.createView({
			//top : '2%',
			layout : 'absolute',
			width : '85%',
			height : '80%',
			//right : 0,
			//borderColor : '#000',
			//borderRadius : 10,
			//borderWidth : 1,
			//height : GLOBALS.fieldHeight,
			backgroundColor : '#fff',
		}),
		initialLine : Ti.UI.createView({
			//top : '2%',
			width : '90%',
			height : '2%',
			bottom : '8%',
			backgroundColor : '#000',
			zIndex : 5,
			touchEnabled : false
		}),
		initialX : Ti.UI.createLabel({
			bottom : '8%',
			left : '5%',
			text : 'X',
			font : GLOBALS.font,
			color : '#000',
			zIndex : 5,
			touchEnabled : false
		}),
		initialSignaturePad : Paint.createPaintView({
			width : '97%',
			height : '95%',
			// strokeWidth (float), strokeColor (string), strokeAlpha (int, 0-255)
			strokeColor : '#000',
			strokeAlpha : 255,
			strokeWidth : 10,
			eraseMode : false,
			backgroundColor : '#fff',
		}),

		sigView : Ti.UI.createView({
			top : '2%',
			layout : 'vertical',
			width : '100%',
			height : '30%'
		}),
		sigLabel : Ti.UI.createLabel({
			//left : '1%',
			text : 'Sign Here',
			color : '#fff',
			font : GLOBALS.font,
			width : '100%',
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		}),
		sigWrapper : Ti.UI.createView({
			//top : '2%',
			layout : 'absolute',
			width : '85%',
			height : '80%',
			//right : 0,
			//borderRadius : 10,
			//borderWidth : 1,
			//borderColor : '#000',
			//height : GLOBALS.fieldHeight,
			backgroundColor : '#fff',
		}),
		signaturePad : Paint.createPaintView({
			width : '97%',
			height : '95%',
			// strokeWidth (float), strokeColor (string), strokeAlpha (int, 0-255)
			strokeColor : '#000',
			strokeAlpha : 255,
			strokeWidth : 10,
			eraseMode : false,
			backgroundColor : '#fff',
		}),
		sigLine : Ti.UI.createView({
			//top : '2%',
			width : '90%',
			height : '2%',
			bottom : '10%',
			backgroundColor : '#000',
			zIndex : 5,
			touchEnabled : false
		}),
		sigX : Ti.UI.createLabel({
			bottom : '10%',
			left : '5%',
			text : 'X',
			font : GLOBALS.font,
			color : '#000',
			zIndex : 5,
			touchEnabled : false
		}),

		buildUi : function(data) {
			var _data = data;
			var them = this;
			this.backButton.addEventListener('click', gcWindow);
			this.buttonView.add(this.clearButton);
			this.buttonView.add(this.saveButton);
			this.navBar.add(this.backButton);
			this.navBar.add(this.backLabel);
			this.navBar.add(this.titleLabel);
			this.initialWrapper.add(this.initialSignaturePad);
			this.initialWrapper.add(this.initialLine);
			this.initialWrapper.add(this.initialX);

			this.initView.add(this.initialWrapper);
			this.initView.add(this.initLabel);
			this.sigWrapper.add(this.signaturePad);
			this.sigWrapper.add(this.sigLine);
			this.sigWrapper.add(this.sigX);

			this.sigView.add(this.sigWrapper);
			this.sigView.add(this.sigLabel);

			this.saveButton.addEventListener('click', saveTheSig);
			if (_data.initials === true) {

				this.widthWrap.add(this.initView);

			}

			this.clearButton.addEventListener('click', function() {
				them.signaturePad.clear();
				//them.signaturePad.reload();
				//them.signaturePad.url = GLOBALS.sigPad;
				if (_data.initials === true) {
					them.initialSignaturePad.clear();
					//them.initialSignaturePad.reload();
					//them.initialSignaturePad.url = GLOBALS.sigPad;
				}

			});
			this.widthWrap.add(this.sigView);
			this.widthWrap.add(this.buttonView);

			this.win.add(this.navBar);
			this.win.add(this.widthWrap);
			//this.win.open();
			self.win = this.win;
			//this.win.addEventListener('postlayout', fixWindow);
			function saveTheSig() {
				var fieldData = {};
				//var data = them.signaturePad.evalJS('web()');
				//data = data.replace(/\s/g, '');
				//data = data.replace(/(\r\n|\n|\r)/gm, "");
				//var n = data.substr(22, (data.length - 22));
				//fieldData.customerSign = n;
				//alert('Base64 : ' +data );
				//Ti.API.warn(data.length);

				//Ti.API.warn(n.length);
				//Ti.API.warn(n);
				them.sigWrapper.remove(them.sigLine);
				them.sigWrapper.remove(them.sigX);
				var image_blob_of_webview = them.sigWrapper.toImage();
				var convertMedia = image_blob_of_webview.media;
				var base64String = Titanium.Utils.base64encode(convertMedia);
				//Ti.API.info('@@@ BASE64 DEBUG @@@ base64String = ' + base64String);
				var baseString = base64String.toString();
				baseString = baseString.replace(/\s/g, '');
				var str = baseString.replace(/(\r\n|\n|\r)/gm, "");
				Ti.API.warn('@@@ BASE64 DEBUG @@@ str = ' + str.length + ' Base 64: ' + str);
				fieldData.customerSign = str;
				//image_blob_of_webview.length = 0;
				//image_blob_of_webview = null;
				//convertMedia = null;
				//base64String = null;
				//baseString = null;
				//fieldData.username = userNameField.value,
				//fieldData.password = passwordField.value,
				//fieldData.longitude = GLOBALS.lon,
				//fieldData.latitude = GLOBALS.lat,
				//fieldData.idpSignature = baseString,
				//fieldData.version = "1.0",

				if (_data.initials === true) {
					//var data2 = them.initialSignaturePad.evalJS('web()');
					//data2 = data2.replace(/\s/g, '');
					//data2 = data2.replace(/(\r\n|\n|\r)/gm, "");
					//var m = data2.substr(22, (data2.length - 22));
					//fieldData.customerInit = n;
					//this.widthWrap.add(this.initLabel),
					//them.initialWrapper.remove(them.initialSignaturePad);
					them.initialWrapper.remove(them.initialLine);
					them.initialWrapper.remove(them.initialX);
					var image_blob_of_webview2 = them.initialWrapper.toImage();
					var convertMedia2 = image_blob_of_webview2.media;
					var base64String2 = Titanium.Utils.base64encode(convertMedia2);
					var base64String2 = base64String2.toString();
					baseString2 = base64String2.replace(/\s/g, '');
					var str2 = baseString2.replace(/(\r\n|\n|\r)/gm, "");
					fieldData.customerInit = str2;

					//Ti.API.info('@@@ BASE64 DEBUG @@@ base64String2 = ' + base64String2),
					//var baseString2 = base64String2.toString();

					//fieldData.customerInit = str2;
					//image_blob_of_webview2.length = 0;
					//image_blob_of_webview2 = null;
					//base64String2 = null;
					//convertMedia2 = null;
					//baseString2 = null;
				}
				//Ti.App.fireEvent('captureTheSignature', fieldData);
				self.fieldData = JSON.parse(JSON.stringify(fieldData));
				//this.results = fieldData,

				//that.enabled = false;
				//them.signaturePad.reload();
				//them.signaturePad.url = 'blank.html';
				//if (_data.initials === true) {
				//	them.initialSignaturePad.reload();
				//	them.initialSignaturePad.url = 'blank.html';
				//}
				gcWindow();
				//delete fieldData;
				//fieldData = null;
				return;
				//this.close(),
				//win.close(),
				//win : null,
				//return this,
				//http.loginToServer(fieldData),
			}

			function gcWindow() {
				//that.saveButton.removeEventListener('click', saveTheSig);
				them.win.hide();
				var gc = require('GC');

				gc(them.navBar);
				gc(them.widthWrap);
				them.buttonView.remove(them.clearButton);
				them.buttonView.remove(them.saveButton);
				them.navBar.remove(them.backButton);
				them.navBar.remove(them.backLabel);
				them.navBar.remove(them.titleLabel);
				them.initialWrapper.remove(them.initialSignaturePad);
				them.initialWrapper.remove(them.initialLine);
				them.initialWrapper.remove(them.initialX);

				them.initView.remove(them.initialWrapper);
				them.initView.remove(them.initLabel);
				them.sigWrapper.remove(them.signaturePad);
				them.sigWrapper.remove(them.sigLine);
				them.sigWrapper.remove(them.sigX);

				them.sigView.remove(them.sigWrapper);
				them.sigView.remove(them.sigLabel);
				InitGlobals = null;
				GLOBALS = null;

				this.win = null;
				//them.initialSignaturePad.url = '';
				them.initialSignaturePad = null;
				//them.signaturePad.url = '';
				them.signaturePad = null;
				them.widthWrap = null;
				them.navBar = null;
				them.backButton = null;
				them.backLabel = null;
				them.saveButton = null;
				them.clearButton = null;
				them.buttonView = null;

				them.initView = null;
				them.initLabel = null;
				them.initialWrapper = null;
				them.initialLine = null;
				them.initialX = null;

				them.sigView = null;
				them.sigLabel = null;
				them.sigWrapper = null;
				them.sigLine = null;
				them.sigX = null;
				removeObj();
				return;

			}

			return;
		}
	}
	function removeObj() {
		Ti.API.warn('Removing SignatureCapture');

		them = null;
		system = null;
		SignatureCapture = null;
		var atfsys = require('uk.me.thepotters.atf.sys');
		//Ti.API.info("module is => " + atfsys);
		atfsys.OptimiseMemory();
		return;
	}

	var system = Object.create(SignatureCapture);
	if (data) {

		system.buildUi(data);
	}
	this.getSignatures = function() {
		return self.fieldData;
	};
	this.getView = function() {
		return system.win;
	};

	return this;
}

module.exports = SIG;
