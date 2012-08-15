function historyWindow() {
	var self = this;
	//this.enabled = false;
	//setTimeout(function() {
	//	self.enabled = true;
	//}, 1000);

	var that, rows;
	rows = [];
	that = this;
	var TabledWindow = require('TabledWindow');
	var openWindow = TabledWindow(), titleLabel = Ti.UI.createLabel({
		right : '1%',
		//text : 'Help With History',
		text : 'History',

		color : '#fff',
		font : openWindow.GLOBALS.largeFont,
		textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
	}), sortView = Ti.UI.createView({
		height : '10%',
		//backgroundImage : openWindow.GLOBALS.mainBar,
		backgroundColor : '#000',
		layout : 'vertical'
	});
	openWindow.win.remove(openWindow.table);
	openWindow.table = null;
	openWindow.win.backgroundImage = 'hisorty_bg.jpg';
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
		backgroundColor : '#55000000'
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
	that = {
		buildRow : function(data) {
			var row, wrapper, controlView, labelView, controlNumberLabel, jobData, locationWrap, locationLeft, locationRight, puLabel, puStatus, dlLabel, dlStatus, controlView, puCurrentStatus, dlCurrentStatus;
			jobData = data;
			if (data.puRequired === 'false') {
				puCurrentStatus = 'na';
			} else if (data.puComplete === 'true') {
				puCurrentStatus = true;
			} else {
				puCurrentStatus = false;
			}
			if (data.dlRequired === 'false') {
				dlCurrentStatus = 'na';
			} else if (data.dlComplete === 'true') {
				dlCurrentStatus = true;
			} else {
				dlCurrentStatus = false;
			}
			row = Ti.UI.createView({
				layout : 'vertical',
				controlNumber : jobData.controlNumber,
				puName : jobData.puAtName,
				dlName : jobData.dlToName,
				puZip : jobData.puAtCity,
				dlZip : jobData.dlToCity,
				puTime : jobData.puAtReqArriveTime,
				dlTime : jobData.dlAtReqArriveTime,
				height : '100%',
				width : '100%'
			});
			wrapper = Ti.UI.createView({
				height : 'auto',
				layout : 'vertical'
			});
			labelView = Ti.UI.createView({
				height : 'auto',
				//backgroundColor : '#fff',
				top : 0,
				layout : 'vertical'
			});
			controlNumberLabel = Ti.UI.createLabel({
				text : 'ControlNumber : ' + jobData.controlNumber + '\nReference: ' + jobData.reference,

				color : '#fff',
				font : openWindow.GLOBALS.font,
				textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			});

			locationWrap = Ti.UI.createView({
				layout : 'absolute',
				height : 'auto',
				//backgroundColor : '#fff',
				bottom : 0
			});
			locationLeft = Ti.UI.createView({
				layout : 'vertical',
				width : '50%',
				backgroundColor : '#99000000',
				left : 0,
				//borderRadius : 5,
				borderWidth : 1,
				borderColor : '#fff',
				top : 0,
				bottom : 0
				//height:'100%'
			});
			locationRight = Ti.UI.createView({
				layout : 'vertical',
				width : '50%',
				backgroundColor : '#99000000',
				right : 0,
				//borderRadius : 5,
				borderWidth : 1,
				borderColor : '#fff',
				//height:'100%'
				top : 0
			});
			puLabel = Ti.UI.createLabel({
				left : '2%',

				text : 'Pickup from :\n' + jobData.puAtName + '\n\nLocation:\n' + jobData.puAtCity + '\n\nPU Requested:\n' + jobData.puAtReqArriveTime + '\n\n',

				color : '#fff',
				font : openWindow.GLOBALS.smallFont,

				textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			});

			puStatus = Ti.UI.createLabel({
				left : '2%',

				font : openWindow.GLOBALS.font,

				textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			});

			dlLabel = Ti.UI.createLabel({
				right : '2%',
				text : 'Deliver to :\n' + jobData.dlToName + '\n\nLocation:\n' + jobData.dlToCity + '\n\nDL Requested:\n' + jobData.dlAtReqArriveTime + '\n\n',

				color : '#fff',
				font : openWindow.GLOBALS.smallFont,

				textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
			});
			dlStatus = Ti.UI.createLabel({
				right : '2%',

				font : openWindow.GLOBALS.font,

				textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
			});

			/*
			 *
			 * Toolbar for controls
			 *
			 *
			 */
			controlView = Ti.UI.createView({
				height : openWindow.GLOBALS.medIconSize * 1.5,
				backgroundColor : '#55000000',
				//backgroundImage : 'img/bar-2.png',
				layout : 'horizontal',
				//bottom : 0
			});
			//2
		this.iconWrap2 = Ti.UI.createView({
			height : '100%',
			width : '49%',
			layout : 'vertical',
			visible:false
		});
		this.addDocButton = Ti.UI.createButton({
			top : '10%',
			height : openWindow.GLOBALS.medIconSize,
			width : openWindow.GLOBALS.medIconSize,
			backgroundImage : openWindow.GLOBALS.cameraIcon,
			backgroundSelectedImage : openWindow.GLOBALS.cameraIconSelected,
			backgroundDisabledImage : openWindow.GLOBALS.cameraIconSelected
		});
		this.addDocLabel = Ti.UI.createLabel({
			text : 'Attache Document',

			font : openWindow.GLOBALS.smallFont,

			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		});
		this.iconWrap2.add(this.addDocButton);
		this.iconWrap2.add(this.addDocLabel);
		this.addDocButton.addEventListener('click', addDoc);
		function addDoc() {
			var opts = {
				title : 'Please choose a document type. '
			};
			opts.options = ['AIM', 'BDO', 'BOL', 'ECF', 'Manifest', 'Misc', 'Other', 'Packing Slip', 'WayBill', 'Third Party Manifest', 'Ticket'];
			opts.buttonNames = ['Cancel'];
			var dialog = Ti.UI.createOptionDialog(opts);
			dialog.show();
			dialog.addEventListener('click', function(e) {
				if (e.button) {
					var toast = Ti.UI.createNotification({
						message : "TAGNET : Document Canceled",
						duration : Ti.UI.NOTIFICATION_DURATION_SHORT
					});
					toast.show();
				} else {

					var n = e.index;
					var doc = this.options[n];
					Ti.API.warn(this.options[n]);
					var theData = {
						ControlNumber : jobData.controlNumber,
						CompanyNumber : jobData.companyNumber,
						username : Ti.App.username,
						doctype : this.options[n]
					}
					var doc = require('Document')(theData);
				}
			});

		}
		
		
		
			var iconWrap3 = Ti.UI.createView({
				height : '100%',
				width : '50%',
				layout : 'vertical'
			});
			var addPhotoButton = Ti.UI.createButton({
				top : '10%',
				height : openWindow.GLOBALS.medIconSize,
				width : openWindow.GLOBALS.medIconSize,
				backgroundImage : openWindow.GLOBALS.cameraIcon,
				backgroundSelectedImage : openWindow.GLOBALS.cameraIconSelected
			});
			var addPhotoLabel = Ti.UI.createLabel({
				text : 'Damage Photo',

				font : openWindow.GLOBALS.smallFont,

				textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			});
			iconWrap3.add(addPhotoButton);
			iconWrap3.add(addPhotoLabel);

			this.takeAPic = function() {
				var controlNumbersToEmail = [];
				controlNumbersToEmail.push(jobData.controlNumber);
				var OpenCamera = require('OpenCamera');
				var camera = OpenCamera(controlNumbersToEmail);
			}
			addPhotoButton.addEventListener('click', this.takeAPic);
			addPhotoLabel.addEventListener('click', this.takeAPic);

			if (puCurrentStatus === true) {
				//	updatePuLabel.text = 'Pickup Complete';
				puStatus.text = 'POP Complete';
				puStatus.color = 'green';

			} else if (puCurrentStatus === false) {

				puStatus.text = 'POD Outstanding';
				puStatus.color = 'red';

			} else {
				//updatePuButton.visible = false;
				//updatePuLabel.visible = false;
				puStatus.text = 'N/A On Mobile';
				puStatus.color = 'blue';
			}

			if (dlCurrentStatus === true) {
				dlStatus.text = 'POD Complete';
				//dlStatus.text = 'Complete';
				dlStatus.color = 'green';

			} else if (dlCurrentStatus === false) {

				dlStatus.text = 'POD Outstanding';
				dlStatus.color = 'red';

			} else {
				//updateDlLabel.visible = false;
				//updateDlButton.visible = false;
				dlStatus.text = 'N/A On Mobile';
				dlStatus.color = 'blue';
			}

			controlView.add(iconWrap3);
			controlView.add(this.iconWrap2);

			row.add(wrapper);
			wrapper.add(controlView);
			wrapper.add(labelView);

			labelView.add(controlNumberLabel);
			labelView.add(locationWrap);
			locationWrap.add(locationRight);
			locationWrap.add(locationLeft);

			locationLeft.add(puLabel);
			locationLeft.add(puStatus);
			locationRight.add(dlLabel);
			locationRight.add(dlStatus);

			rows.push(row);
		},
		addRowsToTable : function() {
			scrollView.views = rows;
		}
	}

	//openWindow.table.data = data;
	var i = 0;
	var DataBase = require('db');
	var sql = DataBase();
	var jobs = [];
	jobs = sql.selectHistoryJobs();
	var _results = jobs.results;
	for (i; i < _results.length; i++) {
		//Ti.API.info('@@@ DEBUG @@@@ controlNumber : ' + _results[i].controlNumber);
		that.buildRow(_results[i]);
	}
	//for(i; i < testDataArray.length; i++) {
	//	that.buildRow(testDataArray[i]);
	//}
	that.addRowsToTable();
	var _resultsLength = _results.length;
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

module.exports = historyWindow;
