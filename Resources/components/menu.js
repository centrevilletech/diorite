/*
 * Used to navigate the app.
 */

// Build the object.
function Menu(params) {
	this.init(params);
}

Menu.prototype.init = function(params) {

	// Create reference point.
	var self = this;

	// Handle empty params.
	if (params === {} || typeof params.activeWindow === 'undefined') {
		return console.log('Menu failed to init! No activeWindow passed.');
	}

	self.activeWindow = params.activeWindow;

	self.menuContainer = Ti.UI.createView({
		zIndex: 100,
		width: '100%',
		height: '100%',
		opacity: 0
	});

	var menuBlockerView = Ti.UI.createView({
		opacity: 0.7,
		zIndex: 5,
		width: '100%',
		height: '100%',
		backgroundColor:'#000'
	});
	self.menuContainer.add(menuBlockerView);

	self.menuContentsView = Ti.UI.createView({
		zIndex:6,
		width:240,
		height:'100%',
		top:0,
		left:-240,
		backgroundColor:'#FFF'
	});
	self.menuContainer.add(self.menuContentsView);

	var navigationRows = [];

	self.navigationTable = Ti.UI.createTableView({
		width: '100%',
		top: 87,
		bottom: 0,
		height: Ti.UI.FILL,
		backgroundColor: '#FFF'
	});
	self.menuContentsView.add(self.navigationTable);

	self.navigationTableSection = Titanium.UI.createTableViewSection({
	 	headerTitle: 'Navigation',
	 	color: '#000',
	 	height: 50,
	 	left: 10,
	 	font: { fontSize:18 }
	});
	navigationRows.push(self.navigationTableSection);
	self.navigationTable.data = navigationRows;


	self.populate(params.links);

	// Used to handle a swipe against the menu.
	self.menuSwipeEvent = function(e) {
	    if (e.direction === 'left') {
	      self.close();
	    }
	};

	// Used to handle a click against the menu blocker.
	self.menuBlockerClickEvent = function(e) {
		self.close();
	};

	self.menuContentsView.addEventListener('swipe', self.menuSwipeEvent);
	menuBlockerView.addEventListener('swipe', self.menuSwipeEvent);
	menuBlockerView.addEventListener('click', self.menuBlockerClickEvent);

};

// Used to open the menu.
Menu.prototype.open = function(closeCallback) {
	var self = this;
	util.hideKeyboard(self.activeWindow);
	self.activeWindow.add(self.menuContainer);
	self.menuContainer.animate({
		opacity:1,
		duration:util.calcAnimationTime(250)
	}, function () {
		self.menuContentsView.animate({
			left:0,
			duration:util.calcAnimationTime(500)
		});
	});
};

// Used to close the menu.
Menu.prototype.close = function(callback) {
	var self = this;
	self.menuContentsView.animate({
		left:-240,
		duration:util.calcAnimationTime(500)
	}, function () {
		self.menuContainer.animate({
			opacity:0,
			duration:util.calcAnimationTime(250)
		}, function () {
			self.activeWindow.remove(self.menuContainer);
			if (typeof callback === 'function') {
				callback();
			}
		});
	});
};

// Used to populate the menu rows.
Menu.prototype.populate = function(menuItems) {
	var self = this;
	var count = 0;
	var tableRows = [];
	while (menuItems[count]) {
		tableRows[count] = Titanium.UI.createTableViewRow({
			title: menuItems[count].title,
			color:'#000',
		 	height:50,
		 	left:20,
		 	font:{ 
		 		fontSize:18
		 	}
		});
		self.navigationTableSection.add(tableRows[count]);
		count++;
	}
};

module.exports = Menu;

/*
 * EOF
 */