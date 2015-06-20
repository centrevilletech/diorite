/*
 * activityIndicator.js
 */

// Build the object.
function ActivityIndicator(activeWindow, textVal) {
	var self = this;
	if (typeof activeWindow !== 'undefined' && typeof textVal !== 'undefined') { // Only init if an active view is passed.
		self.activeWindow = activeWindow;
		self.textVal = textVal;
		self.init();
	}
}

// Handles the initing of the activity indicator.
ActivityIndicator.prototype.init = function() {

	var self = this;

	self.actFrame = Ti.UI.createView({
		width: '100%',
		height: '100%',
		zIndex: 99,
		opacity: 0
	});

    // Create the faded backdrop.
    var backDrop = Ti.UI.createView({
      width: '100%',
      height: '100%',
      backgroundColor: '#000000',
      opacity: 0.7,
      zIndex: 40
    });
    self.actFrame.add(backDrop);

    // Create the activity indicator style object.
    var actStyle;
    if (util.isIos()) {
      actStyle = Titanium.UI.iPhone.ActivityIndicatorStyle.BIG;
    } else {
      actStyle = Ti.UI.ActivityIndicatorStyle.DARK;
    }

    self.actInd = Ti.UI.createActivityIndicator({
      color: '#FFF',
      font: {
        fontFamily: 'Helvetica Neue',
        fontSize: 19,
        fontWeight:'bold'
      },
      style: actStyle,
      top: '45%',
      center: 0,
      //height: 60,
      //width: 60,
      message: self.textVal,
      zIndex:41
    });
    self.actFrame.add(self.actInd);

};

// Handles opening the activity indicator.
ActivityIndicator.prototype.open = function(callback) {
	var self = this;
	var window = self.activeWindow;
	if (typeof callback !== 'function') {
		var callback = function () {};
	}
	window.add(self.actFrame);
	self.actInd.show();
	self.actFrame.animate({
		opacity:1,
		duration:250
	}, callback);
};

// Handles closing the activity indicator.
ActivityIndicator.prototype.close = function(callback) {
	var self = this;
	var window = self.activeWindow;
	if (typeof callback !== 'function') {
		var callback = function () {};
	}
	self.actFrame.animate({
		opacity:0,
		duration:250
	}, function () {
		self.actInd.hide();
		window.remove(self.actFrame);
		callback();
	});
};

module.exports = ActivityIndicator;

 /*
  * EOF
  */