function DialogBoxForInput(obj) {
	
	var _object = obj, that = this, this_dialog = {};
	var loadGlobals = require('GLOBALS');
	var GLOBALS = loadGlobals();
	this_dialog.root = Ti.UI.createView({
		layout : 'vertical'
	});
	this_dialog.textField = Titanium.UI.createTextArea({
		borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
		font : GLOBALS.largeFont,
		autocapitalization : Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
		height : (GLOBALS.fieldHeight * 2),
		hintText : 'Enter Response Here',
		width : '100%',
		//keyboardType : Titanium.UI.KEYBOARD_DEFAULT,
		returnKeyType : Titanium.UI.RETURNKEY_DEFAULT
	});

	//

	var opts = {
		cancel : 1,
		buttonNames : ['Accept', 'Cancel'],
		selectedIndex : 1,
		destructive : 0,
		zIndex : 5
	};
	this_dialog.popUp = Titanium.UI.createOptionDialog(opts);
	this_dialog.popUp.androidView = this_dialog.root;

	this.pieces = function(field) {
		var updateField = field;
		this_dialog.root.add(this_dialog.textField);
		this_dialog.textField.keyboardType = Titanium.UI.KEYBOARD_NUMBER_PAD;
		this_dialog.popUp.title = 'Confirm Piece Count for ' + _object.controlNumber;
		this_dialog.popUp.show();
		this_dialog.textField.focus();
		this_dialog.popUp.addEventListener('click', function(e) {
			Ti.API.info(e.index);

			if (e.index === 0) {
				updateField.value = this_dialog.textField.value;
				this_dialog = null;
				loadGlobals = null;
				GLOBALS = null;
			} else {
				this_dialog = null;
				loadGlobals = null;
				GLOBALS = null;
			}

		});
	};
	this.weight = function(field) {
		var updateField = field;
		this_dialog.root.add(this_dialog.textField);
		this_dialog.textField.keyboardType = Titanium.UI.KEYBOARD_NUMBER_PAD;
		this_dialog.popUp.title = 'Confirm Weight In Lbs for ' + _object.controlNumber;
		this_dialog.popUp.show();
		this_dialog.textField.focus();
		this_dialog.popUp.addEventListener('click', function(e) {
			Ti.API.info(e.index);

			if (e.index === 0) {
				updateField.value = this_dialog.textField.value;
				this_dialog = null;
				loadGlobals = null;
				GLOBALS = null;
			} else {
				this_dialog = null;
				loadGlobals = null;
				GLOBALS = null;
			}

		});
	};
	this.name = function(field) {
		var updateField = field;
		this_dialog.root.add(this_dialog.textField);
		this_dialog.textField.keyboardType = Titanium.UI.KEYBOARD_DEFAULT;
		this_dialog.popUp.title = 'Customer Full Name ';
		this_dialog.popUp.show();
		this_dialog.textField.focus();
		this_dialog.popUp.addEventListener('click', function(e) {
			Ti.API.info(e.index);

			if (e.index === 0) {
				updateField.value = this_dialog.textField.value;
				this_dialog = null;
				loadGlobals = null;
				GLOBALS = null;
			} else {
				this_dialog = null;
				loadGlobals = null;
				GLOBALS = null;
			}

		});
	};
	this.email = function(field) {
		var updateField = field;
		this_dialog.root.add(this_dialog.textField);
		this_dialog.textField.keyboardType = Titanium.UI.KEYBOARD_EMAIL;
		this_dialog.popUp.title = 'Enter Email:  ';
		this_dialog.popUp.show();
		this_dialog.textField.focus();
		this_dialog.popUp.addEventListener('click', function(e) {
			Ti.API.info(e.index);

			if (e.index === 0) {
				updateField.value = this_dialog.textField.value;
				this_dialog = null;
				loadGlobals = null;
				GLOBALS = null;

			} else {
				this_dialog = null;
				loadGlobals = null;
				GLOBALS = null;
			}

		});
	};
	this.form2Response = function(field) {
		var updateField = field;
		this_dialog.root.add(this_dialog.textField);
		this_dialog.textField.keyboardType = Titanium.UI.KEYBOARD_EMAIL;
		this_dialog.popUp.title = 'Note damage to packaging, shipment, or residence:  ';
		this_dialog.popUp.show();
		this_dialog.textField.focus();
		this_dialog.popUp.addEventListener('click', function(e) {
			Ti.API.info(e.index);

			if (e.index === 0) {
				updateField.value = this_dialog.textField.value;
				this_dialog = null;
				var picArray = [updateField.controlNumber];
				OpenCamera(picArray);
				loadGlobals = null;
				GLOBALS = null;
			} else {
				this_dialog = null;
				loadGlobals = null;
				GLOBALS = null;
			}

		});
	};
	this.quantityChange = function(item) {
		var p = 0, z = 20, pickerData = [], _item = item;
		for (p; p < z; p++) {
			pickerData[p] = Ti.UI.createPickerRow({
				title : p + ''
			});
		}
		var quantityLabel = Ti.UI.createLabel({
			text : 'Quantity Accepting: ',
			font : GLOBALS.largeFont
		});
		var picker = Titanium.UI.createPicker({
			value : item.quantity,
			type : Titanium.UI.PICKER_TYPE_PLAIN,
			pieces : item.quantity,
			//font : GLOBALS.largeFont,
			width : '100%'
		});
		picker.add(pickerData);
		var reasonWhy = Titanium.UI.createTextArea({
			borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
			font : GLOBALS.largeFont,
			autocapitalization : Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
			height : (GLOBALS.fieldHeight * 2),
			hintText : 'Why Quantity Change?',
			width : '100%',
			//keyboardType : Titanium.UI.KEYBOARD_DEFAULT,
			returnKeyType : Titanium.UI.RETURNKEY_DEFAULT
		});
		var quality = Titanium.UI.createTextArea({
			borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
			font : GLOBALS.largeFont,
			autocapitalization : Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
			height : (GLOBALS.fieldHeight * 2),
			hintText : 'Condition Of Returning Item(s)',
			width : '100%',
			//keyboardType : Titanium.UI.KEYBOARD_DEFAULT,
			returnKeyType : Titanium.UI.RETURNKEY_DEFAULT
		});
		this_dialog.root.add(quantityLabel);
		this_dialog.root.add(picker);
		this_dialog.root.add(reasonWhy);
		this_dialog.root.add(quality);

		//this_dialog.textField.keyboardType = Titanium.UI.KEYBOARD_NUMBER_PAD;
		this_dialog.popUp.title = 'Confirm Quantity Of ' + _item.itemDesc + ' Being Accepted ';
		this_dialog.popUp.buttonNames = ["Confirm"];
		this_dialog.popUp.show();
		this_dialog.popUp.addEventListener('click', function(e) {
			Ti.API.info(e.index);

			if (quality.value != "" && reasonWhy.value != "") {
				var DataBase = require('db');
				if (e.index === 0) {
					var sql = DataBase();
					var data = {
						itemId : _item.itemId,
						tagJobId : _item.tagJobId,
						repsonseToAcceptBool : true,
						details : reasonWhy.value,
						quantity : picker.value
					};
					sql.saveForm5(data);
					sql = null;
					data = null;
					this_dialog = null;
					var theJob = [_item.controlNumber];
					var camera = require('OpenCamera');
					camera(theJob);
					theJob = null;
					loadGlobals = null;
					GLOBALS = null;
					DataBase = null;
					sql = null;
				} else {
					this_dialog = null;
					loadGlobals = null;
					GLOBALS = null;
					DataBase = null;
					sql = null;
				}
			} else {
				setTimeout(function() {
					alert('Please Complete The Blank Area, and select the amount of this item the customer is accepting from the drop down.\n\nDescribe why item(s) are being refused on top portion.\n\nDescribe their condition on bottom.')
				}, 500);

				return this_dialog.popUp.show();
			}
		});

	};
	return this;

}

module.exports = DialogBoxForInput;
