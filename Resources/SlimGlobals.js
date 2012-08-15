function GLOBALS() {
	var _obj = {};
	_obj.screenHeight = Titanium.Platform.displayCaps.platformHeight;
	if (_obj.screenHeight >= 300 && _obj.screenHeight <= 480) {
		_obj.sigPad = 'sig_Phone.html';
		_obj.backIcon = 'img/Back-64.png';
		_obj.backIconSelected = 'img/Back-64Selected.png';
		_obj.tablet = false;
		_obj.iconSize = 96;
		_obj.medIconSize = 48;
		_obj.smallIconSize = 32;
		_obj.xSmallIconSize = 24;
		_obj.rowHeight = 300;
		_obj.fieldHeight = 40;
		
		_obj.largeFont = {
			fontSize : 18,
			fontWeight : 'bold'
		};
		_obj.font = {
			fontSize : 14,
			fontWeight : 'bold'
		};
		_obj.smallFont = {
			fontSize : 12,
			fontWeight : 'bold'
		};
		_obj.xSmallFont = {
			fontSize : 10,
			fontWeight : 'bold'
		};
	} else if (_obj.screenHeight >= 481 && _obj.screenHeight <= 799) {
		_obj.sigPad = 'sig_Phone.html';
		_obj.backIcon = 'img/Back-64.png';
		_obj.backIconSelected = 'img/Back-64Selected.png';
		_obj.tablet = false;
		_obj.iconSize = 128;
		_obj.medIconSize = 64;
		_obj.smallIconSize = 48;
		_obj.xSmallIconSize = 32;
		_obj.rowHeight = 300;
		_obj.fieldHeight = 50;
		
		_obj.largeFont = {
			fontSize : 36,
			fontWeight : 'bold'
		};
		_obj.font = {
			fontSize : 24,
			fontWeight : 'bold'
		};
		_obj.smallFont = {
			fontSize : 14,
			fontWeight : 'bold'
		};
		_obj.xSmallFont = {
			fontSize : 12,
			fontWeight : 'bold'
		};
	} else if (_obj.screenHeight >= 800 && _obj.screenHeight <= 960) {
		_obj.sigPad = 'sig_Phone.html';
		_obj.backIcon = 'img/Back-64.png';
		_obj.backIconSelected = 'img/Back-64Selected.png';
		_obj.tablet = false;
		_obj.iconSize = 128;
		_obj.medIconSize = 96;
		_obj.smallIconSize = 64;
		_obj.xSmallIconSize = 48;
		_obj.rowHeight = 500;
		_obj.fieldHeight = 65;
		
		_obj.largeFont = {
			fontSize : 36,
			fontWeight : 'bold'
		};
		_obj.font = {
			fontSize : 24,
			fontWeight : 'bold'
		};
		_obj.smallFont = {
			fontSize : 18,
			fontWeight : 'bold'
		};
		_obj.xSmallFont = {
			fontSize : 16,
			fontWeight : 'bold'
		};
	} else if (_obj.screenHeight >= 961 && _obj.screenHeight <= 1199) {
		_obj.sigPad = 'sig_Phone.html';
		_obj.backIcon = 'img/Back-64.png';
		_obj.backIconSelected = 'img/Back-64Selected.png';
		_obj.tablet = false;
		_obj.iconSize = 128;
		_obj.medIconSize = 64;
		_obj.smallIconSize = 48;
		_obj.xSmallIconSize = 32;
		_obj.rowHeight = 600;
		_obj.fieldHeight = 85;
		
		_obj.largeFont = {
			fontSize : 42,
			fontWeight : 'bold'
		};
		_obj.font = {
			fontSize : 32,
			fontWeight : 'bold'
		};
		_obj.smallFont = {
			fontSize : 24,
			fontWeight : 'bold'
		};
		_obj.xSmallFont = {
			fontSize : 16,
			fontWeight : 'bold'
		};
	} else {
		_obj.sigPad = 'sig_Tablet.html';
		_obj.backIcon = 'img/Back-128.png';
		_obj.backIconSelected = 'img/Back-128Selected.png';
		_obj.tablet = true;
		_obj.iconSize = 256;
		_obj.medIconSize = 128;
		_obj.smallIconSize = 96;
		_obj.xSmallIconSize = 64;
		_obj.rowHeight = 800;
		_obj.fieldHeight = 95;
		
		_obj.largeFont = {
			fontSize : 48,
			fontWeight : 'bold'
		};
		_obj.font = {
			fontSize : 42,
			fontWeight : 'bold'
		};
		_obj.smallFont = {
			fontSize : 28,
			fontWeight : 'bold'
		};
		_obj.xSmallFont = {
			fontSize : 24,
			fontWeight : 'bold'
		};
	}
	return _obj;
}

module.exports = GLOBALS;
