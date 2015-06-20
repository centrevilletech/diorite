/*
 * pushwoosh.js
 * Library used to interact with the pushwoosh API from iOS.
 */

var pushwooshService;
var pushwooshOldTimestamp = 0.0;
var pushwooshdeviceToken;
var pushwooshBaseURL = 'https://cp.pushwoosh.com/json/1.3/';

var helper = function(url, method, params, lambda, lambdaerror) {
	var xhr = Ti.Network.createHTTPClient();
	xhr.setTimeout(60000);
	xhr.onerror = function(e) {
		Ti.API.log('DEBUG LOG ERROR: ' + JSON.stringify(this));
		lambdaerror(this, e);
	};
	xhr.onload = function() {
		Ti.API.log('DEBUG LOG SEND: ' + JSON.stringify(this));
		if(this.status == 200) {
			if(lambda)
				lambda(this);
		}
		else {
			if(lambdaerror)
				lambdaerror(this);
		}
	};
	// open the client
	xhr.open(method, url);
	xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
	// send the data
	xhr.send(params);
};

exports.getToken = function() {
	if (pushwooshdeviceToken && pushwooshdeviceToken != null)
		return pushwooshdeviceToken;
	return Ti.Network.remoteDeviceUUID;
};

exports.register = function(deviceToken, lambda, lambdaerror) {
	pushwooshdeviceToken = deviceToken;
	var method = 'POST';
	var token = exports.getToken();
	var url = pushwooshBaseURL + 'registerDevice';
	
	var dt = new Date();
	var timezoneOffset = dt.getTimezoneOffset() * 60;	//in seconds
	var deviceTypeId = Titanium.Platform.name == "android" ? 3 : 1;
	
	var params = {
			request : {
				application : exports.appCode,
				push_token : token,
				language : Titanium.Platform.locale,
				hwid : Titanium.Platform.id,
				timezone : timezoneOffset,
				device_type : deviceTypeId
			}
		};

	payload = (params) ? JSON.stringify(params) : '';
	Ti.API.info('sending registration with params ' + payload);
	
	helper(url, method, payload, lambda, lambdaerror);
};

exports.unregister = function(lambda, lambdaerror) {
	var method = 'POST';
	var token = exports.getToken();
	var url = pushwooshBaseURL + 'unregisterDevice';
	
	var params = {
			request : {
				application : exports.appCode,
				hwid : Titanium.Platform.id
			}
		};

	payload = (params) ? JSON.stringify(params) : '';
	Ti.API.info('sending registration with params ' + payload);
	helper(url, method, payload, lambda, lambdaerror);
};

exports.sendBadge = function(badgeNumber, lambda, lambdaerror) {
	var method = 'POST';
	var token = exports.getToken();
	var url = pushwooshBaseURL + 'setBadge';
	
	var params = {
			request : {
				application : exports.appCode,
				hwid : Titanium.Platform.id,
				badge: badgeNumber
			}
		};

	payload = (params) ? JSON.stringify(params) : '';
	Ti.API.info('sending badge with params ' + payload);
	helper(url, method, payload, lambda, lambdaerror);
};

exports.sendAppOpen = function(lambda, lambdaerror) {
	var method = 'POST';
	var token = exports.getToken();
	var url = pushwooshBaseURL + 'applicationOpen';
	
	var params = {
			request : {
				application : exports.appCode,
				hwid : Titanium.Platform.id
			}
		};

	payload = (params) ? JSON.stringify(params) : '';
	Ti.API.info('sending appOpen with params ' + payload);
	helper(url, method, payload, lambda, lambdaerror);
};

exports.sendPushStat = function(hashValue, lambda, lambdaerror) {
	var method = 'POST';
	var token = exports.getToken();
	var url = pushwooshBaseURL + 'pushStat';
	
	var params = {
			request : {
				application : exports.appCode,
				hwid : Titanium.Platform.id,
				hash: hashValue
			}
		};

	payload = (params) ? JSON.stringify(params) : '';
	Ti.API.info('sending pushStat with params ' + payload);
	helper(url, method, payload, lambda, lambdaerror);
};
	
exports.setTags = function(tagsJsonObject, lambda, lambdaerror) {
	var method = 'POST';
	var token = exports.getToken();
	var url = pushwooshBaseURL + 'setTags';
	
	var params = {
			request : {
				application : exports.appCode,
				hwid : Titanium.Platform.id,
				tags: tagsJsonObject
			}
		};

	payload = (params) ? JSON.stringify(params) : '';
	Ti.API.info('sending tags with params ' + payload);
	helper(url, method, payload, lambda, lambdaerror);
};

exports.startLocationTracking = function(mode) {
	if (Ti.Geolocation.locationServicesEnabled) {
		Ti.App.Properties.setString('bg-location-mode', mode);
		pushwooshService = Ti.App.iOS.registerBackgroundService({url:'bg_location_service.js'});
		
		Ti.App.removeEventListener('resumed', exports.handleResume);
		Ti.App.addEventListener('resumed', exports.handleResume);

		Ti.Geolocation.purpose = 'Get Current Location';
		Ti.Geolocation.distanceFilter = 10;
		Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
		Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;

		Ti.Geolocation.removeEventListener('location', exports.handleLocation);
	    Ti.Geolocation.addEventListener('location', exports.handleLocation);
	} else {
	    Ti.API.info('location services disabled');
	}
};

exports.stopLocationTracking = function() {
	Ti.Geolocation.removeEventListener('location', exports.handleLocation);
	pushwooshService.unregister();
};

exports.handleResume = function(e) {
	Ti.API.info("app has resumed from the background");
	
	// Ti.Geolocation.distanceFilter = 1;
	Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
	Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;
};

exports.handleLocation = function(e) {
	Ti.API.info('Location event type: ' + e.type);
    if (e.error) {
        Ti.API.info('Error: ' + e.error);
    } else {
    	var timestamp = parseFloat(e.coords.timestamp);
    	if (timestamp - pushwooshOldTimestamp > 10000) {
       		exports.sendLocation(e.coords);
       		pushwooshOldTimestamp = timestamp;
       	}
       	
    }
},

exports.sendLocation = function(location) {
	var method = 'POST';
	var token = exports.getToken();
	var url = pushwooshBaseURL + 'getNearestZone';
	
	var params = {
			request : {
				application : exports.appCode,
				hwid : Titanium.Platform.id,
				lat : location.latitude,
				lng : location.longitude
			}
		};

	payload = (params) ? JSON.stringify(params) : '';
	Ti.API.info('sending location with params ' + payload);
	helper(url, method, payload);
};

/*
 * EOF
 */