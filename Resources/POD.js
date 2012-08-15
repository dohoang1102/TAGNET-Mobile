/**
 * @author Daniel Perussina
 */
var SERVICE = function() {
	Ti.API.warn('POD service started');
	if (Ti.App.username === null || Ti.App.username === '' || Ti.App.track === false || Ti.App.track === 'false') {
		//alert('POD service by passed');
		Ti.API.warn('POD service by passed');
		return;
	}
	var app = {};
	app.service = Titanium.Android.currentService;
	app.intent = app.service.getIntent();
	app.message = app.intent.getStringExtra("message_to_echo");
	Titanium.API.info(app.message);
	app.gps = function() {

		Ti.API.warn('app.gps run()');
		var getGps = require('Location');
		var run = getGps();
	};
	app.sync = function() {
		Ti.API.warn('app.sync run()');
		var startSync = require('Sync');
		var run = startSync();
	};
	app.deleteService = function() {
		Ti.API.warn('app.deleteService run()');
		var startDelete = require('Delete_Service');
		var run = startDelete();
	};
	app.gps();
	app.sync();
	app.deleteService();

	return
};
SERVICE();
