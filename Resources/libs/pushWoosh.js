/*
 * Pushwoosh.js
 * Library used for abstracting the calls between the iOS lib for Pushwoosh, or Android module for Pushwoosh.
 * This gives us one unified set of calls for the model.
 */

var PushWooshModule; // Create pointer for PushWhoosh LIB for iOS, or module for Android.

function PushWoosh() {
	this.init();
}

// Used to init the library.
PushWoosh.prototype.init = function () {
	// Define default event functions.
	this.registeredEvent = function () {};
	this.newNotificationEvent = function () {};
};

// Cross-platform register call.
PushWoosh.prototype.register = function () {
	// Handle the registration.
	if (util.isIos()) {
		this.registerIos(this.registeredEvent);
	} else if (util.isAndroid()) {
		this.registerAndroid(this.registeredEvent);
	}
};

// Used to register for push notifications on Android.
PushWoosh.prototype.registerAndroid = function (callback) {
	var self = this;
	PushWooshModule = require('com.arellomobile.push');
	Ti.API.info("module is => " + PushWooshModule);
	// NOTE: all the functions fire on the background thread, do not use any UI or Alerts here
	PushWooshModule.pushNotificationsRegister(config.googleProjectId, config.pushwooshAppId, {
		success:function(e) {
			Ti.API.info('JS registration success event: ' + e.registrationId);
			callback(true, e.registrationId);
		},
		error:function(e) {
			Ti.API.error("Error during registration: " + e.error);
			callback(false, '', e.error);
		},
		callback:function(e) {
			self.newNotificationEvent(e);
		}
	});
};

// Used to register for push notifications on iOS.
PushWoosh.prototype.registerIos = function (callback) {

	var self = this;
	PushWooshModule = require('libs/pushWooshIos');

	PushWooshModule.appCode = config.pushwooshAppId;
	PushWooshModule.sendAppOpen();

	var deviceToken = null;

	// Check if the device is running iOS 8 or later
	if (Ti.Platform.name == "iPhone OS" && parseInt(Ti.Platform.version.split(".")[0]) >= 8) {
		function registerForPush() {
			Ti.Network.registerForPushNotifications({
				success: deviceTokenSuccess,
				error: deviceTokenError,
				callback: receivePush
			});
			// Remove event listener once registered for push notifications
			Ti.App.iOS.removeEventListener('usernotificationsettings', registerForPush);
		};
		// Wait for user settings to be registered before registering for push notifications
		Ti.App.iOS.addEventListener('usernotificationsettings', registerForPush);
		// Register notification types to use
		Ti.App.iOS.registerUserNotificationSettings({
			types: [Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT, Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND, Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE]
		});
	} else {
		// For iOS 7 and earlier
		Ti.Network.registerForPushNotifications({
			// Specifies which notifications to receive
			types: [Ti.Network.NOTIFICATION_TYPE_BADGE, Ti.Network.NOTIFICATION_TYPE_ALERT, Ti.Network.NOTIFICATION_TYPE_SOUND],
			success: deviceTokenSuccess,
			error: deviceTokenError,
			callback : receivePush
		});
	}

	// Process incoming push notifications
	function receivePush(e) {
		//send stats to Pushwoosh about push opened
		PushWooshModule.sendPushStat(e.data.p);
		self.newNotificationEvent(e);
	}

	// Save the device token for subsequent API calls
	function deviceTokenSuccess(e) {
		deviceToken = e.deviceToken;
		Ti.API.info('successfully registered for apple device token with ' + e.deviceToken);
		PushWooshModule.register(deviceToken, function(data) {
			Ti.API.debug("PushWoosh register success: " + JSON.stringify(data));
			callback(true, e.deviceToken);
			PushWooshModule.setTags({alias:"device1"}, function(data) {
				Ti.API.debug("PushWoosh sendTags success: " + JSON.stringify(data));
			},function(e) {
				Ti.API.warn("Couldn't setTags with PushWoosh: " + JSON.stringify(e));
			});
		}, function(e) {
			callback(false, '', JSON.stringify(e));
			Ti.API.warn("Couldn't register with PushWoosh: " + JSON.stringify(e));
		});
	}

	function deviceTokenError(e) {
		callback(false, '', e.error);
		alert('Failed to register for push notifications! ' + e.error);
		Ti.API.warn("push notifications disabled: " + JSON.stringify(e));
	}

	Ti.API.info('registering with PushWoosh');

};

module.exports = PushWoosh;

/*
 * EOF
 */
