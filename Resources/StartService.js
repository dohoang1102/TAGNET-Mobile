var START = function() {
	var intent = Titanium.Android.createServiceIntent({
		url : 'POD.js'
	});
	// Service should run its code every 2 seconds.
	intent.putExtra('interval', 180000);
	// A message that the service should 'echo'
	intent.putExtra('message_to_echo', 'Titanium rocks!');

	var service = Titanium.Android.createService(intent);
	service.addEventListener('resume', function(e) {
		Titanium.API.info('Service code resumes, iteration ' + e.iteration);
	});
	service.addEventListener('pause', function(e) {

		//    Titanium.API.info('Service code has run 3 times, will now stop it.');
		//service.stop();

	});
	if (!Ti.Android.isServiceRunning(intent)) {
		Ti.API.warn('Service not running ... Starting now!');
		Ti.Android.startService(intent);
	} else {
		Ti.Android.stopService(intent);
		Ti.API.warn('Service was running, now STOPPED  ... Starting again now!');
		Ti.Android.startService(intent);
	}

	//service.start();
	return;
};
module.exports = START;
