var CUSTOMPICKER = function(GLOBALS, hr, min) {
	
	//var InitGlobals = require('SlimGlobals');
	//var GLOBALS = InitGlobals();
	function fixTime(d) {
		if (d < 10) {
			d = "0" + d;
		}
		return d;
	}

	var wrapper, hourView, hourField, hourButtonIncrease, hourButtonDecrease, hourButtonWrapper, minuteView, minuteField, minuteButtonIncrease, minuteButtonDecrease, minuteButtonWrapper, hourLabel, minuteLabel;
	wrapper = Ti.UI.createView({
		width : '100%',
		height : '100%',
		layout : 'horizontal',
		timeValue : fixTime(new Date().getHours()) + ':' + fixTime(new Date().getMinutes()),
		//departValue : fixTime(new Date().getHours()) + ':' + fixTime(new Date().getMinutes())
	});
	hourView = Ti.UI.createView({
		width : '50%',
		height : '100%',
		left : 0,
		layout : 'vertical'
	});
	hourLabel = Ti.UI.createLabel({
		text : '24 hr format',
		color : '#fff',
		font : GLOBALS.xSmallFont
	});
	hourField = Ti.UI.createTextField({
		height : '50%',
		width : '100%',
		value : fixTime(hr != null ? hr : new Date().getHours()),
		hrVal : fixTime(hr != null ? hr : new Date().getHours()),
		textAlign : Titanium.UI.TEXT_ALIGNMENT_CENTER,
		keyboardType : Titanium.UI.KEYBOARD_NUMBER_PAD,
		font : GLOBALS.largeFont
	});

	hourButtonWrapper = Ti.UI.createView({
		width : '100%',
		height : '49%',
		left : 0,
		layout : 'horizontal'
	});

	hourButtonIncrease = Ti.UI.createButton({
		width : '50%',
		height : '100%',
		title : '+',
		font : GLOBALS.largeFont
	});

	hourButtonDecrease = Ti.UI.createButton({
		width : '49%',
		height : '100%',
		title : '-',
		font : GLOBALS.largeFont
	});
	minuteView = Ti.UI.createView({
		width : '49%',
		height : '100%',
		layout : 'vertical'
	});
	minuteLabel = Ti.UI.createLabel({
		text : 'Minute',
		color : '#fff',
		font : GLOBALS.xSmallFont
	});
	minuteField = Ti.UI.createTextField({
		height : '50%',
		width : '100%',
		value : fixTime(min != null ? min : new Date().getMinutes()),
		minVal : fixTime(min != null ? min : new Date().getMinutes()),
		textAlign : Titanium.UI.TEXT_ALIGNMENT_CENTER,
		keyboardType : Titanium.UI.KEYBOARD_NUMBER_PAD,
		font : GLOBALS.largeFont
	});
	if(GLOBALS.tablet === true){
		hourField.focusable = false;
		minuteField.focusable = false;
	}

	minuteButtonWrapper = Ti.UI.createView({
		width : '100%',
		height : '49%',
		left : 0,
		layout : 'horizontal'
	});

	minuteButtonIncrease = Ti.UI.createButton({
		width : '50%',
		height : '100%',
		title : '+',
		font : GLOBALS.largeFont
	});
	minuteButtonDecrease = Ti.UI.createButton({
		width : '49%',
		height : '100%',
		title : '-',
		font : GLOBALS.largeFont
	});
	hourButtonIncrease.addEventListener('click', function() {
		if (parseInt(hourField.value, 10) < 23) {
			var newVal = fixTime(parseInt(hourField.value, 10) + 1);
			hourField.value = newVal.toString();
		} else {
			hourField.value = '00';
		}

	});
	hourButtonDecrease.addEventListener('click', function() {
		if (parseInt(hourField.value, 10) > 0) {
			var newVal = fixTime(parseInt(hourField.value, 10) - 1);
			hourField.value = newVal.toString();
		} else {
			hourField.value = '23';
		}
	});
	minuteButtonIncrease.addEventListener('click', function() {
		if (parseInt(minuteField.value, 10) < 59) {
			var newVal = fixTime(parseInt(minuteField.value, 10) + 1);
			minuteField.value = newVal.toString();
		} else {
			minuteField.value = '00';
		}

	});
	minuteButtonDecrease.addEventListener('click', function() {
		if (parseInt(minuteField.value, 10) > 0) {
			var newVal = fixTime(parseInt(minuteField.value, 10) - 1);
			minuteField.value = newVal.toString();
		} else {
			minuteField.value = '59';
		}
	});

	function filterMins(e) {
		if (parseInt(e.value, 10) < 0 || parseInt(e.value, 10) > 59) {
			this.value = '00';
		}
		minuteField.minValue = this.value;
		wrapper.timeValue = fixTime(parseInt(hourField.hrValue, 10)) + ":" + fixTime(parseInt(this.value, 10));
		Ti.API.warn('wrapper.timeValue : ' + wrapper.timeValue);
	}

	function filterHrs(e) {
		if (parseInt(e.value, 10) < 0 || parseInt(e.value, 10) > 23) {
			this.value = '00';
		}
		hourField.hrValue = this.value;
		wrapper.timeValue = fixTime(parseInt(this.value, 10)) + ":" + fixTime(parseInt(minuteField.minValue, 10));
		Ti.API.warn('wrapper.timeValue : ' + wrapper.timeValue);
	}


	minuteField.addEventListener('change', filterMins);
	hourField.addEventListener('change', filterHrs);
	hourView.add(hourLabel);
	hourView.add(hourField);
	hourView.add(hourButtonWrapper);
	hourButtonWrapper.add(hourButtonIncrease);
	hourButtonWrapper.add(hourButtonDecrease);

	minuteView.add(minuteLabel);
	minuteView.add(minuteField);
	minuteView.add(minuteButtonWrapper);
	minuteButtonWrapper.add(minuteButtonIncrease);
	minuteButtonWrapper.add(minuteButtonDecrease);

	wrapper.add(hourView);
	wrapper.add(minuteView);
	hourField.blur();
	return wrapper;
};
var Custom = {
	UI : {
		createPicker : function(GLOBALS, setHour, setMin) {
			return new CUSTOMPICKER(GLOBALS, setHour, setMin);
		}
	}
};
module.exports = Custom;
