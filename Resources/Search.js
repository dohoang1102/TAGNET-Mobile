var SEARCH = (function() {
	var app = {
		view : {},
		model : {},
		controller : {}
	};
	var loadGlobals = require('SlimGlobals');
	var GLOBALS = loadGlobals();
	var v = app.view, m = app.model;
	v.fullView = Ti.UI.createView({
		height : '70%',
		visible : false,
		zIndex : 10,
		top : '-85%',
		backgroundColor : '#000',
		width : '100%',
		left : 0,
		borderColor : '#ccc',
		borderWidth : 1,
		layout : 'vertical',
		opacity : .9
	});
	v.titleWrap = Ti.UI.createView({
		width : '100%',
		height : '15%',
		//borderColor:'#ccc',
		//borderWidth:1,

	});
	v.title = Ti.UI.createButton({
		title : 'Search',
		left : '2%'
	});
	v.searchBox = Ti.UI.createTextField({
		hintText : 'Enter Control Number',
		right : '2%',
		height : '100%'
	});
	v.titleWrap.add(v.title);
	v.titleWrap.add(v.searchBox);
	//v.fullView.add(v.titleWrap);
	v.resultsView = Ti.UI.createScrollView({
		width : '100%',
		height : '100%',
		contentWidth : 'auto',
		contentHeight : 'auto',
		showVerticalScrollIndicator : true,
		//showHorizontalScrollIndicator : true,
		//backgroundColor:'red'
		layout : 'vertical'
	});

	v.buildRows = function(data) {
		var main = Ti.UI.createView({
			height : 100,
			width : '100%',
			layout : 'horizontal',
			backgroundColor:'#55000000',
			borderColor:'#55ffffff',
			borderWidth:1,
			top : 0,
			//backgroundColor:'red'
		});
		var left = Ti.UI.createView({
			height : '100%',
			width : '40%',
			//layout : 'vertical',
			//backgroundColor:'red'
		});
		var controlNumber = Ti.UI.createLabel({
			text : 'Control Number : ',
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			color : '#fff',
			font:GLOBALS.smallFont
		});
		var center = Ti.UI.createView({
			height : '100%',
			width : '40%',
			//layout : 'vertical',
			//backgroundColor:'red'
		});
		var city = Ti.UI.createLabel({
			text : 'Name\nCity : ',
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			color : '#fff',
			font:GLOBALS.smallFont
		});
		center.add(city);
		var right = Ti.UI.createView({
			height : '100%',
			width : '20%',
			layout : 'vertical'
		});
		var update = Ti.UI.createLabel({
			text : 'Update',
			height : '100%',
			width : '100%',
			font:GLOBALS.smallFont,
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			color : '#fff'
		});

		left.add(controlNumber);
		main.add(left);
		main.add(center);
		right.add(update);
		main.add(right);
		v.resultsView.add(main);
		var _data = data.sort(function(a, b) {
			//Ti.API.info(a.puName+" : " + b.puName);
			if (a.puAtCity === null || a.dlToCity === null) {
				return;
			}
			if (a.puComplete == 'true' || a.puRequired == 'false') {
				a.val = a.dlToCity || 'none';
			} else {
				a.val = a.puAtCity || 'none';
			}
			if (b.puComplete == 'true' || b.puRequired == 'false') {
				b.val = b.dlToCity || 'none';
			} else {
				b.val = b.puAtCity || 'none';
			}
			a.val = a.val.toLowerCase();
			b.val = b.val.toLowerCase();
			return a.val.localeCompare(b.val);
		});
		var i = 0;
		var viewArray = [];
		for (i; i < _data.length; i++) {
			Ti.API.warn(_data[i].controlNumber);
			viewArray[i] = {};
			viewArray[i].main = Ti.UI.createView({
				height : 100,
				width : '100%',
				layout : 'horizontal',
				backgroundColor:'#55000000',
			borderColor:'#55ffffff',
			borderWidth:1,
				top : 0,
				//backgroundColor:'red'
			});
			viewArray[i].left = Ti.UI.createView({
				height : '100%',
				width : '40%',
				//layout : 'vertical',
				//backgroundColor:'red'
			});
			viewArray[i].controlNumber = Ti.UI.createLabel({
				text : _data[i].controlNumber,
				textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
				color : '#fff',
				font:GLOBALS.smallFont,
			});
			viewArray[i].center = Ti.UI.createView({
				height : '100%',
				width : '40%',
				//layout : 'vertical',
				//backgroundColor:'red'
			});
			viewArray[i].city = Ti.UI.createLabel({
				//text : data[i].controlNumber
				textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
				font:GLOBALS.smallFont,
				color : '#fff'
			});
			viewArray[i].center.add(viewArray[i].city);
			viewArray[i].right = Ti.UI.createView({
				height : '100%',
				width : '20%',
				layout : 'vertical'
			});
			viewArray[i].update = Ti.UI.createButton({
				//title :'POD',
				font:GLOBALS.smallFont,
				height : '100%',
				width : '100%',

			});
			if (_data[i].puRequired === 'false' || _data[i].puComplete === 'true') {
				viewArray[i].city.text = (_data[i].dlToName === null ? 'N\/A' : _data[i].dlToName) + '\n' + _data[i].dlToCity;
				viewArray[i].update.title = "POD";
				viewArray[i].update.type = 1;

			} else {
				viewArray[i].city.text = (_data[i].puAtName === null ? 'N\/A' : _data[i].puAtName) + '\n' + _data[i].puAtCity;
				viewArray[i].update.title = "POP";
				viewArray[i].update.type = 0;
			}
			viewArray[i].update.jobData = _data[i];
			viewArray[i].update.addEventListener('click', app.controller.updateJob);
			viewArray[i].left.add(viewArray[i].controlNumber);
			viewArray[i].main.add(viewArray[i].left);
			viewArray[i].main.add(viewArray[i].center);
			viewArray[i].right.add(viewArray[i].update);
			viewArray[i].main.add(viewArray[i].right);
			v.resultsView.add(viewArray[i].main);
		}
		v.fullView.add(v.resultsView);
		return;

	}
	m.getJobs = function() {
		var db = require('db');
		var sql = db();
		//var jobs = [];
		jobs = sql.selectJobs();
		var _results = jobs.results;
		v.buildRows(_results);
		return;
	}
	app.controller.hide = function() {
		v.fullView.remove(v.resultsView);
		var gc = require('GC');

		gc(v.resultsView);

		app.view.fullView.visible = false;
	};
	app.controller.show = function() {
		m.getJobs();
		app.view.fullView.visible = true;
	};
	app.controller.updateJob = function() {
		app.controller.hide();
		Ti.App.fireEvent('hideSearchView');

		var UpdateJob = require('UpdateJob_2');
		var openUpdate = UpdateJob(this.jobData, this.type);
	};
	return app;
})();

module.exports = SEARCH;
