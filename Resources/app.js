/*
 * app.js
 */

// Load dependency files.
var app = new (require('libs/app'))(),
	util = new (require('libs/util'))(),
	storage = new (require('libs/storage'))(),
	anim = new (require('libs/anim'))(),
	_ = new (require('libs/style'))(),
	api = new (require('libs/api'))(),
	location = new (require('libs/location'))(),
	config = new (require('config'))(),
	moment = require('libs/moment');

// Set the app background color to Prismarine.
Ti.UI.backgroundColor = _.blue;

// Set a closure, and proceed.
(function () {

	// First, load the selections screen controller up.
	var selectListCtrl = app.loadController('selectList');

	// Second, let's build out the menu and load it into the app cache.
	var menu = app.loadCachedComponent('menu', {
		activeWindow: selectListCtrl.view.window,
		links: [
			{
				title:'Lists',
				controllerName:'selectList'
			},
			{
				title:'Settings',
				controllerName:'settings'
			}
		]
	});

	// OK, let's get this started. :)
	selectListCtrl.open();

})();

// Helpful quote for future programmers:
// "Meow" - The Cat.

/*
 * EOF
 */