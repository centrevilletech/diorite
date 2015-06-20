/*
 * storage.js
 * Mock-DB storage library for the app.
 */

function Storage() {

}

// Used to set an object in storage.
Storage.prototype.set = function(objectName, object) {
	if (!objectName || !object) {
		console.log('storage.set call failed, due to undefined parameters.');
		return false;
	}
	return Ti.App.Properties.setString(objectName, JSON.stringify(object));
};

// Used to get an object from storage.
Storage.prototype.get = function (objectName) {
	if (!objectName) {
		console.log('storage.get call failed, due to undefined parameters.');
		return false;
	}
	if (!Ti.App.Properties.getString(objectName) || Ti.App.Properties.getString(objectName) === '') {
		return false;
	} else {
		return JSON.parse(Ti.App.Properties.getString(objectName));
	}
}

// Used to get an object from storage.
Storage.prototype.remove = function (objectName) {
	if (!objectName) {
		console.log('storage.remove call failed, due to undefined parameters.');
		return false;
	}
	return Ti.App.Properties.removeProperty(objectName);
}

module.exports = Storage;

/*
 * EOF
 */