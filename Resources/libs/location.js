/*
 * location.js
 * Location services cross-platform abstraction layer.
 */

function Location() {
	this.init();
}

// Used to init location.js
Location.prototype.init = function (callback) {
	var self = this;
	this.currentlyRunning = true;
	this.purpose = 'Location tracking.';
	this.authorizeTitle = 'Authorize Location Services';
	this.authorizeMessage = 'In order to use this app, please turn your GPS on.';
	return true;
};

// Used to init location.js
Location.prototype.addLocationAppEvents = function () {
	var self = this;
	Ti.App.addEventListener('pause', location.stop);
	Ti.App.addEventListener('resumed', location.start);
	return true;
};

// Used to start the location tracking.
Location.prototype.start = function (callback) {
	var self = this;
	// First, handle the missing callback parameter.
	if (typeof callback !== 'function') {
		var callback = function () {};
	}
	// Second, start the location services.
	console.log('location.js -> Attempting to start location services ...');
	location.locationServiceGuid = util.generateGuid();
	location.authorize(function () { // Authorized successfully.
		console.log('location.js -> Successfully started location services ...');
		location.currentlyRunning = true;
		location.getLastKnownLocation(function (successful, locationData) {
			callback(successful, locationData);
		});
	}, function () { // Failed to authorize.
		console.log('location.js -> Failed to start location services ...');
		alert('Fatal. Failed to authorize location services.');
	});
};

// Used to stop the location tracking.
Location.prototype.stop = function () {
	var self = this;
	console.log('location.js -> Stopping location services ...');
	location.currentlyRunning = false;
	Ti.Geolocation.removeEventListener('location', location.recordLocationData);
};

// Used to get the last known location coordinates.
Location.prototype.getLastKnownLocation = function (callback) {
	// First, handle the missing callback parameter.
	if (typeof callback !== 'function') {
		var callback = function () {};
	}
	// Second, make sure we've got a last known location, otherwise, return false.
	if (!storage.get('lastKnownLocation')) {
		callback(false, 'No location data available. Please make sure the GPS is enabled.');
		return;
	}
	// All is well. Return the coords through the callback and through a return.
	callback(true, storage.get('lastKnownLocation'));
	return storage.get('lastKnownLocation');
};

// Used to authorize location tracking.
Location.prototype.authorize = function (callback) {
	var self = this;
	// First, handle the missing callback parameter.
	if (typeof callback !== 'function') {
		var callback = function () {};
	}
	if (Ti.Geolocation.locationServicesEnabled) {
		Ti.Geolocation.purpose = this.purpose;
		Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
		Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;
		Ti.Geolocation.distanceFilter = 0;
		Ti.Geolocation.addEventListener('location', location.recordLocationData);
		location.isAuthorized(function (isAuthorized) {
			if (isAuthorized) {
				callback(true);
			} else {
				location.showAuthorizeWindow(callback);
			}
		});
	} else {
		location.showAuthorizeWindow(callback);
	}
};

// Used to determine if we're authorized or not.
Location.prototype.isAuthorized = function (callback) {
	Titanium.Geolocation.getCurrentPosition(function (e) {
		if (e.error) {
			callback(false, e.error);
		} else {
			callback(true);
		}
	});
};

// Used to store the location data from the location listener.
Location.prototype.recordLocationData = function (location) {
	// Make sure we've got coords available to us.
	if (!location || !location.coords) {
		console.log('Error: recordLocationData() - No location data found to record. Quietly aborting the method ...');
		return;
	}
	// Store the coords we have in temporary storage.
	var locationData = {
		coords: {
			latitude:location.coords.latitude,
			longitude:location.coords.longitude,
			altitude:location.coords.altitude,
			accuracy:location.coords.accuracy
		},
		serviceGuid: this.locationServiceGuid
	};
	return storage.set('lastKnownLocation', locationData);
};

// Used to prompt a user to authorize the GPS.
Location.prototype.showAuthorizeWindow = function (callback) {

	var self = this;

	// First, handle the missing callback parameter.
	if (typeof callback !== 'function') {
		var callback = function () {};
	}

	// Second, build the window and request authorization.
	var authorizeWindow = Ti.UI.createWindow({
		title: this.authorizeTitle,
		orientationModes: [Ti.UI.PORTRAIT],
		width: _.screenwidth,
		opacity: _.opacity,
		navBarHidden: true,
		fullscreen: true,
		windowSoftInputMode: _.inputMode,
		statusBarStyle: _.statusBar,
		layout: 'vertical',
		zIndex: 1000
	});

	var instructionTitle = Ti.UI.createLabel({
		text: 'GPS Disabled',
		font:{
			fontSize: 40
		},
		color: '#FFF',
		width: '100%',
		top: 80,
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
	});
	authorizeWindow.add(instructionTitle);

	var instructionText = Ti.UI.createLabel({
		text: this.authorizeMessage,
		font:{
			fontSize: 14
		},
		color: '#FFF',
		width: '80%',
		center: 0,
		height: 80,
		top: 20
	});
	authorizeWindow.add(instructionText);

	var authorizeButton = Ti.UI.createButton({
		title: '   Check for Location Services ...   ',
		top: 20,
		center: 0,
		borderWidth: 3,
		borderColor: '#FFF',
		borderRadius: 3,
		color: '#FFF'
	});
	authorizeWindow.add(authorizeButton);

	authorizeButton.addEventListener('click', function (e) {
		location.isAuthorized(function (isAuthorized) {
			if (isAuthorized) {
				authorizeWindow.animate({
					opacity:0,
					duration:600
				}, function () {
					authorizeWindow.close();
					callback();
				});
			} else {
				alert('No GPS available. Please try again.');
			}
		});
	});

	// Open the window with a nice animation.
	authorizeWindow.open();
	authorizeWindow.animate({
		opacity:1,
		duration:600
	});

};

module.exports = Location;

/*
 * EOF
 */