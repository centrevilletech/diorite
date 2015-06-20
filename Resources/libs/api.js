/*
 * api.js
 * API library for the app.
 */

function Api() {

}

// Used to create a new HTTP client.
Api.prototype.create = function () {
	return Titanium.Network.createHTTPClient({
		timeout: 20000
	});
};

module.exports = Api;

/*
 * EOF
 */