/*
 * app.js
 */

function App() {

}

// Load the cache objects.
var models = [];
var views = [];
var controllers = [];
var components = [];

// Used to load a component.
App.prototype.loadComponent = function (componentName, params) {
	if (typeof params === 'undefined') {
		var params = {};
	}
	return new (require('/components/' + componentName))(params);
};

// Used to load a component using caching.
App.prototype.loadCachedComponent = function (componentName, params) {
	if (typeof params === 'undefined') {
		var params = {};
	}
	if (typeof components[componentName] === 'undefined') {
		components[componentName] = this.loadComponent(componentName, params);
	}
	return components[componentName];
};

// Used to load a model.
App.prototype.loadModel = function (modelName) {
	return new (require('/models/' + modelName))();
};

// Used to load a model using caching.
App.prototype.loadCachedModel = function (modelName) {
	if (typeof models[modelName] === 'undefined') {
		models[modelName] = this.loadModel(modelName);
	}
	return models[modelName];
};

// Used to load a view.
App.prototype.loadView = function (viewName) {
	return new (require('/views/' + viewName))();
};

// Used to load a view using caching.
App.prototype.loadCachedView = function (viewName) {
	if (typeof views[viewName] === 'undefined') {
		views[viewName] = this.loadView(viewName);
	}
	return views[viewName];
};

// Used to load a controller.
App.prototype.loadController = function (controllerName) {
	return new (require('/controllers/' + controllerName))();
};

// Used to load a controller using caching.
App.prototype.loadCachedController = function (controllerName) {
	if (typeof controllers[controllerName] === 'undefined') {
		controllers[controllerName] = this.loadController(controllerName);
	}
	return controllers[controllerName];
};

module.exports = App;

/*
 * EOF
 */