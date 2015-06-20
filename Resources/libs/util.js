/*
 * util.js
 */

function Util() {

}

// Load controller object global.
var controllers = [];

// Used to set a platform version constant.
Util.version = Titanium.Platform.version.replace(/\./g,'');

// Used to determine if this is iOS or not.
Util.prototype.isIos = function() {
	if (Ti.Platform.name === 'iPhone OS') {
		return true;
	} else {
		return false;
	}
};

// Used to determine if this is Android or not.
Util.prototype.isAndroid = function() {
	if (Ti.Platform.name === 'android') {
		return true;
	} else {
		return false;
	}
};

// Used to determine if this is iOS7 or not.
Util.prototype.isIos7OrGreater = function() {
	if (Ti.Platform.name === 'iPhone OS' && Util.version >= 71) {
		return true;
	} else {
		return false;
	}
};

// Used to show a NON "alert" message box.
Util.prototype.infoMessage = function(message,callback) {
	if (typeof message !== 'string') {
		return;
	}
	var infoDialog = Titanium.UI.createAlertDialog({
		title: L('Info', 'Info'),
		message: message,
		buttonNames: [L('OK', 'OK')]
	});
	infoDialog.addEventListener('click', function(e) {
		if (typeof callback === 'function') {
			callback(infoDialog);
		}
	});
	infoDialog.show();
};

// Used to retrieve screen width.
Util.prototype.winWidth = Titanium.Platform.displayCaps.platformWidth;
Util.prototype.winHeight = Titanium.Platform.displayCaps.platformHeight;

// Used to prompt a user for how to open an address, or open automatically, based on the platform.
Util.prototype.openAddress = function (destAddr, startAddr) {
	var self = this;
	var destParam = '';
	var startParam = '';
	if (typeof destAddr !== 'undefined') {
		destParam = '&daddr=' + encodeURIComponent(destAddr);
	}
	if (typeof startAddr !== 'undefined') {
		startParam = '&saddr=' + encodeURIComponent(startAddr);
	}
	if (self.isIos()) { // iOS. Prompt user if they want Apple Maps or Google Maps.
		var infoDialog = Titanium.UI.createAlertDialog({
			title: L('Info', 'Info'),
			message: L('Please_select', 'Please select which map you want to use')+':',
			buttonNames: ['Google Maps', 'Apple Maps', L('Cancel', 'Cancel')],
			cancel:2
		});
		infoDialog.addEventListener('click', function(e) {
			if (e.index === 1) { // Apple Maps was chosen.
				Ti.Platform.openURL("http://maps.apple.com/?linkSrc=mobileApp" + startParam + destParam);
			} else if (e.index === 0) { // Google Maps was chosen.
				Ti.Platform.openURL("http://maps.google.com/maps?linkSrc=mobileApp" + startParam + destParam + '&dirflg=r&mra=ltm&t=m'); // Google Maps.
			}
		});
	infoDialog.show();
	} else if (self.isAndroid()) { // Android. Open Google Maps.
		var mapIntent = Ti.Android.createIntent({
		    action : Ti.Android.ACTION_VIEW,
		    data : "http://maps.google.com/maps?linkSrc=mobileApp" + startParam + destParam + '&dirflg=r&mra=ltm&t=m'
		});
		Ti.Android.currentActivity.startActivity(mapIntent);
	} else { // Unknown platform. Just open the browser to Google Maps.
		Ti.Platform.openURL("http://maps.google.com/?linkSrc=mobileApp" + startParam + destParam + '&dirflg=r&mra=ltm&t=m');
	}
}

// Used to remove all rows from a table section.
// TODO: Figure out why this causes assertion failer issues on iOS.
Util.prototype.removeAllTableSectionRows = function (tableSection) {
	console.log('WARNING: UTIL.removeAllTableSectionRows() function in use, which has known issues on iOS. Proceed with caution.');
	if (!tableSection) {
		console.log('Illegal use of removeTableSectionRows UTIL method. No tableSection passed.');
		return;
	}
	var rows = tableSection.getRows();
	var i = 0;
	while (rows && rows[i]) {
		tableSection.remove(rows[i]);
		i++;
	}
	return true;
};

