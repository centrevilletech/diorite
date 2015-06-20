/*
 * timePicker.js
 * Component used to pick a time.
 */

function timePicker(parentView) {
	var self = this;
	if (typeof parentView !== 'undefined') {
		self.init(parentView);
	}
}

timePicker.prototype.init = function(parentView) {

	var self = this;
	self.returnValue = new Date();

	// Build the UI for the picker.
	var pickerShell = Ti.UI.createView({
		top:0,
		bottom:0,
		left:0,
		right:0,
		width:'100%',
		height:'100%',
		zIndex:100
	});

	var pickerBlocker = Ti.UI.createView({
		width:'100%',
		height:'100%',
		opacity:0,
		zIndex:50,
		backgroundColor:'#000'
	});

	var pickerView = Ti.UI.createView({
		width:'100%',
		height:265,
		zIndex:51,
		bottom:-273,
		backgroundColor:_.blue
	});

	var timePick = Ti.UI.createPicker({
		type: Ti.UI.PICKER_TYPE_TIME,
		bottom: 55,
	});

	var closeBtn = Ti.UI.createButton({
		height:55,
		bottom:0,
		title:L('Close', 'Close'),
		width:'100%',
		color: 'white',
		backgroundColor:_.green
	});

	// Add everything to the shell.
	pickerShell.add(pickerBlocker);
	pickerShell.add(pickerView);
	pickerView.add(timePick);
	pickerView.add(closeBtn);

	// Create reference point to objects for use in the other methods.
	self.parentView = parentView;
	self.pickerShell = pickerShell;
	self.pickerBlocker = pickerBlocker;
	self.pickerView = pickerView;
	self.timePick = timePick;

	// Define the events.

	// Used to handle clicks of the blocker.
	self.blockerClickEvent = function () {
		self.close();
	};

	// Used to handle clicks of the blocker.
	self.closeBtnClickEvent = function () {
		self.close();
	};

	// Register the events.
	pickerBlocker.addEventListener('click', self.blockerClickEvent);
	closeBtn.addEventListener('click', self.closeBtnClickEvent);

};

// Used to show the time picker.
timePicker.prototype.open = function(callback) {
	var self = this;
	if (typeof callback === 'function') {
		self.callback = callback;
	} else {
		self.callback = function () {};
	}
	self.parentView.add(self.pickerShell);
	self.pickerBlocker.animate({
		opacity:0.4,
		duration:200
	}, function () {
		self.pickerView.animate({
			bottom:0,
			duration:500
		});
	});
};

// Used to hide the time picker.
timePicker.prototype.close = function() {
	var self = this;
	self.callback(self.timePick.value);
	self.pickerView.animate({
		bottom:-(self.pickerView.height + 8),
		duration:500
	}, function () {
		self.pickerBlocker.animate({
			opacity:0,
			duration:200
		}, function () {
			self.parentView.remove(self.pickerShell);
		});
	});
	return;
};

// Used to set the value of the time picker based on a date object.
timePicker.prototype.setValue = function(dateObj) {
	var self = this;
	return self.timePick.setValue(dateObj);
};

module.exports = timePicker;

/*
 * EOF
 */