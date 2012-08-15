function LoginWindow() {
	var TabledWindow = require('TabledWindow');
	var Paint = require('ti.paint');
	var activityIndicator = Ti.UI.createActivityIndicator({
		color : 'green',
		font : {
			fontFamily : 'Helvetica Neue',
			fontSize : 26,
			fontWeight : 'bold'
		},
		message : 'Contacting TAGNET...',
		//style : Ti.UI.iPhone.ActivityIndicatorStyle.DARK,
		//top : 10,
		//left : 10,
		height : 'auto',
		width : 'auto'
	});
	var fieldData = {}, baseString;
	var openWindow = TabledWindow(), titleLabel = Ti.UI.createLabel({
		right : '1%',
		text : 'Login Screen',

		color : '#000',
		font : openWindow.GLOBALS.largeFont,

	});
	openWindow.win.backgroundImage = 'nightroad.jpg';
	var logLabel = Ti.UI.createLabel({
		//left : '1%',
		text : 'Login',
		color : '#fff',
		font : openWindow.GLOBALS.font
	});
	var userNameView = Ti.UI.createView({
		//layout : 'horizontal',
		height : '15%'
	}), userNameLabel = Ti.UI.createLabel({
		text : 'TAGNET Username: ',
		width : '50%',
		font : openWindow.GLOBALS.font,
		color : '#000'
	}), userNameField = Ti.UI.createTextField({
		borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
		font : openWindow.GLOBALS.smallFont,
		autocapitalization : Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
		hintText : 'TAGNET Username',
		width : '90%',
		keyboardType : Titanium.UI.KEYBOARD_DEFAULT,
		returnKeyType : Titanium.UI.RETURNKEY_DEFAULT
	}), that = this;
	openWindow.win.remove(openWindow.table);
	openWindow.table = null;
	//userNameView.add(userNameLabel);
	openWindow.win.add(logLabel);
	userNameView.add(userNameField);
	openWindow.win.add(userNameView);
	openWindow.win.add(activityIndicator);
	var passwordView = Ti.UI.createView({
		//layout : 'horizontal',
		height : '15%'
	}), passwordLabel = Ti.UI.createLabel({
		text : 'TAGNET Password : ',
		width : '50%',
		font : openWindow.GLOBALS.font,
		color : '#000'
	}), passwordField = Ti.UI.createTextField({
		borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
		font : openWindow.GLOBALS.smallFont,
		autocapitalization : Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
		hintText : 'TAGNET Password',
		width : '90%',
		keyboardType : Titanium.UI.KEYBOARD_DEFAULT,
		returnKeyType : Titanium.UI.RETURNKEY_DEFAULT
	});

	//passwordView.add(passwordLabel);
	passwordView.add(passwordField);
	openWindow.win.add(passwordView);
	var sigView = Ti.UI.createView({
		top : '2%',
		layout : 'absolute'
		//height : '30%'
	});
	if (openWindow.GLOBALS.tablet === false) {
		sigView.height = '30%';
	} else {
		sigView.height = '20%';
	}
	var sigLabel = Ti.UI.createLabel({
		//left : '1%',
		text : 'Sign Here:',
		color : '#fff',
		font : openWindow.GLOBALS.font
	});
	var sigWrapper = Ti.UI.createView({
		//top : '2%',
		layout : 'absolute',
		width : '90%',
		//right : 0,
		//borderRadius : 10,
		//borderWidth : 1,
		//borderColor : '#000',
		//height : openWindow.GLOBALS.fieldHeight,
		backgroundColor : '#fff',
	});
	//var signaturePad = Ti.UI.createWebView({
	//	width : '97%',
	//	height : '95%',
	//	zIndex : 2,
	//	url : openWindow.GLOBALS.sigPad,
	//	backgroundColor : '#fff',
	//	scalesPageToFit : false
	//});
	var signaturePad = Paint.createPaintView({
		width : '97%',
		height : '95%',
		// strokeWidth (float), strokeColor (string), strokeAlpha (int, 0-255)
		strokeColor : '#000',
		strokeAlpha : 255,
		strokeWidth : 10,
		eraseMode : false
	});
	var sigLine = Ti.UI.createView({
		//top : '2%',
		width : '90%',
		height : '2%',
		bottom : '8%',
		backgroundColor : '#000',
		zIndex : 5,
		touchEnabled : false
	});
	var sigX = Ti.UI.createLabel({
		bottom : '8%',
		left : '5%',
		text : 'X',
		font : openWindow.GLOBALS.font,
		color : '#000',
		zIndex : 5,
		touchEnabled : false
	});
	sigWrapper.add(signaturePad);
	sigWrapper.add(sigLine);
	sigWrapper.add(sigX);
	//this.sigView.add(this.sigLabel);
	sigView.add(sigWrapper);
	openWindow.win.add(sigLabel);
	openWindow.win.add(sigView);
	var loginNow = Ti.UI.createButton({
		title : 'Login Now',
		top : '2%',
		width : '90%',
		height : '10%'
	});
	loginNow.addEventListener('click', function() {
		activityIndicator.show();
		sigWrapper.remove(sigLine);
		sigWrapper.remove(sigX);
		var image_blob_of_webview, convertMedia, base64String;
		var Network = require('Network');
		var http = Network();
		image_blob_of_webview = sigWrapper.toImage();
		convertMedia = image_blob_of_webview.media;
		base64String = Titanium.Utils.base64encode(convertMedia);
		Ti.API.info('@@@ BASE64 DEBUG @@@ base64String : ' + base64String);
		baseString = base64String.toString();
		baseString = baseString.replace(/\s/g, '');
		baseString = baseString.replace(/(\r\n|\n|\r)/gm, "");
		//alert(baseString.length);
		var fieldData = {};
		fieldData.username = userNameField.value.toLowerCase();
		fieldData.password = passwordField.value.toLowerCase();
		fieldData.longitude = null;
		fieldData.latitude = null;
		fieldData.idpSignature = baseString;
		fieldData.available = false;
		fieldData.version = Ti.App.version;
		http.loginToServer(fieldData, true, activityIndicator);
		//signaturePad.reload();
		//signaturePad.url = 'blank.html';
		base64String = null;
		image_blob_of_webview = null;
		convertMedia = null;
		base64String = null;

		setTimeout(function() {
			try {
				activityIndicator.hide();
			} catch(err) {

			}

		}, 20000);
	});
	openWindow.win.add(loginNow);
	//openWindow.navBar.add(titleLabel);
	Ti.App.addEventListener('CLOSELOGINWINDOW', function() {
		
		openWindow.win.close();
		try {
			activityIndicator.hide();
			openWindow.win.remove(activityIndicator);
			activityIndicator = null;
		} catch(err) {

		}
		delete fieldData;
		baseString = null;
		TabledWindow = null;

		var gc = require('GC');
		Ti.API.warn('killAll FIRED')

		gc(userNameView);
		gc(passwordView);
		gc(sigView);

		userNameView = null;
		userNameLabel = null;
		userNameField = null;
		that = null;

		passwordView = null;
		passwordLabel = null;
		passwordField = null;

		sigView = null;

		sigLabel = null;
		sigWrapper = null;
		signaturePad = null;
		sigLine = null;
		sigX = null;

		loginNow = null;

	});

	openWindow.win.open();
	Ti.API.info('@@@@ MEM DEBUG @@@@ Available Memory : ' + Ti.Platform.availableMemory);
}

module.exports = LoginWindow;
