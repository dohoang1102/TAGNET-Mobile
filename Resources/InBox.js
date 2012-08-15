function inBoxWindow(Custom, TabledWindow) {

	var self = this;
	//this.enabled = false;

	var openWindow = TabledWindow(), titleLabel = Ti.UI.createLabel({
		//top : '1%',
		right : '1%',
		//text : 'Help With InBox',
		text : 'InBox',
		color : '#fff',
		height : '100%',
		font : openWindow.GLOBALS.largeFont,

	}), that = this, rowsArray = [];
	openWindow.win.remove(openWindow.table);
	openWindow.table = null;
	openWindow.win.backgroundImage = 'inbox_bg.jpg';
	openWindow.backLabel.color = "#fff";
	openWindow.navBar.backgroundColor = "#55000000";
	var lastSortDate;
	//openWindow.backgroundColor='#fff';
	var activePage = 0;
	var scrollView = Titanium.UI.createScrollableView({
		//views : [idpView, customerView],
		backgroundColor : '#99000000',
		showPagingControl : true,
		pagingControlHeight : 30,
		maxZoomScale : 2.0,
		currentPage : 0,
		height : '75%'
	});
	openWindow.win.add(scrollView);
	var navigationWrap = Ti.UI.createView({
		height : '100%',
		layout : 'horizontal',
		//backgroundImage : 'img/bar-2.png',
		backgroundColor : '#000'
	});

	var lastPageButton = Ti.UI.createButton({
		width : '33.3%',
		title : 'Previous Page',
		enabled : 'false',
		backgroundColor : '#55FF0000',
		borderWidth : 1,
		borderColor : '#303030',
		height : '100%',
		backgroundSelectedColor : '#303030',
		backgroundDisabledColor : '#000',
		color : '#fff',

	});
	var currentPageLabel = Ti.UI.createLabel({
		width : '33.3%',
		//text : 'Page 1 of 2',
		font : openWindow.GLOBALS.font,
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		color : '#fff',
	});
	var nextPageButton = Ti.UI.createButton({
		width : '33.3%',
		title : 'Next Page',
		backgroundColor : '#5500FF00',
		borderWidth : 1,
		borderColor : '#303030',
		height : '100%',
		backgroundSelectedColor : '#303030',
		backgroundDisabledColor : '#000',
		color : '#fff',
	});
	var sortView = Ti.UI.createView({
		height : '10%',
		width : '100%',
		//backgroundImage : openWindow.GLOBALS.mainBar,
		//backgroundImage : openWindow.GLOBALS.mainBar,
		backgroundColor : '#000000',
		layout : 'vertical'
	});
	navigationWrap.add(lastPageButton);
	navigationWrap.add(currentPageLabel);
	navigationWrap.add(nextPageButton);
	sortView.add(navigationWrap);
	openWindow.win.add(sortView);

	this.buildTheRows = function(data) {
		var jobData = data, thisSortDate, method_this = this;
		this.puReq = jobData.puRequired, this.dlReq = jobData.dlRequired;
		//Ti.API.info('@@@ DEBUG @@@ puReq : ' + this.puReq + ' dlReq : ' + this.dlReq)
		thisSortDate = jobData.sortDate, nullDate = new Date(0, 0, 0, 0, 0, 0, 0);
		Ti.API.warn(jobData.dlAtReqArriveTime);

		Ti.API.warn(getHour);
		Ti.API.warn(getMin);
		var topView, midView, bottomView, buttonView, acceptButton, declineButton, midLeftHalf, midRightHalf, bottomLeftHalf, bottomRightHalf, puEstPicker, dlEstPicker, controlNumberLabel = Ti.UI.createLabel({
			//text : 'ControlNumber : ' + jobData.controlNumber + '\nReference: ' + jobData.reference,
			//left : 0,
			color : 'red',
			font : openWindow.GLOBALS.smallFont,
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			left : 0
		}), puLabel = Ti.UI.createLabel({
			text : 'Pickup from : \n' + jobData.puAtName + '\n\nLocation : \n' + jobData.puAtAddress + '' + ((jobData.puAtRFD === null) ? '' : '\n' + jobData.puAtRFD) + '\n' + jobData.puAtCity + '\n\nPU Requested : \n' + jobData.puAtReqArriveTime,
			color : '#fff',
			font : openWindow.GLOBALS.smallFont,
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			left : '2%'
		}), dlLabel = Ti.UI.createLabel({
			text : 'Deliver to : \n' + jobData.dlToName + '\n\nLocation : \n' + jobData.dlToAddress + '' + ((jobData.dlToRFD === null) ? '' : '\n' + jobData.puAtRFD) + '\n' + jobData.dlToCity + '\n\nDL Requested : \n' + jobData.dlAtReqArriveTime,
			color : '#fff',
			font : openWindow.GLOBALS.smallFont,
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			left : '2%'
		});

		if (jobData.type === 'direct') {

			this.row = Ti.UI.createView({
				layout : 'vertical',
				estimated : false,
				estimatedReq : true,
				height : '100%',
				width : '100%'
			});
			topView = Ti.UI.createView({
				height : 'auto',
				layout : 'vertical',
				height : '15%',
				width : '100%'
			});
			controlNumberLabel.text = 'New Job Available: ' + jobData.controlNumber + ' (Brand: ' + jobData.brand + ')\nReference: ' + jobData.reference;
			midView = Ti.UI.createView({
				//backgroundColor : '#7A7A7A',
				layout : 'horizontal',
				height : '37.5%',
				width : '100%'
			});

			midLeftHalf = Ti.UI.createView({
				width : '50%',
				layout : 'vertical',

			});
			midRightHalf = Ti.UI.createView({
				width : '50%',
				layout : 'vertical',
				//backgroundColor : '#7A7A7A',
				//height:'100%'
				//	backgroundColor : 'red'
			});
			puEstLabel = Ti.UI.createLabel({
				//right : '2%',
				text : 'Estimated Pickup Time:',

				color : '#fff',
				font : openWindow.GLOBALS.xSmallFont,
				textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			});
			var getHour = new Date(jobData.puAtReqArriveTime).getHours();
			var getMin = new Date(jobData.puAtReqArriveTime).getMinutes();
			puEstPicker = Custom.UI.createPicker(GLOBALS, getHour, getMin);

			Ti.API.info('@@@ DEBUG @@@@ jobData.puComplete : ' + jobData.puComplete);

			if (this.puReq === 'false') {
				puEstLabel.text = "Pickup Not Required";
				//puEstPicker.visible = false;
			}
			bottomView = Ti.UI.createView({
				//height : openWindow.GLOBALS.rowHeight / 3,
				//backgroundColor : '#AAAAAA',
				layout : 'horizontal',
				height : '37.5%',
				width : '100%'
			});

			bottomLeftHalf = Ti.UI.createView({
				width : '50%',
				layout : 'vertical',

			});
			bottomRightHalf = Ti.UI.createView({
				width : '50%',
				layout : 'vertical',

			});
			dlEstLabel = Ti.UI.createLabel({
				//right : '2%',
				text : 'Estimated Delivery Time:',

				color : '#fff',
				font : openWindow.GLOBALS.xSmallFont,
				textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			});
			getHour = new Date(jobData.dlAtReqArriveTime).getHours();
			getMin = new Date(jobData.dlAtReqArriveTime).getMinutes();
			dlEstPicker = Custom.UI.createPicker(GLOBALS, getHour, getMin);

			if (this.dlReq === 'false') {
				dlEstLabel.text = "Delivery Not Required";
				//dlEstPicker.visible = false;
			}
			buttonView = Ti.UI.createView({
				height : openWindow.GLOBALS.fieldHeight,
				layout : 'absolute',
				backgroundColor : '#000',
				height : '10%',
				width : '100%'
				//backgroundImage : 'img/bar-2.png',
			});
			acceptButton = Ti.UI.createButton({
				title : 'Accept ' + jobData.controlNumber,
				width : '40%',
				left : 0,
				font : openWindow.GLOBALS.smallFont,
				height : '100%',
				color : '#fff',
				id : jobData.id,
				backgroundColor : '#808080',
				borderWidth : 1,
				borderColor : '#303030',
				height : '100%',
				backgroundSelectedColor : '#303030',
				backgroundDisabledColor : '#00FF00',
				puReq : this.puReq,
				dlReq : this.dlReq
			});
			declineButton = Ti.UI.createButton({
				title : 'Decline ' + jobData.controlNumber,
				width : '40%',
				right : 0,
				font : openWindow.GLOBALS.smallFont,
				height : '100%',
				color : '#fff',
				id : jobData.id,
				backgroundColor : '#808080',
				borderWidth : 1,
				borderColor : '#303030',
				height : '100%',
				backgroundSelectedColor : '#303030',
				backgroundDisabledColor : '#FF0000',
			});
			this.acceptTheJob = function() {

				var id = this.id, response = true, schedObj, ts = new Date();
				var FixJSTimestamp = require('FixJSTimestamp');
				var now = new FixJSTimestamp(ts);
				this.enabled = false;
				declineButton.backgroundColor = "#ccc";
				sql.acceptThisJob(id, response);
				if (this.puReq === 'false' || this.puReq === false) {
					schedObj = {
						username : openWindow.GLOBALS.username,
						companyNumber : jobData.companyNumber,
						controlNumber : jobData.controlNumber,
						puEstEnteredTime : null,
						puEstimateTimeStamp : null,
						dlEstimateTime : jobData.sortDate + " " + dlEstPicker.timeValue,
						dlEstEnteredTime : now.timestamp,
						tagJobId : jobData.id,
						sortDate : jobData.sortDate
					};
				} else if (this.dlReq === 'false' || this.dlReq === false) {
					schedObj = {
						username : openWindow.GLOBALS.username,
						companyNumber : jobData.companyNumber,
						controlNumber : jobData.controlNumber,
						puEstEnteredTime : now.timestamp,
						puEstimateTimeStamp : jobData.sortDate + " " + puEstPicker.timeValue,
						dlEstimateTime : null,
						dlEstEnteredTime : null,
						tagJobId : jobData.id,
						sortDate : jobData.sortDate
					};
				} else {

					schedObj = {
						username : openWindow.GLOBALS.username,
						companyNumber : jobData.companyNumber,
						controlNumber : jobData.controlNumber,
						puEstEnteredTime : now.timestamp,
						puEstimateTimeStamp : jobData.sortDate + " " + puEstPicker.timeValue,
						dlEstimateTime : jobData.sortDate + " " + dlEstPicker.timeValue,
						dlEstEnteredTime : now.timestamp,
						tagJobId : jobData.id,
						sortDate : jobData.sortDate
					};
				}
				Ti.API.info('@@@ DEBUG @@@ schedObj : ' + JSON.stringify(schedObj));
				//_obj.controlNumber, _obj.puEstEnteredTime, _obj.puEstimateTimeStamp, _obj.dlEstimateTime, _obj.dlEstEnteredTime, _obj.tagJobId, _obj.sortDate, _obj.username);
				sql.saveSchedForJob(schedObj);
				sql.addUpdateToQueue(jobData.id, 'schedule');
				try {
					nextPageButton.fireEvent('click');
				} catch(err) {

				}

			};
			this.declineTheJob = function() {
				var self = this;
				var opts = {
					title : 'Are you sure you would like to decline? '
				};
				opts.options = ['Decline', 'Cancel'];
				//opts.buttonNames = ['Confirm'];
				var dialog = Ti.UI.createOptionDialog(opts);
				dialog.show();
				dialog.addEventListener('click', function(e) {
					var index = e.index;
					Ti.API.warn('Clicked : ' + index);
					switch(index) {

						case 0:
							var ts = new Date();
							var FixJSTimestamp = require('FixJSTimestamp');
							var now = new FixJSTimestamp(ts);
							var id = self.id, response = false;
							self.enabled = false;
							//acceptButton.visible = false;
							sql.acceptThisJob(id, response, now.timestamp);
							sql.addUpdateToQueue(jobData.id, 'decline');
							try {
								nextPageButton.fireEvent('click');
							} catch(err) {

							}
							break;
						case 1:
							var toast = Ti.UI.createNotification({
								message : "Canceled..",
								duration : Ti.UI.NOTIFICATION_DURATION_SHORT
							});
							toast.show();
							break;
					}
				})
			};
			acceptButton.addEventListener('click', this.acceptTheJob);
			declineButton.addEventListener('click', this.declineTheJob);
			buttonView.add(acceptButton);
			buttonView.add(declineButton);
			topView.add(controlNumberLabel);
			midLeftHalf.add(puLabel);

			bottomLeftHalf.add(dlLabel);
			midRightHalf.add(puEstLabel);
			midView.add(midLeftHalf);
			midView.add(midRightHalf);

			if (this.puReq === 'true') {

				midRightHalf.add(puEstPicker);
			}
			bottomRightHalf.add(dlEstLabel);
			bottomView.add(bottomLeftHalf);
			bottomView.add(bottomRightHalf);

			if (this.dlReq === 'true') {

				bottomRightHalf.add(dlEstPicker);
			}
			this.row.add(topView);
			this.row.add(midView);
			this.row.add(bottomView);
			this.row.add(buttonView);
		} else {
			controlNumberLabel.text = 'New Message!';
			this.row = Ti.UI.createView({
				layout : 'vertical',
				controlNumber : jobData.controlNumber,
				height : '100%',
				width : '100%'
				//leftImage : openWindow.GLOBALS.leftImageMessage
			});
			var messageView = Ti.UI.createView({
				height : '90%',
				width : '100%',
				layout : 'vertical'
			});
			var crtlMessageLabel = Ti.UI.createLabel({
				text : 'ControlNumber : ' + jobData.controlNumber,
				color : '#fff',
				font : openWindow.GLOBALS.smallFont,
				textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
				left : 0
			});
			var theMessage = Ti.UI.createLabel({
				text : '\nMessage: ' + jobData.messageText,
				color : '#fff',
				font : openWindow.GLOBALS.largeFont,
				textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
				left : 0
			});
			messageView.add(controlNumberLabel);
			messageView.add(crtlMessageLabel);
			messageView.add(theMessage);
			buttonView = Ti.UI.createView({
				height : '10%',
				//layout : 'horizontal',
				backgroundColor : '#000'
			});
			acceptButton = Ti.UI.createButton({
				title : 'Reply YES',
				width : '40%',
				height : '100%',
				font : openWindow.GLOBALS.smallFont,
				backgroundColor : '#808080',
				borderWidth : 1,
				color : '#fff',
				borderColor : '#303030',
				height : '100%',
				backgroundSelectedColor : '#303030',
				backgroundDisabledColor : '#00FF00',
				id : jobData.id,
				left : 0
			});
			declineButton = Ti.UI.createButton({
				title : 'Reply NO',
				width : '40%',
				height : '100%',
				right : 0,
				color : '#fff',
				font : openWindow.GLOBALS.smallFont,
				backgroundColor : '#808080',
				borderWidth : 1,
				borderColor : '#303030',
				height : '100%',
				backgroundSelectedColor : '#303030',
				backgroundDisabledColor : '#FF0000',
				id : jobData.id,
			});
			this.answerFalse = function() {
				var self = this;
				var opts = {
					title : 'Are you sure you would like to say no? '
				};
				opts.options = ['I am sure', 'Cancel'];
				//opts.buttonNames = ['Confirm'];
				var dialog = Ti.UI.createOptionDialog(opts);
				dialog.show();
				dialog.addEventListener('click', function(e) {
					var index = e.index;
					Ti.API.warn('Clicked : ' + index);
					switch(index) {

						case 0:
							var ts = new Date();
							var FixJSTimestamp = require('FixJSTimestamp');
							var now = new FixJSTimestamp(ts);
							var id = self.id, response = false;
							self.enabled = false;
							acceptButton.visible = false;
							//acceptButton.enabled = true;
							sql.answerTheMessage(id, response, now.timestamp);
							sql.addUpdateToQueue(id, 'message');
							try {
								nextPageButton.fireEvent('click');
							} catch(err) {

							}
							break;
						case 1:
							var toast = Ti.UI.createNotification({
								message : "Canceled..",
								duration : Ti.UI.NOTIFICATION_DURATION_SHORT
							});
							toast.show();
							break;
					}
				});
			};
			this.answerTrue = function() {
				var ts = new Date();
				var FixJSTimestamp = require('FixJSTimestamp');
				var now = new FixJSTimestamp(ts);
				var id = this.id, response = true;
				this.enabled = false;
				declineButton.visible = false;
				//declineButton.visible = false;
				sql.answerTheMessage(id, response, now.timestamp);
				sql.addUpdateToQueue(id, 'message');
				try {
					nextPageButton.fireEvent('click');
				} catch(err) {

				}

			};
			acceptButton.addEventListener('click', this.answerTrue);
			declineButton.addEventListener('click', this.answerFalse);
			buttonView.add(acceptButton);
			buttonView.add(declineButton);

			this.row.add(messageView);
			this.row.add(buttonView);
		}
		rowsArray.push(this.row);
	};
	this.addRowsToTable = function() {
		scrollView.views = rowsArray;
	};
	var i = 0;
	var j = 0;
	var DataBase = require('db');
	var sql = DataBase();
	var jobs = [];
	jobs = sql.selectJobsToAccept();
	for (i; i < jobs.results.length; i++) {
		Ti.API.info('@@@ DEBUG @@@@ controlNumber : ' + jobs.results[i].controlNumber);
		this.buildTheRows(jobs.results[i]);
	}

	messages = sql.selectMessages();
	Ti.API.warn('Query for messages : ' + JSON.stringify(messages));
	// Live Data
	for (j; j < messages.results.length; j++) {
		this.buildTheRows(messages.results[j]);
	}

	// Test Data
	//for(j; j < testMessageArray.length; j++) {
	//	this.buildTheRows(testMessageArray[j]);
	//}
	that.addRowsToTable();
	var _resultsLength = jobs.results.length + messages.results.length;
	currentPageLabel.text = 'Page 1 of ' + (_resultsLength === 0 ? 1 : _resultsLength);

	scrollView.addEventListener('scroll', function() {
		Ti.API.info('@@@@@ DEBUG @@@@@ this.currentPage : ' + this.currentPage);

		activePage = this.currentPage;
		currentPageLabel.text = 'Page ' + (this.currentPage + 1) + ' of ' + _resultsLength;

		if (activePage === (_resultsLength - 1)) {

			lastPageButton.enabled = true;
			nextPageButton.enabled = false;
		} else if (activePage === 0) {

			lastPageButton.enabled = false;
			nextPageButton.enabled = true;
		} else {
			lastPageButton.enabled = true;
			nextPageButton.enabled = true;
		}

		//titleLabel.text = "Customer\nFill Out This Page.";

	});
	if (_resultsLength === 0) {
		nextPageButton.enabled = false;
	}
	nextPageButton.addEventListener('click', function() {
		scrollView.currentPage = (activePage + 1);
	});
	lastPageButton.addEventListener('click', function() {
		scrollView.currentPage = (activePage - 1);
	});
	openWindow.navBar.add(titleLabel);
	//openWindow.navBar.add(this.acceptAll);
	var killAll = function() {
		i = null;
		j = null;
		DataBase = null;
		sql = null;
		jobs = null;

		var gc = require('GC');
		Ti.API.warn('killAll FIRED')
		gc(openWindow.win);
		gc(scrollView);
		gc(navigationWrap);
		for (var i = 0; i < rowsArray.length; i++) {
			gc(rowsArray[i]);
		}
		rowsArray.length = 0;
		delete rowsArray;
		rowsArray = null;
		Custom = null;
		self = null;

		openWindow.win.removeEventListener('close', killAll);
		delete openWindow;
		openWindow = null;
		TabledWindow = null;
	}
	openWindow.win.addEventListener('close', killAll);
	openWindow.win.open();
	return this;
	Ti.API.info('@@@@ MEM DEBUG @@@@ Available Memory : ' + Ti.Platform.availableMemory);
}

module.exports = inBoxWindow;
