var STOP = function() {
	var intent = Titanium.Android.createServiceIntent({
		url : 'POD.js'
	});
	// Service should run its code every 2 seconds.
	intent.putExtra('interval', 30000);
	// A message that the service should 'echo'
	intent.putExtra('message_to_echo', 'Titanium rocks!');

	var service = Titanium.Android.createService(intent);
	service.addEventListener('resume', function(e) {
		Titanium.API.info('Service code resumes, iteration ' + e.iteration);
	});
	service.addEventListener('pause', function(e) {
		//Titanium.API.info('Service code pauses, iteration ' + e.iteration);
		//if (e.iteration === 3) {
		//    Titanium.API.info('Service code has run 3 times, will now stop it.');
		//    service.stop();
		// }
	});
	if(Ti.Android.isServiceRunning(intent)) {
		Ti.API.warn('SERVICE IS RUNNING')
	}
	
	service.stop();
	return;
};
module.exports = STOP;