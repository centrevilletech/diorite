/*
 * Used to navigate the app.
 */

// Build the object.
function NavBar(params) {
	this.init(params);
}

NavBar.prototype.init = function(params) {

	// Handle empty params.
	if (params === {}) {
		params = {
			barAction: 'close'
		};
	}

	// Create reference point.
	var self = this;

	self.navBarPanel = Ti.UI.createView({
		backgroundColor: _.blue,
		height: 50,
		width: '100%',
		layout: 'absolute',
		top: 0
	});

	if (params.barAction === 'menu') { // Use the menu system.

		var menuButton = Ti.UI.createImageView({
			height: 34,
			width: 34,
			left: 9,
			center: 0,
			backgroundImage: '/images/menuButton.png'
		});
		self.navBarPanel.add(menuButton);

		menuButton.addEventListener('click', function (e) {
			var menu = app.loadCachedComponent('menu');
			menu.open();
		});

	} else if (params.barAction === 'close') { // Use a basic close button.

		var closeButton = Ti.UI.createButton({
			height: 40,
			width: 40,
			left: 5,
			top: 5,
			bottom: 5,
			title: '<',
			color: '#FFF',
			backgroundColor: 'transparent',
			font: {
				fontSize: '24'
			}
		});
		self.navBarPanel.add(closeButton);

		closeButton.addEventListener('click', function (e) {
			if (util.isIos()) {
					self.activeWindow.animate({
					opacity: 0,
					duration: 500
				}, function () {
					self.activeWindow.close();
				});
			} else {
				self.activeWindow.close();
			}
		});

	}

	self.panelTitle = Ti.UI.createLabel({
		color: "#000",
		width: '60%',
		left: '20%',
		right: '20%',
		textAlign: 'center',
		color: '#FFF'
	});
	self.navBarPanel.add(self.panelTitle);

	// Add right button if present.
	if (params.rightView) {
		self.rightContainer = Ti.UI.createView({
			width: '20%',
			right: '0%',
			left: '80%',
			height: '100%',
			layout: 'absolute'
		});
		self.navBarPanel.add(self.rightContainer);
		self.rightContainer.add(params.rightView);
	}

};

NavBar.prototype.addToView = function(activeWindow, navBarTitle) {

	// Create reference point.
	var self = this;
	var navBarPanel = self.navBarPanel;

	// Make the activeView accessible to other methods in this object.
	self.activeWindow = activeWindow;

	if (!activeWindow) {
		return false;
	} else {
		self.activeWindow = activeWindow;
	}

	if (!navBarTitle) {
		var navBarTitle = 'Default';
	}

	self.setTitle(navBarTitle);
	activeWindow.add(navBarPanel);

	return true;

};

// Used to set the navBar title.
NavBar.prototype.setTitle = function(title) {
	return this.panelTitle.text = title;
};

module.exports = NavBar;

/*
 * EOF
 */