// Used to merge two objects together.
Util.prototype.mergeObjects = function (obj, props) {
	var newObj = {};
	for(var i=0, l=arguments.length; i<l; i++){
		this.mixIn(newObj, arguments[i]);
	}
	return newObj;
};

// Used to delete a row from an array.
// Array Remove - By John Resig (MIT Licensed)
Util.prototype.deleteArrayRow = function (arrayToEdit, from, to) {
  var rest = arrayToEdit.slice((to || from) + 1 || arrayToEdit.length);
  arrayToEdit.length = from < 0 ? arrayToEdit.length + from : from;
  return arrayToEdit.push.apply(arrayToEdit, rest);
};

// Used to determine if object is an array or not.
Util.prototype.isArray = function (o) {
  return Object.prototype.toString.call(o) == "[object Array]";
};

// Dojo object extend function.
Util.prototype.mixIn = function (target, source) {
	var empty = {};
	var name, s, i;
	for(name in source){
		s = source[name];
		if(!(name in target) || (target[name] !== s && (!(name in empty) || empty[name] !== s))){
			target[name] = s;
		}
	}
	return target; // Object
};

// Used to convert a boolean to a flag.
Util.prototype.convertBooleanToFlag = function (bool) {
	if (bool) {
		return 'Y';
	} else {
		return 'N';
	}
};

// Used to convert a flag to a boolean.
Util.prototype.convertFlagToBoolean = function (flag) {
	if (typeof flag !== 'undefined' && flag === 'Y') {
		return true;
	} else {
		return false;
	}
};

// Used to remove all children from a view.
Util.prototype.removeAllChildren = function (objeto) {
    for (i in objeto.children) {
        var child = objeto.children[0];
        this.removeAllChildren(child);
        objeto.remove(child);
        child = null;
    }
    return true;
};

// Used to hide the keyboard.
Util.prototype.hideKeyboard = function(activeWindow) {
	if (this.isIos()) {
		var focusBreaker = Ti.UI.createTextField({
			width:1,
			height:1,
			opacity:0,
			top:-1,
			left:-1
		});
		activeWindow.add(focusBreaker);
		focusBreaker.focus();
		focusBreaker.blur();
		activeWindow.remove(focusBreaker);
	} else {
		Ti.UI.Android.hideSoftKeyboard();
	}
};

// Used to generate a guid.
// Found here: http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
Util.prototype.generateGuid = function() {
	var d = new Date().getTime();
	var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
		return (c=='x' ? r : (r&0x7|0x8)).toString(16);
	});
	return guid;
};

// Used to return a debug string for giving general info about the app environment.
// Found here: http://stackoverflow.com/questions/7386690/how-to-obtain-version-of-app
Util.prototype.debugInfo = function () {
	var caps = Titanium.Platform.displayCaps;
	var s0 = 'appversion=' + Titanium.App.version;
	var s1 = 'osname=' + Titanium.Platform.osname + ',name=' + Titanium.Platform.name + ',version=' + Titanium.Platform.version + ',model=' + Titanium.Platform.model;
	var s2 = 'width=' + caps.platformWidth + ',height=' + caps.platformHeight + ',dpi=' + caps.dpi;
	return s0 + ',' + s1 + ',' + s2;
};

// Used to return the platform name.
Util.prototype.platformName = function () {
	if (this.isIos()) {
		return 'ios';
	} else if (this.isAndroid()) {
		return 'android';
	} else {
		return 'unknown';
	}
};

// Used to calculate animation time between iOS and Android.
Util.prototype.calcAnimationTime = function (animTime) {
	if (typeof animTime !== 'number') {
		return;
	}
	if (this.isAndroid()) {
		return animTime / 1.25;
	}
	return animTime;
};

module.exports = Util;

/*
 * EOF
 */