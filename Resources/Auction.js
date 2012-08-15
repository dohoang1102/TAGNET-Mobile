function Auction(data) {
	
	var GLOBALS = require('SlimGlobals')();
	var testData = {
		ControlNumber : 6778877,
		Brand : 'Professional Messenger',
		PuRequestedTime : '13:00 7/30/12',
		PuLocation : '123 Main Street, Danville, CA 94506',
		DlRequestedTime : '15:00 7/30/12',
		DlLocation : '567 Broadway, Walnut Creek, CA 94596',
		StartingBid : 50,
		Expires : '12:00 7/30/12'
	}
	/*var opts = {
	cancel : 2,
	buttonNames : ['Place Bid', 'Help', 'Ignore'],
	selectedIndex : 2,
	destructive : 0,
	title : 'New Job Auction!'
	};
	*/
	//var dialog = Ti.UI.createOptionDialog(opts);
	var dialog = Ti.UI.createWindow({
		//backgroundColor : '#55000000',
		navBarHidden:true,
		modal:true,
		backgroundImage:'money_background_1280_960.jpeg',
		orientationModes : [Titanium.UI.PORTRAIT], // UI restricted to portrait mode
		fullscreen : false,
		exitOnClose : false,
		layout : 'vertical',
		height : '100%',
		visible : true
	});
	var root2 = Ti.UI.createView({
		top : 0,
		right : 0,
		left : 0,
		bottom : 0,
		backgroundColor:'#55000000'
	});

	var root = Ti.UI.createScrollView({
		contentWidth : 'auto',
		contentHeight : 'auto',
		showVerticalScrollIndicator : true,
		showHorizontalScrollIndicator : false,
		layout : 'vertical',
		height : '100%',
		width : '100%'
	});
	var title = Ti.UI.createLabel({
		text : 'New Auction Available :\nIn contract with ' + testData.Brand + '\n',
		color : "#33b5e5",
		width : '100%',
		textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		font : GLOBALS.largeFont
	});
	var bidWrap = Ti.UI.createView({
		height : '10%',
		width : '100%',
		layout : 'horizontal'
	});
	var bidField = Ti.UI.createTextField({
		value : testData.StartingBid + ".00",
		width : '33%',
		focusable : false,
		height:'100%',
		font : GLOBALS.font,
	});
	var bidControl = Ti.UI.createButton({
		title : 'Bid Lower',
		width : '33%',
		height:'100%',
		font : GLOBALS.font
	});
	var bidControl2 = Ti.UI.createButton({
		title : 'Bid Higher',
		width : '33%',
		height:'100%',
		font : GLOBALS.font,
		visible : false
	});
	bidWrap.add(bidControl);
	bidWrap.add(bidField);
	
	bidWrap.add(bidControl2);
	bidControl2.addEventListener('click', function() {
		Ti.API.warn(parseInt(bidField.value))
		var val = parseInt(bidField.value);
		if (val < testData.StartingBid) {
			val = val + 1;

			//bidField.value = val;
			bidField.setValue(val + ".00");
		}
		if (val === testData.StartingBid) {

			bidControl2.visible = false;

		}

		Ti.API.warn(val);
	});
	bidControl.addEventListener('click', function() {
		Ti.API.warn(parseInt(bidField.value))
		var val = parseInt(bidField.value);
		if (val > 1) {
			val = val - 1;

			//bidField.value = val;
			bidField.setValue(val + ".00");
		}
		if (!bidControl2.visible) {
			bidControl2.visible = true;
		}
		Ti.API.warn(val);
	});
	/*
	 var help = Ti.UI.createLabel({
	 text : '(Place your bid using the button(s) above. This is the amount you will be paid, if your bid wins the auction)',
	 color : "#fff",
	 width : '100%',
	 textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
	 font : GLOBALS.smallFont
	 });
	 */
	var puTime = Ti.UI.createLabel({
		text : 'Requested Pickup Time\n' + testData.PuRequestedTime,
		color : "#fff",
		width : '100%',
		textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		backgroundColor:'#55000000',
		font : GLOBALS.font
	});
	var puLocation = Ti.UI.createLabel({
		text : 'PU Location :\n' + testData.PuLocation + '\n',
		color : "#fff",
		width : '100%',
		textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		backgroundColor:'#55000000',
		font : GLOBALS.font
	});
	var dlTime = Ti.UI.createLabel({
		text : 'Requested Delivery Time\n' + testData.DlRequestedTime,
		color : "#fff",
		width : '100%',
		textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		backgroundColor:'#55000000',
		font : GLOBALS.font
	});
	var dlLocation = Ti.UI.createLabel({
		text : 'DL Location :\n' + testData.DlLocation + '\n',
		color : "#fff",
		width : '100%',
		textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		backgroundColor:'#55000000',
		font : GLOBALS.font
	});
	var Bid = Ti.UI.createLabel({
		text : 'Starting Bid : ' + testData.StartingBid,
		color : "#fff",
		width : '100%',
		textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		backgroundColor:'#55000000',
		font : GLOBALS.smallFont
	});
	var Expires = Ti.UI.createLabel({
		text : 'Expires : ' + testData.Expires,
		color : "#fff",
		width : '100%',
		textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		backgroundColor:'#55000000',
		font : GLOBALS.smallFont
	});

	var optWrap = Ti.UI.createView({
		height : '10%',
		width : '100%',
		layout : 'horizontal'
	});
	var placeBidButton = Ti.UI.createButton({
		width : '33%',
		height : '100%',
		title : 'Place Bid',
		font : GLOBALS.font,
	});
	var helpButton = Ti.UI.createButton({
		width : '33%',
		height : '100%',
		title : 'Help',
		font : GLOBALS.font,
	});
	var ignoreButton = Ti.UI.createButton({
		width : '33%',
		height : '100%',
		title : 'Ignore',
		font : GLOBALS.font,
	});
	optWrap.add(placeBidButton);
	optWrap.add(helpButton);
	optWrap.add(ignoreButton);
	placeBidButton.addEventListener('click', function() {
		var toast = Ti.UI.createNotification({
			message : "TAGNET : Bid placed",
			duration : Ti.UI.NOTIFICATION_DURATION_SHORT
		});
		toast.show();
		dialog.close();
	});

	helpButton.addEventListener('click', function() {
		var dialogHelp = Ti.UI.createAlertDialog({
			message : 'Place your bid using the button(s) Bid Lower and Bid Higher. This is the amount you will be paid, if your bid wins the auction.\n\nThe more competative your price, the more likely you are to win the bid. Good Luck!',
			ok : 'Okay',
			title : 'Auction Help'
		}).show();
	});
	ignoreButton.addEventListener('click', function() {
		var toast = Ti.UI.createNotification({
			message : "TAGNET : Bid ignored",
			duration : Ti.UI.NOTIFICATION_DURATION_SHORT
		});
		toast.show();
		dialog.close();
	});

	root.add(title);
	//
	//root.add(help);
	root.add(bidWrap);
	root.add(puTime);
	root.add(puLocation);
	root.add(dlTime);
	root.add(dlLocation);
	root.add(Bid);
	root.add(Expires);
	
	root.add(optWrap);
	//root2.add(root);
	//dialog.androidView = root;
	dialog.add(root);

	dialog.open();
}

module.exports = Auction;
