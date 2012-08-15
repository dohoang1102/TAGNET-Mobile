var UPDATE = function(data, type) {
	var InitGlobals = require('SlimGlobals');
	var GLOBALS = InitGlobals();
	var jobData = data, updateType = type, _type;
	if (updateType === 0) {
		_type = "Pickup";
	} else {
		_type = "Delivery";
	}
	var _form2 = false, _form3 = false, _form4 = false, _form5 = false, _pieces = true, _weight = true, _departRequired = false;
	var trackForm5 = 0, trackCSR = 0, updatesForm5 = 0, updatesCSR = 0;
	var updateObject = {}, viewArray = [];
	var setTheForms = (function() {
		var DataBase = require('db');
		var sql = DataBase();

		var whichForms = sql.selectWhichForms(jobData);

		_form2 = whichForms.results.two;
		_form3 = whichForms.results.three;
		_form4 = whichForms.results.four;
		_form5 = whichForms.results.five;
		_departRequired = whichForms.results.depart;
		Ti.API.warn('LINE 24 : UpdateJob_2.js | variable = whichForms : ' + JSON.stringify(whichForms) + ' | Show the current requirements for the active job.');
		return;
	})();

	var BaseUi = {
		win : Ti.UI.createWindow({
			navBarHidden : true,
			modal : true,
			//backgroundColor : '#fff',
			backgroundImage : 'pod_bg.jpg',
			orientationModes : [Titanium.UI.PORTRAIT], // UI restricted to portrait mode
			fullscreen : false,
			exitOnClose : false,
			layout : 'vertical',
			height : '100%',
			visible : true
		}),
		ctrlLabel : Ti.UI.createLabel({
			right : '1%',
			bottom : '6%',
			text : 'Control Number : ' + jobData.controlNumber,
			color : '#fff',
			font : GLOBALS.smallFont,
		}),
		arrivLabel : Ti.UI.createLabel({
			right : '1%',
			top : '6%',
			//text : 'Arrive Time : ',
			color : '#fff',
			font : GLOBALS.smallFont,
		}),
		deptLabel : Ti.UI.createLabel({
			right : '1%',
			//top : '6%',
			//text : 'Depart Time : ',
			color : '#fff',
			font : GLOBALS.smallFont,
		}),
		navBar : Ti.UI.createView({
			height : '15%',
			layout : 'absolute',
			top : 0,
			backgroundColor : "#55000000"
		}),
		backButton : Ti.UI.createButton({
			left : 0,
			height : GLOBALS.medIconSize,
			width : GLOBALS.medIconSize,
			backgroundImage : GLOBALS.backIconSelected,
			backgroundSelectedImage : GLOBALS.backIcon,
			backgroundDisabledImage : GLOBALS.backIcon
		}),
		backLabel : Ti.UI.createLabel({
			left : GLOBALS.medIconSize,
			text : 'Back',
			color : '#fff',
			font : GLOBALS.font,
		}),
		activePage : 0,
		scrollView : Titanium.UI.createScrollableView({
			//views : [idpView, customerView],
			backgroundColor : '#99000000',
			showPagingControl : true,
			pagingControlHeight : 30,
			maxZoomScale : 2.0,
			currentPage : 0,
			height : '75%'
		}),
		navigationWrap : Ti.UI.createView({
			height : '10%',
			layout : 'horizontal',
			//backgroundImage : 'img/bar-2.png',
			backgroundColor : '#000'
		}),
		lastPageButton : Ti.UI.createButton({
			width : '33.3%',
			title : 'Previous Page',
			enabled : 'false',
			backgroundColor : '#55FF0000',
			borderWidth : 1,
			borderColor : '#303030',
			height : '100%',
			font : GLOBALS.smallFont,
			backgroundSelectedColor : '#303030',
			backgroundDisabledColor : '#000',
			color : '#fff',

		}),
		currentPageLabel : Ti.UI.createLabel({
			width : '33.3%',
			text : 'Page 1 of 2',
			font : GLOBALS.font,
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			color : '#fff',
		}),
		nextPageButton : Ti.UI.createButton({
			width : '33.3%',
			title : 'Next Page',
			backgroundColor : '#5500FF00',
			borderWidth : 1,
			borderColor : '#303030',
			height : '100%',
			backgroundSelectedColor : '#303030',
			backgroundDisabledColor : '#000',
			color : '#fff',
		}),
		buildBaseUi : function() {
			var that = this;
			Ti.API.info('_form2 _form3  _form4 _form5 : ' + _form2 + ', ' + _form3 + ', ' + _form4 + ', ' + _form5);
			this.navBar.add(this.backButton);
			this.navBar.add(this.backLabel);
			this.navBar.add(this.ctrlLabel);
			this.navBar.add(this.arrivLabel);
			if (_departRequired === 'true') {
				this.navBar.add(this.deptLabel);
			}
			this.win.add(this.navBar);

			this.win.add(this.scrollView);

			this.navigationWrap.add(this.lastPageButton);
			this.navigationWrap.add(this.currentPageLabel);
			this.navigationWrap.add(this.nextPageButton);
			this.win.add(this.navigationWrap);
			var addFirstPage = function() {
				var Custom = require('Custom');
				var mainView = Ti.UI.createView({
					height : '100%',
					width : '100%',
					layout : 'vertical'
				});
				var topView = Ti.UI.createView({
					width : '100%',
					height : '45%',
					layout : 'vertical'
				});

				var arrivalLabel = Ti.UI.createLabel({
					top : 0,
					text : "Enter " + _type + " Time",
					font : GLOBALS.largeFont,
					textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
					color : '#fff',
					//left : "10%"
				});
				if (_departRequired === 'true') {
					arrivalLabel.text = "Enter " + _type + " Arrival Time";
				}
				var arrivalTimePicker = Custom.UI.createPicker(GLOBALS);
				var bottomView = Ti.UI.createView({
					width : '100%',
					height : '44%',
					layout : 'vertical'
				});
				var deptTimePicker = Custom.UI.createPicker(GLOBALS);
				var deptLabel = Ti.UI.createLabel({
					top : 0,
					text : "Enter " + _type + " Depart Time",
					font : GLOBALS.largeFont,
					textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
					color : '#fff',
					//left : "10%"
				});
				var getTimes = function() {
					try {
						that.arrivLabel.text = 'Arrive Time : ' + arrivalTimePicker.timeValue;
						that.deptLabel.text = 'Depart Time : ' + deptTimePicker.timeValue;
						setTimeout(getTimes, 5000);
					} catch(err) {

					}

				}
				getTimes();
				this.getTime = function() {
					return {
						deptTime : deptTimePicker.timeValue,
						arrivTime : arrivalTimePicker.timeValue
					};
				}
				topView.add(arrivalLabel);
				topView.add(arrivalTimePicker);
				mainView.add(topView);
				if (_departRequired === 'true') {

					bottomView.add(deptLabel);
					bottomView.add(deptTimePicker);
				}
				mainView.add(bottomView);
				viewArray.push(mainView);
				this.gcLocal = function() {
					topView.remove(arrivalLabel);
					topView.remove(arrivalTimePicker);
					mainView.remove(topView);
					if (_departRequired === 'true') {
						bottomView.remove(deptLabel);
						bottomView.remove(deptTimePicker)
					}
					mainView.remove(bottomView);
					viewArray.remove(mainView);
					Custom = null;
					mainView = null;
					topView = null;

					arrivalLabel = null;
					arrivalTimePicker = null;
					bottomView = null;
					deptTimePicker = null;
					deptLabel = null;
					getTimes = null;
					//getTimes();

				}
				return this;
			}
			var win1 = addFirstPage();
			/*
			 *
			 * Pieces Weight
			 * Name Email
			 *
			 */
			var addSecondPage = function() {
				//var Custom = require('Custom');
				var mainView = Ti.UI.createView({
					height : '100%',
					width : '100%',
					layout : 'vertical',
					backgroundColor : '#99000000',
				});
				var topView = Ti.UI.createView({
					width : '100%',
					height : '50%',
					layout : 'vertical'
				});

				var titleLabel = Ti.UI.createLabel({
					font : GLOBALS.font,
					text : 'Additional Details',
					color : 'red',
					textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
					top : 0
				});
				topView.add(titleLabel);
				var weightField = Titanium.UI.createTextField({
					borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
					font : GLOBALS.smallFont,
					//focusable : true,
					enabled : false,
					autocapitalization : Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
					height : GLOBALS.fieldHeight,
					hintText : 'Enter Weight',
					width : '40%',

					right : GLOBALS.xSmallIconSize,
					value : jobData.weight,
					keyboardType : Titanium.UI.KEYBOARD_DEFAULT,
					returnKeyType : Titanium.UI.RETURNKEY_DEFAULT,
					softKeyboardOnFocus : Titanium.UI.Android.SOFT_KEYBOARD_HIDE_ON_FOCUS
				});
				var pieceField = Titanium.UI.createTextField({
					borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
					font : GLOBALS.smallFont,
					//focusable : false,
					enabled : false,
					autocapitalization : Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
					height : GLOBALS.fieldHeight,
					hintText : 'Piece Count',
					width : '40%',

					right : GLOBALS.xSmallIconSize,
					value : jobData.pieces,
					keyboardType : Titanium.UI.KEYBOARD_DEFAULT,
					returnKeyType : Titanium.UI.RETURNKEY_DEFAULT
				});
				var weightView = Ti.UI.createView({
					top : 0,
					width : '100%',
					height : '50%',
					layout : 'absolute'
				});
				var pieceView = Ti.UI.createView({
					height : '49%',
					width : '100%',
					layout : 'absolute'
				});
				var weightLabel = Ti.UI.createLabel({
					right : '50%',
					text : "Weight : \n(lbs)",
					color : '#fff',
					font : GLOBALS.font,
					textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
					//left : "10%"
				});
				var pieceLabel = Ti.UI.createLabel({
					right : '50%',
					text : "Pieces : ",
					color : '#fff',
					font : GLOBALS.font,
					textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
					//left : "10%"
				});

				var bottomView = Ti.UI.createView({
					width : '100%',
					height : '49%',
					layout : 'vertical'
				});
				weightView.add(weightLabel);
				weightView.add(weightField);
				pieceView.add(pieceLabel);
				pieceView.add(pieceField);
				topView.add(weightView);
				topView.add(pieceView);
				//topView.add(arrivalLabel);
				//topView.add(arrivalTimePicker);
				mainView.add(topView);
				var nameField = Titanium.UI.createTextField({
					borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
					font : GLOBALS.smallFont,
					//focusable : false,
					autocapitalization : Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
					height : GLOBALS.fieldHeight,
					hintText : 'Enter Name',
					width : '40%',

					right : GLOBALS.xSmallIconSize,
					//value : d.weight,
					keyboardType : Titanium.UI.KEYBOARD_DEFAULT,
					returnKeyType : Titanium.UI.RETURNKEY_DEFAULT
				}), emailField = Titanium.UI.createTextField({
					borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
					font : GLOBALS.smallFont,
					//focusable : false,
					autocapitalization : Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
					height : GLOBALS.fieldHeight,
					hintText : 'Enter Email',
					width : '40%',

					right : GLOBALS.xSmallIconSize,
					//value : d.weight,
					keyboardType : Titanium.UI.KEYBOARD_EMAIL,
					returnKeyType : Titanium.UI.RETURNKEY_DEFAULT
				}), nameView = Ti.UI.createView({
					top : 0,
					height : '50%',
					layout : 'absolute'
				}), emailView = Ti.UI.createView({
					height : '49%',
					layout : 'absolute'
				}), nameLabel = Ti.UI.createLabel({
					right : '50%',
					text : "*Full Name : ",
					font : GLOBALS.font,
					textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
					color : 'red',
					//left : "10%"
				}), emailLabel = Ti.UI.createLabel({
					right : '50%',
					text : "Email :\n(optional for receipt)",
					font : GLOBALS.font,
					textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
					color : '#fff',
					//left : "10%"
				});
				this.getData = function() {
					return {
						email : emailField.value,
						weight : weightField.value,
						pieces : pieceField.value,
						name : nameField.value
					};
				}
				nameView.add(nameLabel);
				nameView.add(nameField);
				emailView.add(emailLabel);
				emailView.add(emailField);
				bottomView.add(nameView);
				bottomView.add(emailView);
				mainView.add(bottomView);
				viewArray.push(mainView);
				this.gcLocal = function() {
					nameView.remove(nameLabel);
					nameView.remove(nameField);
					emailView.remove(emailLabel);
					emailView.remove(emailField);
					bottomView.remove(nameView);
					bottomView.remove(emailView);
					mainView.remove(bottomView);
					weightView.remove(weightLabel);
					weightView.remove(weightField);
					pieceView.remove(pieceLabel);
					pieceView.remove(pieceField);
					topView.remove(weightView);
					topView.remove(pieceView);
					mainView.remove(topView);
					topView.remove(titleLabel);
					mainView = null;
					topView = null;

					titleLabel = null;

					weightField = null;
					pieceField = null;
					weightView = null;
					pieceView = null;
					weightLabel = null;
					pieceLabel = null;

					bottomView = null;

					//topView.add(arrivalLabel);
					//topView.add(arrivalTimePicker);

					nameField = null;
					emailField = null;
					nameView = null;
					emailView = null;
					nameLabel = null;
					emailLabel = null;

					//	viewArray.push(mainView);
				}
				return this;
			}
			var win2 = addSecondPage();
			var addForm5 = function() {
				Ti.API.warn('Form 5 fired');
				var _viewArray = [], labelArray = [], buttonWrap = [], AcceptAllButton = [], changeQuantityButton = [];
				var formView = Ti.UI.createView({
					height : '100%',
					backgroundColor : '#99000000',
					width : '100%',
					layout : 'vertical'
				});
				var scroll = Ti.UI.createScrollView({
					width : '100%',
					height : '100%',
					contentWidth : 'auto',
					contentHeight : 'auto',
					showVerticalScrollIndicator : true,
					//showHorizontalScrollIndicator : true,
					//backgroundColor:'red'
					layout : 'vertical'
				});
				var titleLabel = Ti.UI.createLabel({
					font : GLOBALS.font,
					text : 'Item(s) Confirmation (required)',
					color : 'red',
					textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
					top : 0
				});
				formView.add(scroll);
				scroll.add(titleLabel);
				var db = require('db');
				var sql = db();
				_itemData = sql.selectItems(jobData.id);
				Ti.API.warn('_itemData.results.length : jobData.id ' + _itemData.results.length);
				//var percent = 100 / (_itemData.results.length + .3);
				var percent = 10;
				var i = 0;
				var _font;
				if ((_itemData.results.length + 1) > 4) {
					_font = GLOBALS.smallFont;
				} else {
					_font = GLOBALS.xSmallFont;
				}
				for (i; i < _itemData.results.length; i++) {
					//_itemData[i]
					//elmArray[i] = {};
					_viewArray[i] = Ti.UI.createView({
						//top : 0,
						height : 200,
						layout : 'vertical'
					});
					labelArray[i] = Ti.UI.createLabel({
						text : _itemData.results[i].description + '\nQuantity: ' + _itemData.results[i].quantity,
						font : _font,
						textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
						color : '#fff',
					});

					buttonWrap[i] = Ti.UI.createView({
						height : '100%',
						width : '100%',
						layout : 'horizontal'
					});
					AcceptAllButton[i] = Ti.UI.createButton({
						width : '50%',
						title : 'All Instances Of This Item(s) Accepted',
						height : '100%',
						itemId : _itemData.results[i].itemId,
						tagJobId : _itemData.results[i].tagJobId,
						quantity : _itemData.results[i].quantity,
						font : _font,
						color : '#fff',
						backgroundColor : '#5500FF00',
						borderWidth : 1,
						borderColor : '#303030',
						height : '100%',
						backgroundSelectedColor : '#303030',
						backgroundDisabledColor : '#00FF00',
						visible : true,
						inc : i
					});
					AcceptAllButton[i].addEventListener('click', function() {
						var id = this.itemId, response = false, tagJobId = jobData.id, _data;
						this.enabled = false;
						changeQuantityButton[this.inc].enabled = true;
						changeQuantityButton[this.inc].backgroundColor = '#ccc';
						updatesForm5 = updatesForm5 + 1;
						_data = {
							itemId : id,
							tagJobId : tagJobId,
							repsonseToAcceptBool : response,
							details : null,
							quantity : null
						};
						sql.saveForm5(_data);
						_data = null;
					})
					changeQuantityButton[i] = Ti.UI.createButton({
						width : '49%',
						height : '100%',
						title : 'Partial or No Instances Of This Item(s) Accepted',
						itemId : _itemData.results[i].itemId,
						tagJobId : _itemData.results[i].tagJobId,
						quantity : _itemData.results[i].quantity,
						font : _font,
						color : '#fff',
						backgroundColor : '#55FF0000',
						borderWidth : 1,
						borderColor : '#303030',
						height : '100%',
						backgroundSelectedColor : '#303030',
						backgroundDisabledColor : '#FF0000',
						visible : true,
						inc : i
					});
					changeQuantityButton[i].addEventListener('click', function() {
						var id = this.itemId, response = false, quan = this.quantity;
						this.enabled = false;
						AcceptAllButton[this.inc].enabled = true;
						AcceptAllButton[this.inc].backgroundColor = '#ccc';

						var item = {
							itemDesc : _itemData.description,
							itemId : id,
							quantity : quan,
							tagJobId : jobData.id,
							controlNumber : jobData.controlNumber
						};
						var DialogBoxForInput = require('Dialog');
						var myDialog = DialogBoxForInput(jobData);
						myDialog.quantityChange(item);
						updatesForm5 = updatesForm5 + 1;
					});
					buttonWrap[i].add(AcceptAllButton[i]);
					buttonWrap[i].add(changeQuantityButton[i]);
					_viewArray[i].add(labelArray[i]);
					_viewArray[i].add(buttonWrap[i]);
					scroll.add(_viewArray[i]);
					trackForm5 = trackForm5 + 1;
				}
				if (_itemData.results.length > 0) {

					viewArray.push(formView);
				}
				Ti.API.warn('viewArray inform5 : ' + viewArray.toString());
				this.gcLocal = function() {
					formView.remove(titleLabel);
					_viewArray = null;
					labelArray = null;
					buttonWrap = null;
					AcceptAllButton = null;
					changeQuantityButton = null;
					formView = null;
					titleLabel = null;

					db = null;
					sql = null;
					_itemData = null;
					//	Ti.API.warn('_itemData.results.length : ' + _itemData.results.length);
					percent = null;
					i = null;
					_font = null;

				}
				return this;
			};
			if (_form5 === true) {
				var form5 = addForm5();
			};

			var addCSR = function(type) {
				var _type = type;
				var db = require('db');
				var sql = db();
				var questionType = sql.selectFormType2();
				var questionViewArray = [];
				var questionArray = [];
				var firstView = Ti.UI.createView({
					height : '100%',
					width : '100%',
					layout : 'vertical',
					backgroundColor : '#99000000'
				});
				var titleLabel1 = Ti.UI.createLabel({
					font : GLOBALS.font,
					text : 'CSR Form (required) 2/2',
					color : 'red',
					textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
					top : 0
				});
				firstView.add(titleLabel1);
				var titleLabel2 = Ti.UI.createLabel({
					font : GLOBALS.font,
					text : 'CSR Form (required) 1/2',
					color : 'red',
					textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
					top : 0
				});
				//mainView.add(titleLabel);
				var secondView = Ti.UI.createView({
					height : '100%',
					width : '100%',
					layout : 'vertical',
					backgroundColor : '#99000000'
				});
				secondView.add(titleLabel2);
				var i = 0;
				for (i; i < questionType.results.length; i++) {
					questionArray[i] = {};
					questionViewArray[i] = Ti.UI.createView({
						top : 0,
						height : '18.5%',
						layout : 'vertical'
					});
					questionArray[i].label = Ti.UI.createLabel({
						text : questionType.results[i].fieldDescription,
						font : GLOBALS.smallFont,
						textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
						color : '#fff',
						height : '60%'
					});
					questionViewArray[i].add(questionArray[i].label)
					if (questionType.results[i].fieldType !== 'textfield') {

						questionArray[i].buttonWrap = Ti.UI.createView({
							height : GLOBALS.fieldHeight,
							width : '100%',
							layout : 'horizontal'
						});
						questionArray[i].yesButton = Ti.UI.createButton({
							width : '33.3%',
							height : '100%',
							title : 'Yes',
							font : GLOBALS.xSmallFont,
							color : '#fff',
							backgroundColor : '#808080',
							borderWidth : 1,
							borderColor : '#303030',
							height : '100%',
							backgroundSelectedColor : '#303030',
							backgroundDisabledColor : '#00FF00',
							visible : true,
							id : questionType.results[i].fieldId,
							inc : i
						});
						questionArray[i].noButton = Ti.UI.createButton({
							width : '33.3%',
							height : '100%',
							title : 'No',
							font : GLOBALS.xSmallFont,
							color : '#fff',
							backgroundColor : '#808080',
							borderWidth : 1,
							borderColor : '#303030',
							height : '100%',
							backgroundSelectedColor : '#303030',
							backgroundDisabledColor : '#FF0000',
							visible : true,
							id : questionType.results[i].fieldId,
							inc : i
						});
						questionArray[i].naButton = Ti.UI.createButton({
							width : '33.3%',
							height : '100%',
							title : 'N/A',
							font : GLOBALS.xSmallFont,
							color : '#fff',
							backgroundColor : '#808080',
							borderWidth : 1,
							borderColor : '#303030',
							height : '100%',
							backgroundSelectedColor : '#303030',
							backgroundDisabledColor : '#0000FF',
							visible : true,
							id : questionType.results[i].fieldId,
							inc : i
						});
						questionArray[i].yesButton.addEventListener('click', function() {
							var id = this.id, response = true, _data;
							this.enabled = false;
							questionArray[this.inc].noButton.enabled = true;
							questionArray[this.inc].naButton.enabled = true;
							questionArray[this.inc].noButton.backgroundColor = '#ccc';
							questionArray[this.inc].naButton.backgroundColor = '#ccc';
							updatesCSR = updatesCSR + 1;
							_data = {
								tagJobId : jobData.id,
								fieldId : id,
								response : response
							}
							var DataBase = require('db');
							var sql = DataBase();

							if (_type === 4) {
								sql.saveForm4(_data);
							} else {
								sql.saveForm2(_data);
							}
							sql = null;
							_data = null;
						});
						questionArray[i].noButton.addEventListener('click', function() {
							var id = this.id, response = false, _data;
							this.enabled = false;
							questionArray[this.inc].yesButton.enabled = true;
							questionArray[this.inc].naButton.enabled = true;
							questionArray[this.inc].yesButton.backgroundColor = '#ccc';
							questionArray[this.inc].naButton.backgroundColor = '#ccc';
							updatesCSR = updatesCSR + 1;
							_data = {
								tagJobId : jobData.id,
								fieldId : id,
								response : response
							}
							var DataBase = require('db');
							var sql = DataBase();

							if (_type === 4) {
								sql.saveForm4(_data);
							} else {
								sql.saveForm2(_data);
							}
							sql = null;
							_data = null;
						});
						questionArray[i].naButton.addEventListener('click', function() {
							var id = this.id, response = null, _data;
							this.enabled = false;
							questionArray[this.inc].yesButton.enabled = true;
							questionArray[this.inc].noButton.enabled = true;
							questionArray[this.inc].yesButton.backgroundColor = '#ccc';
							questionArray[this.inc].noButton.backgroundColor = '#ccc';
							updatesCSR = updatesCSR + 1;
							_data = {
								tagJobId : jobData.id,
								fieldId : id,
								response : response
							}
							var DataBase = require('db');
							var sql = DataBase();

							if (_type === 4) {
								sql.saveForm4(_data);
							} else {
								sql.saveForm2(_data);
							}
							sql = null;
							_data = null;
						})
						questionArray[i].buttonWrap.add(questionArray[i].yesButton);
						questionArray[i].buttonWrap.add(questionArray[i].noButton);
						questionArray[i].buttonWrap.add(questionArray[i].naButton);
						questionViewArray[i].add(questionArray[i].buttonWrap);
					} else {
						questionArray[i].textField = Titanium.UI.createTextField({
							borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
							font : GLOBALS.xSmallFont,
							//focusable : false,
							autocapitalization : Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
							value : 'NONE',

							hintText : 'Respond here',
							width : '80%',
							height : '100%',
							//right : GLOBALS.xSmallIconSize,
							//value : d.weight,
							keyboardType : Titanium.UI.KEYBOARD_DEFAULT,
							returnKeyType : Titanium.UI.RETURNKEY_DEFAULT,
							id : questionType.results[i].fieldId,
							controlNumber : jobData.controlNumber

						});
						questionArray[i].textField.addEventListener('change', function() {
							var id = this.id, response = this.value, _data;
							//this.enabled = false;
							if (this.value != "") {

								updatesCSR = updatesCSR + 1;
								var DataBase = require('db');
								var sql = DataBase();
								_data = {
									tagJobId : jobData.id,
									fieldId : id,
									response : response
								}
								if (_type === 4) {
									sql.saveForm4(_data);
								} else {
									sql.saveForm2(_data);
								}
								sql = null;
								_data = null;
							}
						})
						questionViewArray[i].add(questionArray[i].textField);
					}
					if (i > 4) {
						questionViewArray[i].height = '23.5%';
						firstView.add(questionViewArray[i]);
					} else {

						secondView.add(questionViewArray[i]);
					}
					trackCSR = trackCSR + 1;
				}

				viewArray.push(secondView);
				viewArray.push(firstView);
				this.gcLocal = function() {
					firstView.remove(titleLabel1);
					secondView.remove(titleLabel2);
					_type = null;
					db = null;
					sql = null;
					questionType = null;
					questionViewArray = null;
					questionArray = null;
					firstView = null;
					titleLabel1 = null;

					titleLabel2 = null;
					//mainView.add(titleLabel);
					secondView = null;

					i = null;
				}
				return this;
			};
			if (_form4 === true && updateType === 1) {
				var csr = addCSR(4);
			}
			if (_form2 === true && updateType === 1) {
				var csr = addCSR(2);
			}

			var addLastPage = function() {
				//var Custom = require('Custom');
				var SignatureCapture = require('SignatureCapture_2');
				var mainView = Ti.UI.createView({
					height : '100%',
					width : '100%',
					layout : 'vertical'
				});

				var titleLabel = Ti.UI.createLabel({
					font : GLOBALS.font,
					text : 'Last Page',
					color : 'red',
					textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
					top : 0
				});
				mainView.add(titleLabel);
				var topView = Ti.UI.createView({
					width : '100%',
					height : '50%',
					//layout : 'vertical'
				});

				var signButton = Ti.UI.createButton({
					title : "Sign For " + _type,
					width : '90%',
					font : GLOBALS.largeFont,
					height : '90%'

				});
				topView.add(signButton);
				mainView.add(topView);
				signButton.addEventListener('click', function() {
					var theData = {};
					if ((_form2 === true || _form4 === true || _form5 === true) && updateType === 1) {
						theData.initials = true;
					} else {
						theData.initials = false;
					}

					var mySig = SignatureCapture(theData);
					var _view = mySig.getView();
					try {
						that.win.add(_view);
					} catch(err) {
						Ti.API.error(err);
					}

				})
				var bottomView = Ti.UI.createView({
					width : '100%',
					height : '49%',
					//layout : 'vertical'
				});
				var saveButton = Ti.UI.createButton({
					title : "Save and Enter " + (_type === 'Pickup' ? 'POP' : 'POD' ),
					width : '90%',
					font : GLOBALS.largeFont,
					height : '90%'

				});
				saveButton.addEventListener('click', function() {
					var SignatureCapture = require('SignatureCapture_2');
					var mySig = SignatureCapture();
					var updateObject = {};
					//Ti.App.addEventListener('captureTheSignature', function(e) {
					//updateObject
					var sigs = mySig.getSignatures();
					try {

						updateObject.signature = sigs.customerSign;
						Ti.API.warn('updateObject.signature.length: ' + updateObject.signature.length);
						if (sigs.customerInit) {
							updateObject.init = sigs.customerInit;
							Ti.API.warn('updateObject.init.length: ' + updateObject.init.length);
						}

						//Ti.API.warn('updateObject: ' + JSON.stringify(updateObject))
					} catch(err) {
						Ti.API.error('err ' + err);
						return alert('Missing Signature. \n\nThis s a requirement to enter POD.');
					}
					var now = new Date();
					if (trackForm5 > 0 && trackForm5 > updatesForm5) {
						//idpTable.scrollToIndex(3);
						that.scrollView.currentPage = 2;
						return alert('Please complete "Item(s) Confirmation" on page 3. \n\nThis is a requirement to enter POD.');
					}
					if (trackCSR > 0 && trackCSR > updatesCSR) {
						//customerTable.scrollToIndex(0);
						if (trackForm5 > 0) {

							that.scrollView.currentPage = 3;
							return alert('Please complete "Customer Service Form" on page 4 and 5. \n\nThis is a requirement to enter POD.');
						} else {
							that.scrollView.currentPage = 2;
							return alert('Please complete "Customer Service Form" on page 3 and 4. \n\nThis is a requirement to enter POD.');
						}
					}
					var _fieldData = win2.getData();
					if (_fieldData.name == "" || _fieldData.name === null) {
						that.scrollView.currentPage = 1;
						return alert('Please enter customer full name.\n\nThis is a requirement to enter POD.')
					}
					if (updateObject.signature == null || updateObject.signature == undefined) {
						return alert('Please have the customer sign, using finger or stylus.\n\nThis is a requirement to enter POD.')
					}
					var FixJSTimestamp = require('FixJSTimestamp');
					var times = win1.getTime();
					var db = require('db');
					var sql = db();
					if (updateType === 0) {
						//titleLabel.text = 'Submit Pickup';
						//_type = "Pickup";

						updateObject.tagJobId = jobData.id;
						updateObject.companyNumber = jobData.companyNumber;
						updateObject.controlNumber = jobData.controlNumber;
						updateObject.puComplete = true;
						updateObject.dlComplete = false;
						updateObject.dlRefuse = false;
						updateObject.puRefuse = false;
						updateObject.puActualArriveDateTime = FixJSTimestamp(now).date + " " + times.arrivTime + ":00";
						if (_departRequired === 'true') {
							updateObject.puActualDepartDateTime = FixJSTimestamp(now).date + " " + times.deptTime + ":00";
						} else {
							updateObject.puActualDepartDateTime = FixJSTimestamp(now).date + " " + times.arrivTime + ":00";
						}
						updateObject.puPODFullName = _fieldData.name;
						updateObject.weight = _fieldData.weight;
						updateObject.pieces = _fieldData.pieces;

						updateObject.formsComplete = false;

						sql.updateJobStatus(updateObject.tagJobId, 0);
						updateObject.puEmail = _fieldData.email;
						updateObject.puEntered = FixJSTimestamp(now).timestamp;
					} else {
						//titleLabel.text = 'Submit Delivery';
						//_type = "Delivery";

						updateObject.tagJobId = jobData.id;
						updateObject.companyNumber = jobData.companyNumber;
						updateObject.controlNumber = jobData.controlNumber;
						updateObject.puComplete = false;
						updateObject.dlComplete = true;
						updateObject.dlRefuse = false;
						updateObject.puRefuse = false;
						updateObject.dlActualArriveDateTime = FixJSTimestamp(now).date + " " + times.arrivTime + ":00";
						if (_departRequired === 'true') {
							updateObject.dlActualDepartDateTime = FixJSTimestamp(now).date + " " + times.deptTime + ":00";
						} else {
							updateObject.dlActualDepartDateTime = FixJSTimestamp(now).date + " " + times.arrivTime + ":00";
						}
						updateObject.dlPODFullName = _fieldData.name;
						updateObject.weight = _fieldData.weight;
						updateObject.pieces = _fieldData.pieces;
						sql.updateJobStatus(updateObject.tagJobId, 1);
						if (_form2 == true || _form3 == true || _form4 == true || _form5 == true) {
							updateObject.formsComplete = true;
							sql.updateJobStatus(updateObject.tagJobId, 2);
						} else {
							updateObject.formsComplete = false;
						}

						updateObject.dlEmail = _fieldData.email;
						updateObject.dlEntered = FixJSTimestamp(now).timestamp;
					}

					sql.insertPopOrPod(updateObject, updateType);
					sql.addUpdateToQueue(updateObject.tagJobId, 'updatePODArray');
					//Ti.API.info('@@@ UPDATE DEBUG @@@ updateObject : ' + JSON.stringify(updateObject));
					sql = null;
					db = null;
					updateObject = null;
					//openWindow.gcWindow();
					times = null;
					_fieldData = null;
					SignatureCapture = null;
					mySig = null
					//Ti.App.addEventListener('captureTheSignature', function(e) {
					//updateObject
					sigs = null
					gcThisClass();
					return;
				})
				bottomView.add(saveButton);
				mainView.add(bottomView);
				viewArray.push(mainView);
				this.gcLocal = function() {
					//bottomView.remove(saveButton);
					//mainView.remove(bottomView);
					//mainView.remove(titleLabel);
					//topView.remove(signButton);
					//mainView.remove(topView);

					SignatureCapture = null;
					mainView = null;
					titleLabel = null;

					topView = null;

					signButton = null;
					saveButton = null;
					bottomView = null;

				}
				return this;
			}
			var last = addLastPage();
			this.scrollView.views = viewArray;
			//this.win.open();
			this.gcObject = function() {
				this.scrollView.views = [];
				win1.gcLocal();
				win2.gcLocal();
				if (_form5 === true) {

					form5.gcLocal();
				}
				if ((_form2 === true && updateType === 1) || (_form4 === true && updateType === 1)) {
					csr.gcLocal();
				}
				last.gcLocal();
				var gc = require('GC');

				gc(that.navBar);
				gc(that.scrollView);
				gc(that.navigationWrap);
				for (var i = 0; i < viewArray.length; i++) {
					gc(viewArray[i]);
				}

				that.navigationWrap = null;

				that.lastPageButton = null;
				that.currentPageLabel = null;
				that.nextPageButton = null;
				//that.navigationWrap= null;
				that.win.close();
				that.navBar = null;
				this.backButton = null;
				this.backLabel = null;

				this.ctrlLabel = null;
				this.arrivLabel = null;
				this.deptLabel = null;
				this.navBar = null;
				viewArray.length = 0;
				delete viewArray;
				viewArray = null;
				this.scrollView = null;
				that.win = null;
			}
			this.backButton.addEventListener('click', gcThisClass);
			return this;
		}
	}
	var system = Object.create(BaseUi);
	var activePage = 0;
	system.buildBaseUi();
	system.currentPageLabel.text = 'Page 1 of ' + viewArray.length;
	system.scrollView.addEventListener('scroll', function() {
		Ti.API.info('@@@@@ DEBUG @@@@@ this.currentPage : ' + this.currentPage);

		activePage = this.currentPage;
		system.currentPageLabel.text = 'Page ' + (this.currentPage + 1) + ' of ' + viewArray.length;

		if (activePage === (viewArray.length - 1)) {

			system.lastPageButton.enabled = true;
			system.nextPageButton.enabled = false;
		} else if (activePage === 0) {

			system.lastPageButton.enabled = false;
			system.nextPageButton.enabled = true;
		} else {
			system.lastPageButton.enabled = true;
			system.nextPageButton.enabled = true;
		}

		//titleLabel.text = "Customer\nFill Out This Page.";

	});
	system.nextPageButton.addEventListener('click', function() {
		system.scrollView.currentPage = (activePage + 1);
	});
	system.lastPageButton.addEventListener('click', function() {
		system.scrollView.currentPage = (activePage - 1);
	});
	system.win.open();
	Ti.API.warn('viewArray : ' + viewArray.toString());
	function gcThisClass() {
		try {

			system.win.close();
		} catch(err) {

		}
		var toast = Ti.UI.createNotification({
			message : "Syncing With TAGNET: Do not lock until \"Upload Complete\"",
			duration : Ti.UI.NOTIFICATION_DURATION_SHORT
		});
		toast.show();
		Ti.API.warn('app.sync run()');
		var startSync = require('Sync');
		var run = startSync();
		system.gcObject();
	}

	//system.scrollView.views = viewArray;
	//system.scrollView.views = viewArray;
}

module.exports = UPDATE;
