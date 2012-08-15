var GPS = function() {
	Ti.API.warn('location fired : ' + Ti.App.username);
	if (Ti.App.username !== '' || Ti.App.username !== null) {
		var geo = {};
		var count = 0;
		//Ti.Geolocation.preferredProvider = "gps";
		geo.translateErrorCode = function(code) {
			if (code == null) {
				return 'unknown error';
			}
			switch (code) {
				case Ti.Geolocation.ERROR_LOCATION_UNKNOWN:
					return "Location unknown";
				case Ti.Geolocation.ERROR_DENIED:
					return "Access denied";
				case Ti.Geolocation.ERROR_NETWORK:
					return "Network error";
				case Ti.Geolocation.ERROR_HEADING_FAILURE:
					return "Failure to detect heading";
				case Ti.Geolocation.ERROR_REGION_MONITORING_DENIED:
					return "Region monitoring access denied";
				case Ti.Geolocation.ERROR_REGION_MONITORING_FAILURE:
					return "Region monitoring access failure";
				case Ti.Geolocation.ERROR_REGION_MONITORING_DELAYED:
					return "Region monitoring setup delayed";
			}
		}
		geo.locationCallback = function(e) {

			if (!e.success || e.error) {
				Ti.API.info("Code translation: " + geo.translateErrorCode(e.code));
				return;
			}

			var longitude = e.coords.longitude;
			var latitude = e.coords.latitude;
			//var altitude = e.coords.altitude;
			//var heading = e.coords.heading;
			//var accuracy = e.coords.accuracy;
			//var speed = e.coords.speed;
			var timestamp = e.coords.timestamp;
			//var altitudeAccuracy = e.coords.altitudeAccuracy;

			// reverse geo
			Titanium.Geolocation.reverseGeocoder(latitude, longitude, function(evt) {
				if (evt.success) {
					var places = evt.places;
					if (places && places.length) {

						//var entry_address = places[0].address;
						//var entry_street = places[0].street;
						//var entry_city = places[0].city;
						//var entry_state = places[0].state;
						//var entry_zipcode = places[0].zipcode;
						//var entry_country = places[0].country;

						//saveThis = {};

						var saveThis = {
							username : Ti.App.username,
							latitude : latitude,
							longitude : longitude,
							location : places[0].address
						}
						//alert(JSON.stringify(saveThis));
						geo.saveTheLocation(saveThis);
						//gc();
						//Titanium.Geolocation.removeEventListener('location', geo.locationCallback);

					}
					Ti.API.debug("reverse geolocation result = " + JSON.stringify(evt));
				}
			});

			//Titanium.API.info('geo - location updated: ' + new Date(timestamp) + ' long ' + longitude + ' lat ' + latitude + ' accuracy ' + accuracy);
		};
		geo.saveTheLocation = function(data) {
			var _data = data;
			var sql = Titanium.Database.open('mobile'), _data = data;
			sql.execute('UPDATE user SET longitude = "' + _data.longitude + '", latitude = "' + _data.latitude + '", location = "' + _data.location + '" where username = "' + Ti.App.username + '";');
			sql.close();
			sql = null;
			_data = null;
			//db.execute('CREATE TABLE IF NOT EXISTS user (id integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, username UNIQUE, password, longitude, latitude, location, available, idpSignature text)');
		}
		geo.getCoords = function() {
			//
			//  SHOW CUSTOM ALERT IF DEVICE HAS GEO TURNED OFF
			//
			if (Titanium.Geolocation.locationServicesEnabled === false) {
				//Alert that location services are disabled
				//Titanium.UI.createAlertDialog({title:'Kitchen Sink', message:'Your device has geo turned off - turn it on.'}).show();
			} else {

				Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_HIGH;

				Titanium.Geolocation.distanceFilter = 45;

				Titanium.Geolocation.getCurrentPosition(function(e) {
					if (!e.success || e.error) {

						return;
					}

				});

				//
				// EVENT LISTENER FOR GEO EVENTS - THIS WILL FIRE REPEATEDLY (BASED ON DISTANCE FILTER)
				//

				try {
					Ti.API.info('@@@ LOCATION SERVICE DEBUG @@@ Adding locationCallBack');
					Titanium.Geolocation.addEventListener('location', geo.locationCallback);
				} catch(err) {
					Ti.API.info('@@@ LOCATION SERVICE DEBUG ERROR @@@ : ' + err);
				}

				//setTimeout(function() {
				//	Ti.Geolocation.fireEvent('location', locationCallback);
				//}, 5000);
				locationAdded = true;
			}
		}
		/*
		 function gc() {
		 Titanium.Geolocation.removeEventListener('location', geo.locationCallback);
		 delete geo;
		 geo = null;
		 return;
		 }
		 */

		geo.getCoords();
		setTimeout(function(){
			Titanium.Geolocation.removeEventListener('location', geo.locationCallback);
		},30000);
		
	}
	return;
};

module.exports = GPS;
