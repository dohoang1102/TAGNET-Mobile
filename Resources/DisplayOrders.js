function DisplayOrders() {

	var self = this;
	//this.enabled = false;
	//setTimeout(function() {
	//	self.enabled = true;
	//}, 1000);

	var that, views;
	views = [];
	that = this;
	var lastSelectedIndex = 0, lastSelectedControlNumber = 0;
	var TabledWindow = require('TabledWindow');
	var openWindow = TabledWindow(), titleLabel = Ti.UI.createLabel({
		right : '1%',
		//text : 'Help With Open Jobs',
		text : 'Open Jobs',
		color : '#fff',
		font : openWindow.GLOBALS.largeFont,

	}), sortView = Ti.UI.createView({
		height : '10%',
		//backgroundImage : openWindow.GLOBALS.mainBar,
		//backgroundImage : openWindow.GLOBALS.mainBar,
		backgroundColor : '#000000',
		layout : 'vertical'
	});
	openWindow.win.backgroundImage = 'open_bg.jpg';
	openWindow.backLabel.color = "#fff";
	openWindow.navBar.backgroundColor = "#55000000";
	openWindow.win.remove(openWindow.table);
	openWindow.table = null;
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

	navigationWrap.add(lastPageButton);
	navigationWrap.add(currentPageLabel);
	navigationWrap.add(nextPageButton);
	sortView.add(navigationWrap);
	openWindow.win.add(sortView);
	function buildThePages(data) {
		var jobData = data, puCurrentStatus, dlCurrentStatus, rows = [], mySort;
		if (data.puRequired === 'false') {
			puCurrentStatus = 'na';
		} else if (data.puComplete === 'true') {
			mySort = jobData.dlAtReqArriveTime
			puCurrentStatus = true;
		} else {
			mySort = jobData.puAtReqArriveTime
			puCurrentStatus = false;
		}
		if (data.dlRequired === 'false') {
			dlCurrentStatus = 'na';
		} else if (data.dlComplete === 'true') {
			dlCurrentStatus = true;
		} else {
			//mySort = jobData.dlAtReqArriveTime
			dlCurrentStatus = false;
		}
		this.fullView = Ti.UI.createView({
			height : '100%',
			width : '100%',
			layout : 'vertical',
			sortTime : mySort
		});
		this.table = Ti.UI.createTableView();

		/*
		*
		* Controls
		*
		*/
		//this.controlRow = Ti.UI.createTableViewRow();
		this.controlView = Ti.UI.createView({
			height : openWindow.GLOBALS.medIconSize * 1.5,
			backgroundColor : '#55000000',
			//backgroundImage : 'img/bar-2.png',
			layout : 'horizontal',
			//bottom : 0
		});
		this.iconWrap1 = Ti.UI.createView({
			height : '100%',
			width : '33%',
			//backgroundColor : 'red',
			layout : 'vertical'
		});
		this.updatePuButton = Ti.UI.createButton({
			top : '10%',
			height : openWindow.GLOBALS.medIconSize,
			width : openWindow.GLOBALS.medIconSize,
			backgroundImage : openWindow.GLOBALS.updateIcon,
			backgroundSelectedImage : openWindow.GLOBALS.updateIconSelected,
			backgroundDisabledImage : openWindow.GLOBALS.updateIconSelected
		});
		this.updatePuLabel = Ti.UI.createLabel({
			text : 'POD Now',

			font : openWindow.GLOBALS.smallFont,

			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		});
		this.iconWrap1.add(this.updatePuButton);
		this.iconWrap1.add(this.updatePuLabel);
		//2
		this.iconWrap2 = Ti.UI.createView({
			height : '100%',
			width : '33%',
			layout : 'vertical',
			visible : false
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

		//3
		this.iconWrap3 = Ti.UI.createView({
			height : '100%',
			width : '33%',
			layout : 'vertical'
		});
		this.addPhotoButton = Ti.UI.createButton({
			top : '10%',
			height : openWindow.GLOBALS.medIconSize,
			width : openWindow.GLOBALS.medIconSize,
			backgroundImage : openWindow.GLOBALS.cameraIcon,
			backgroundSelectedImage : openWindow.GLOBALS.cameraIconSelected,
			backgroundDisabledImage : openWindow.GLOBALS.cameraIconSelected
		});
		this.addPhotoLabel = Ti.UI.createLabel({
			text : 'Damage Photo',

			font : openWindow.GLOBALS.smallFont,

			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		});
		this.iconWrap3.add(this.addPhotoButton);
		this.iconWrap3.add(this.addPhotoLabel);

		this.takeAPic = function() {
			//this.enabled = false;
			var controlNumbersToEmail = [];
			controlNumbersToEmail.push(jobData.controlNumber);
			var camera = require('OpenCamera');
			camera(controlNumbersToEmail);
		}
		this.addPhotoButton.addEventListener('click', this.takeAPic);

		this.addPhotoLabel.addEventListener('click', this.takeAPic);

		function fireThePuUpdate() {
			var that = this;
			this.enabled = false;
			sql = null;
			var UpdateJob = require('UpdateJob_2');
			var openUpdate = UpdateJob(jobData, 0);
			//scrollView = null;
			setTimeout(function() {
				that.enabled = true;
			}, 1000);
			openWindow.gcWindow();
			//openWindow.win.close();
			//openWindow.win = null;
		}

		function fireTheDlUpdate() {
			var that = this;
			this.enabled = false;
			sql = null;
			var UpdateJob = require('UpdateJob_2');
			var openUpdate = UpdateJob(jobData, 1);
			//scrollView = null;
			//openWindow.win.close();
			//openWindow.win = null;
			openWindow.gcWindow();
			setTimeout(function() {
				that.enabled = true;
			}, 1000);
		}

		//updateDlButton.addEventListener('click', fireTheDlUpdate);

		//updateDlLabel.addEventListener('click', fireTheDlUpdate);

		this.controlView.add(this.iconWrap1);
		this.controlView.add(this.iconWrap3);
		this.controlView.add(this.iconWrap2);
		this.fullView.add(this.controlView);
		//this.controlRow.add(this.controlView);
		//rows.push(this.controlRow);
		//title

		this.getSlaves = function() {
			var x = 0;
			var _arr = [];
			this.getTheSlaves = sql.selectSlaveJobs(jobData.id);

			for (x; x < this.getTheSlaves.results.length; x++) {
				_arr.push(this.getTheSlaves.results[x].controlNumber);
			};
			this.slaves = _arr;
			return this;
		}
		var checkForSlaves = this.getSlaves();

		this.titleRow = Ti.UI.createTableViewRow();
		this.labelView = Ti.UI.createView({
			height : 'auto',
			//backgroundColor : '#ccc',
			top : 0,
			layout : 'vertical'
		});
		this.controlNumberLabel = Ti.UI.createLabel({

			left : '1%',
			color : '#fff',
			font : openWindow.GLOBALS.font,
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		});

		if (checkForSlaves.slaves.length > 0) {
			this.controlNumberLabel.text = 'Brand: ' + jobData.brand + '\nControlNumber(s) : ' + jobData.controlNumber + ', ' + checkForSlaves.slaves.toString() + '\n\nReference: ' + jobData.reference + (jobData.bol == null ? '' : '\nBOL: ' + jobData.bol ) + '\nService Type: ' + jobData.serviceType + '\n\nRequire Vehicle Type: ' + jobData.vehType + '\nWeight: ' + jobData.weight + ' Pieces: ' + jobData.pieces;
		} else {
			this.controlNumberLabel.text = 'Brand: ' + jobData.brand + '\nControlNumber(s) : ' + jobData.controlNumber + '\n\nReference: ' + jobData.reference + (jobData.bol == null ? '' : '\nBOL: ' + jobData.bol ) + '\nService Type: ' + jobData.serviceType + '\n\nRequire Vehicle Type: ' + jobData.vehType + '\nWeight: ' + jobData.weight + ' Pieces: ' + jobData.pieces;
		}
		this.labelView.add(this.controlNumberLabel);
		this.titleRow.add(this.labelView);
		rows.push(this.titleRow);
		//locations

		this.locationRow = Ti.UI.createTableViewRow();
		this.locationWrap = Ti.UI.createView({
			layout : 'vertical',
			height : 'auto'
		});
		this.locationLeft = Ti.UI.createView({
			layout : 'vertical',
			width : '100%',
			height : 'auto',
			backgroundColor : '#99000000',
			//left : 0,
			//borderRadius : 5,
			//backgroundColor : '#fff',
			borderWidth : 1,
			borderColor : '#fff'
		});
		this.locationRight = Ti.UI.createView({
			layout : 'vertical',
			width : '100%',
			//right : 0,
			height : 'auto',
			backgroundColor : '#99000000',
			//borderRadius : 5,
			borderWidth : 1,
			//backgroundColor : '#fff',
			borderColor : '#fff'
		});
		this.puHeader = Ti.UI.createLabel({
			text : 'Pickup',
			color : '#33b5e5',
			font : openWindow.GLOBALS.largeFont,
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		});
		this.puLabel = Ti.UI.createLabel({
			left : '2%',

			text : 'Customer :\n' + jobData.puAtName + '\nAttention :\n' + (jobData.puAtAttn === null ? '' : jobData.puAtAttn) + '\n\nLocation:\n' + jobData.puAtAddress + '' + ((jobData.puAtRFD === null) ? '' : '\n' + jobData.puAtRFD) + '\n' + jobData.puAtCity + '\n(touch for map)\n\nPU Requested:\n' + jobData.puAtReqArriveTime,

			color : '#fff',
			font : openWindow.GLOBALS.font,

			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		});
		this.puLabel.addEventListener('click', function() {
			var intent = Ti.Android.createIntent({
				action : Ti.Android.ACTION_VIEW,
				data : 'geo:0,0+?q=' + jobData.puAtAddress + ' ' + jobData.puAtCity
			});
			Ti.Android.currentActivity.startActivity(intent);
		});

		this.puStatus = Ti.UI.createLabel({
			left : '2%',

			font : openWindow.GLOBALS.font,

			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		});
		
		this.puSpecialInstruction = Ti.UI.createLabel({
			left : '2%',

			text : 'Special Instructions : ' +  (jobData.puSpecialInstruction === null ? 'N/A, scroll down to see if notes available.': jobData.puSpecialInstruction), 

			color : '#FF00FF',
			font : openWindow.GLOBALS.font,

			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		});
		
		this.dlHeader = Ti.UI.createLabel({
			text : 'Delivery',
			color : '#33b5e5',
			font : openWindow.GLOBALS.largeFont,
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		});
		this.dlLabel = Ti.UI.createLabel({
			left : '2%',
			text : 'Customer :\n' + jobData.dlToName + (jobData.dlToAttn === null ? '' : '\nAttention :\n' + jobData.dlToAttn) + '\n\nLocation:\n' + jobData.dlToAddress + '' + ((jobData.dlToRFD === null) ? '' : '\n' + jobData.dlToRFD) + '\n' + jobData.dlToCity + '\n(touch for map)\n\nDL Requested:\n' + jobData.dlAtReqArriveTime,

			color : '#fff',
			font : openWindow.GLOBALS.font,

			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		});

		this.dlLabel.addEventListener('click', function() {
			var intent = Ti.Android.createIntent({
				action : Ti.Android.ACTION_VIEW,
				data : 'geo:0,0+?q=' + jobData.dlToAddress + ' ' + jobData.dlToCity
			});
			Ti.Android.currentActivity.startActivity(intent);
		});
		this.dlStatus = Ti.UI.createLabel({
			left : '2%',

			font : openWindow.GLOBALS.font,

			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		});
		this.dlSpecialInstruction = Ti.UI.createLabel({
			left : '2%',

			text : 'Special Instructions : ' + (jobData.dlSpecialInstruction === null ? 'N/A, scroll down to see if notes available.': jobData.dlSpecialInstruction),

			color : '#FF00FF',
			font : openWindow.GLOBALS.font,

			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		});
		if (puCurrentStatus === true) {
			this.dlLabel.color = '#fff';
			this.puLabel.color = '#ccc';
			this.locationWrap.add(this.locationRight);
			this.locationWrap.add(this.locationLeft);

		} else {
			this.dlLabel.color = '#ccc';
			this.puLabel.color = '#fff';

			this.locationWrap.add(this.locationLeft);
			this.locationWrap.add(this.locationRight);
		}
		this.locationLeft.add(this.puHeader);
		this.locationLeft.add(this.puLabel);
		this.locationLeft.add(this.puStatus);
		this.locationLeft.add(this.puSpecialInstruction);
		this.locationRight.add(this.dlHeader);
		this.locationRight.add(this.dlLabel);
		this.locationRight.add(this.dlStatus);
		this.locationRight.add(this.dlSpecialInstruction);
		this.locationRow.add(this.locationWrap);
		rows.push(this.locationRow);
		if (puCurrentStatus === true) {
			//updatePuLabel.text = 'Pickup Complete';
			this.puStatus.text = 'Complete';
			this.puStatus.color = 'green';
			this.updatePuLabel.addEventListener('click', fireTheDlUpdate);

			this.updatePuButton.addEventListener('click', fireTheDlUpdate);

		} else if (puCurrentStatus === false) {
			this.updatePuButton.addEventListener('click', fireThePuUpdate);
			this.updatePuLabel.addEventListener('click', fireThePuUpdate);
			this.puStatus.text = 'Outstanding';
			this.puStatus.color = 'red';

		} else {
			this.updatePuLabel.addEventListener('click', fireTheDlUpdate);
			this.updatePuButton.addEventListener('click', fireTheDlUpdate);
			this.puStatus.text = 'N/A On Mobile';
			this.puStatus.color = 'blue';
		}

		if (dlCurrentStatus === true) {
			this.dlStatus.text = 'Delivery Complete';
			this.dlStatus.text = 'Complete';
			this.dlStatus.color = 'green';

		} else if (dlCurrentStatus === false) {

			this.dlStatus.text = 'Outstanding';
			this.dlStatus.color = 'red';

		} else {
			this.updateDlLabel.visible = false;
			this.updateDlButton.visible = false;
			this.dlStatus.text = 'N/A On Mobile';
			this.dlStatus.color = 'blue';
		}
		if (jobData.puAtPhone) {
			rows.push(Ti.UI.createTableViewRow({
				title : 'Pickup Location Phone Number :\n' + jobData.puAtPhone + '\n(touch to dial)',
				font : openWindow.GLOBALS.font,
				color : '#fff',
				phone : jobData.puAtPhone,
				leftImage : openWindow.GLOBALS.moreIconSelected
			}));
		}
		if (jobData.dlToPhone) {
			rows.push(Ti.UI.createTableViewRow({
				title : 'Delivery Location Phone Number :\n' + jobData.dlToPhone + '\n(touch to dial)',
				font : openWindow.GLOBALS.font,
				color : '#fff',
				phone : jobData.dlToPhone,
				leftImage : openWindow.GLOBALS.moreIconSelected
			}));
		}
		try {

			if (rows[2].phone) {
				rows[2].addEventListener('click', function() {
					//alert(this.phone);
					Ti.Platform.openURL('tel:' + this.phone);
				});

			}
		} catch(err) {
			Ti.API.warn(err);
		}
		try {
			if (rows[3].phone) {
				rows[3].addEventListener('click', function() {
					Ti.Platform.openURL('tel:' + this.phone);
				});
			}
		} catch(err) {
			Ti.API.warn(err);
		}
		Ti.API.warn(JSON.stringify(rows));

		this.getNotes = function() {
			var x = 0;

			this.getTheNotes = sql.selectDriverNotes(jobData.id);

			for (x; x < this.getTheNotes.results.length; x++) {
				rows.push(Ti.UI.createTableViewRow({
					title : this.getTheNotes.results[x].note,
					font : openWindow.GLOBALS.largeFont,
					color : '#fff'
				}));
			};

		}
		this.getNotes();
		var deleterow = Ti.UI.createTableViewRow(), deleteButton = Ti.UI.createButton({
			title : 'Delete Job From Device',
			height : 'auto',
			font : openWindow.GLOBALS.largeFont,
			width:'100%',
			backgroundColor:'red',
			backgroundSelectedColor:'#000',
			color:'#fff',
			controlNumber : jobData.controlNumber
		});
		deleterow.add(deleteButton);
		deleteButton.addEventListener('click', function() {
			var self = this;
			var opts = {
				title : 'Are you sure you would like to permanently delete? '
			};
			opts.options = ['I am sure', 'Cancel'];
			//opts.buttonNames = ['Confirm'];
			var dialog = Ti.UI.createOptionDialog(opts);
			dialog.show();
			dialog.addEventListener('click', function(e) {
				var n = e.index;
				switch(n) {
					case 0:
						var sql = require('db')();
						sql.deleteTheJobs(parseInt(self.controlNumber));
						var toast = Ti.UI.createNotification({
							message : "Complete! next time you enter this screen, the job will be removed..",
							duration : Ti.UI.NOTIFICATION_DURATION_SHORT
						});
						toast.show();
						openWindow.backButton.fireEvent('click');
						break;
					case 1:
						var toast = Ti.UI.createNotification({
							message : "Action canceled..",
							duration : Ti.UI.NOTIFICATION_DURATION_SHORT
						});
						toast.show();
						break;
				}
			});
		});
		rows.push(deleterow);
		this.table.data = rows;
		this.fullView.add(this.table);
		views.push(this.fullView);
	};
	function addViewsToScroll() {

		views.sort(function(a, b) {
			a.sortTime = new Date(a.sortTime);
			b.sortTime = new Date(b.sortTime);
			Ti.API.warn(a.sortTime + ", " + b.sortTime);
			return a.sortTime - b.sortTime;
		});

		scrollView.views = views;
	};

	//openWindow.table.data = data;
	var i = 0;
	var DataBase = require('db');
	var sql = DataBase();
	var jobs = [];
	jobs = sql.selectJobs();
	var _results = jobs.results;
	for (i; i < _results.length; i++) {
		Ti.API.info('@@@ DEBUG @@@@ controlNumber : ' + _results[i].controlNumber);
		buildThePages(_results[i]);
	}

	addViewsToScroll();

	currentPageLabel.text = 'Page 1 of ' + (_results.length=== 0 ? 1 : _results.length);

	scrollView.addEventListener('scroll', function() {
		Ti.API.info('@@@@@ DEBUG @@@@@ this.currentPage : ' + this.currentPage);

		activePage = this.currentPage;
		currentPageLabel.text = 'Page ' + (this.currentPage + 1) + ' of ' + _results.length;

		if (activePage === (_results.length - 1)) {

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
	if (_results.length === 0) {
		nextPageButton.enabled = false;
		nextPageButton.backgroundColor = '#000';
	}
	nextPageButton.addEventListener('click', function() {
		scrollView.currentPage = (activePage + 1);
	});
	lastPageButton.addEventListener('click', function() {
		scrollView.currentPage = (activePage - 1);
	});
	openWindow.navBar.add(titleLabel);

	//setTimeout(function() {
	//	scrollUp.visible = false;
	//	scrollDown.visible = false;
	//}, 20000);
	var killAll = function() {
		var gc = require('GC');
		Ti.API.warn('killAll FIRED')
		//gc(openWindow.win);
		i = null;
		DataBase = null;
		sql = null;
		jobs.length = 0;
		delete jobs;
		jobs = null;

		gc(scrollView);
		gc(navigationWrap);
		for (var i = 0; i < views.length; i++) {
			gc(views[i]);
		}
		that = null, views = null;

		lastSelectedIndex = null, lastSelectedControlNumber = null;
		TabledWindow = null;
		_results = null;
		openWindow = null;
		win.removeEventListener('close', killAll);
	}
	openWindow.win.addEventListener('close', killAll);
	openWindow.win.open();
	Ti.API.info('@@@@ MEM DEBUG @@@@ Available Memory : ' + Ti.Platform.availableMemory);
}

module.exports = DisplayOrders;
