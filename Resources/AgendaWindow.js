function agendaWindow() {
	
	var Custom = require('Custom');
	var self = this;
	//this.enabled = false;
	//setTimeout(function() {
	//	self.enabled = true;
	//}, 1000);
	var TabledWindow = require('TabledWindow');
	var openWindow = TabledWindow(), titleLabel = Ti.UI.createLabel({
		//top : '1%',
		right : '1%',
		//text : 'Help With Schedule',
		text : 'Schedule',

		color : '#fff',
		font : openWindow.GLOBALS.largeFont,

	}), that = this, rowsArray = [], sortView = Ti.UI.createView({
		height : '10%',
		//backgroundImage : openWindow.GLOBALS.mainBar,
		backgroundColor : '#000',
		layout : 'vertical'
	});
	openWindow.win.remove(openWindow.table);
	openWindow.table = null;
	//'agenda_bg.jpg'
	openWindow.win.backgroundImage = 'agenda_bg.jpg';
	openWindow.backLabel.color = "#fff";
	openWindow.navBar.backgroundColor = "#55000000";
	var activePage = 0;
	var scrollView = Titanium.UI.createScrollableView({
		//views : [idpView, customerView],
		backgroundColor:'#99000000',
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

	navigationWrap.add(lastPageButton);
	navigationWrap.add(currentPageLabel);
	navigationWrap.add(nextPageButton);
	sortView.add(navigationWrap);
	openWindow.win.add(sortView);
	var lastSortDate;
	this.buildTheRows = function(data) {
		var jobData = data, puReq = true, dlReq = true;
		var row, topView, midView, bottomView, buttonView, acceptButton, declineButton, midLeftHalf, midRightHalf, bottomLeftHalf, bottomRightHalf, puEstPicker, dlEstPicker, controlNumberLabel = Ti.UI.createLabel({
			//text : 'ControlNumber : ' + jobData.controlNumber + '\nReference: ' + jobData.reference,
			color : 'red',
			font : openWindow.GLOBALS.font,
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			left : 0
		}), puLabel = Ti.UI.createLabel({
			left : '2%',

			text : 'Pickup from : \n' + jobData.puAtName + '\n\nLocation : \n' + jobData.puAtCity + '\n\nPU Requested : \n' + jobData.puAtReqArriveTime,

			color : '#fff',
			font : openWindow.GLOBALS.smallFont,

			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		}), dlLabel = Ti.UI.createLabel({
			left : '2%',
			text : 'Deliver to : \n' + jobData.dlToName + '\n\nLocation : \n' + jobData.dlToCity + '\n\nDL Requested : \n' + jobData.dlAtReqArriveTime,

			color : '#fff',
			font : openWindow.GLOBALS.smallFont,
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		});
		thisSortDate = jobData.sortDate;

		row = Ti.UI.createView({
			layout : 'vertical',
			controlNumber : jobData.controlNumber,
			puName : jobData.puAtName,
			dlName : jobData.dlToName,
			puZip : jobData.puAtCity,
			dlZip : jobData.dlToCity,
			puTime : jobData.puAtReqArriveTime,
			dlTime : jobData.dlAtReqArriveTime,
			sortDate : jobData.sortDate,
			height : '100%',
			width : '100%',
			backgroundColor:'#99000000',

		});
		topView = Ti.UI.createView({
			height : 'auto',
			layout : 'vertical',
			height : '10%',
			width : '100%'
		});
		controlNumberLabel.text = 'ControlNumber : ' + jobData.controlNumber + ' Reference: ' + jobData.reference;
		midView = Ti.UI.createView({
			height : 'auto',
			layout : 'horizontal',
			height : '40%',
			width : '100%'

		});

		midLeftHalf = Ti.UI.createView({
			width : '50%',
			layout : 'vertical',
			//backgroundColor : '#7A7A7A'
		});
		midRightHalf = Ti.UI.createView({
			width : '50%',
			layout : 'vertical',
			//backgroundColor : '#7A7A7A'
			//	backgroundColor : 'red'
		});
		puEstLabel = Ti.UI.createLabel({
			//right : '2%',
			text : 'Estimated Pickup Time:',

			color : '#fff',
			font : openWindow.GLOBALS.smallFont,
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		});
		if (jobData.puRequired === 'false') {
			puEstLabel.text = "Pickup Not Required";
			//puEstPicker.visible = false;
		}
		puEstPicker = Custom.UI.createPicker(openWindow.GLOBALS);
		bottomView = Ti.UI.createView({
			height : 'auto',
			layout : 'horizontal',
			height : '40%',
			width : '100%'
		});

		bottomLeftHalf = Ti.UI.createView({
			width : '50%',
			layout : 'vertical',

		});
		bottomRightHalf = Ti.UI.createView({
			width : '50%',
			layout : 'vertical',
			//backgroundColor : '#AAAAAA'
			//backgroundColor : 'blue'
		});
		dlEstLabel = Ti.UI.createLabel({
			//right : '2%',
			text : 'Estimated Delivery Time:',

			color : '#fff',
			font : openWindow.GLOBALS.xSmallFont,
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		});
		Ti.API.info('@@@ DEBUG @@@ : jobData.dlEstimateTime : ' + jobData.dlEstimateTime + ' new Date(jobData.dlEstimateTime)' + new Date(jobData.dlEstimateTime))
		dlEstPicker = Custom.UI.createPicker(openWindow.GLOBALS);
		if (jobData.dlRequired === 'false') {
			dlEstLabel.text = "Delivery Not Required";
			//dlEstPicker.visible = false;
		}
		buttonView = Ti.UI.createView({
			height : openWindow.GLOBALS.fieldHeight,
			layout : 'horizontal',
			backgroundColor : '#000',
			height : '10%',
			width : '100%'
			//backgroundImage : 'img/bar-2.png',
		});
		acceptButton = Ti.UI.createButton({
			title : 'Update ' + jobData.controlNumber,
			width : '100%',
			height : '100%',
			font : openWindow.GLOBALS.smallFont,
			id : jobData.id,
			backgroundColor : '#808080',
			borderWidth : 1,
			borderColor : '#303030',
			height : '100%',
			backgroundSelectedColor : '#303030',
			backgroundDisabledColor : '#00FF00',
		});
		buttonView.add(acceptButton);

		topView.add(controlNumberLabel);
		midLeftHalf.add(puLabel);

		bottomLeftHalf.add(dlLabel);
		midView.add(midLeftHalf);
		midView.add(midRightHalf);
		midRightHalf.add(puEstLabel);
		if (jobData.puRequired === 'true') {
			//midRightHalf.add(puEstLabel);
			midRightHalf.add(puEstPicker);
		}
		bottomView.add(bottomLeftHalf);
		bottomView.add(bottomRightHalf);
		bottomRightHalf.add(dlEstLabel);
		if (jobData.dlRequired === 'true') {
			//bottomRightHalf.add(dlEstLabel);
			bottomRightHalf.add(dlEstPicker);
		}
		row.add(topView);
		row.add(midView);
		row.add(bottomView);
		row.add(buttonView);
		if (thisSortDate !== lastSortDate) {
			row.header = "Scheduele For Date : " + thisSortDate;
		}
		lastSortDate = thisSortDate;
		this.acceptTheJob = function() {

			var response = true, schedObj, ts = new Date();
			var FixJSTimestamp = require('FixJSTimestamp');
			var now = FixJSTimestamp(ts);
			this.enabled = false;

			if (jobData.puRequired === 'false' || jobData.puRequired === false) {
				schedObj = {
					username : openWindow.GLOBALS.username,
					controlNumber : jobData.controlNumber,
					puEstEnteredTime : null,
					puEstimateTimeStamp : null,
					dlEstimateTime : jobData.sortDate + " " + dlEstPicker.timeValue,
					dlEstEnteredTime : now.timestamp,
					tagJobId : jobData.id,
					sortDate : jobData.sortDate
				};
			} else if (jobData.dlRequired === 'false' || jobData.dlRequired === false) {
				schedObj = {
					username : openWindow.GLOBALS.username,
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
			sql.updateSchedForJob(schedObj);
			sql.addUpdateToQueue(jobData.id, 'schedule');

		};
		acceptButton.addEventListener('click', this.acceptTheJob);
		rowsArray.push(row);
	};
	this.addRowsToTable = function() {
		scrollView.views = rowsArray;
	};
	var i = 0;
	var j = 0;
	var DataBase = require('db');
	var sql = DataBase();
	var theSched = sql.selectSchedForView();
	for (i; i < theSched.results.length; i++) {
		this.buildTheRows(theSched.results[i]);
	}
	that.addRowsToTable();
	var _resultsLength = theSched.results.length;
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
	var killAll = function() {
		var gc = require('GC');
		Ti.API.warn('killAll FIRED')
		gc(openWindow.win);
		gc(scrollView);
		gc(navigationWrap);
		openWindow.win.removeEventListener('close', killAll);
	}
	openWindow.win.addEventListener('close', killAll);
	openWindow.win.open();
	Ti.API.info('@@@@ MEM DEBUG @@@@ Available Memory : ' + Ti.Platform.availableMemory);
}

module.exports = agendaWindow;
