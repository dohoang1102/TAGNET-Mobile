var NOTIFICATION = function() {
	var ACTIVITY = Ti.Android.currentActivity;
	var intent = Ti.Android.createIntent({
		action : Ti.Android.ACTION_MAIN,
		// you can use className or url to launch the app
		// className and packageName can be found by looking in the build folder
		// for example, mine looked like this
		// build/android/gen/com/appcelerator/test/Test7Activity.java
		// className : 'com.appcelerator.test.Test7Activity',

		// if you use url, you need to make some changes to your tiapp.xml
		url : 'app.js',
		flags : Ti.Android.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED | Ti.Android.FLAG_ACTIVITY_SINGLE_TOP
	});
	intent.addCategory(Titanium.Android.CATEGORY_LAUNCHER);

	var pending = Ti.Android.createPendingIntent({
		activity : ACTIVITY,
		intent : intent,
		type : Ti.Android.PENDING_INTENT_FOR_ACTIVITY,
		flags : Ti.Android.FLAG_ACTIVITY_NO_HISTORY
	});

	var notification = Ti.Android.createNotification({
		contentIntent : pending,
		contentTitle : 'TAGNET Mobile!',
		contentText : 'Please check your inbox',
		tickerText : 'Please check your inbox',
		// "when" will only put the timestamp on the notification and nothing else.
		// Setting it does not show the notification in the future
		when : new Date().getTime(),
		defaults : Titanium.Android.NotificationManager.DEFAULT_SOUND,
		icon : Ti.App.Android.R.drawable.appicon,
		flags : Titanium.Android.ACTION_DEFAULT | Titanium.Android.FLAG_AUTO_CANCEL | Titanium.Android.FLAG_SHOW_LIGHTS
	});

	Ti.Android.NotificationManager.notify(1, notification);
	return;
}

module.exports = NOTIFICATION;
