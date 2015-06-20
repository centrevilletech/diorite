/*
 * FourButtonPicker.js
 * Component used to hold four buttons.
 */

function FourButtonPicker(params) {
	var self = this;
	self.init(params);
}

FourButtonPicker.prototype.init = function(params) {

	var self = this;

	// Handle empty params.
	if (params === {} || typeof params.parentView === 'undefined') {
		return console.log('Four button picker failed to init! No parentView passed.');
	}
	parentView = params.parentView;

	// Build the UI for the picker.
	var pickerShell = Ti.UI.createScrollView({
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
		height:120,
		zIndex:51,
		bottom:-273,
		backgroundColor:_.blue
	});

	var btnOne = Ti.UI.createButton({
		height:60,
		top:0,
		left:0,
		title: 'Button One',
		width: '50%',
		color: 'white',
		backgroundColor:_.green
	});

	var btnTwo = Ti.UI.createButton({
		height:60,
		top:0,
		right:0,
		title: 'Button Two',
		width: '50%',
		color: 'white',
		backgroundColor:_.green
	});

	var btnThree = Ti.UI.createButton({
		height:60,
		bottom:0,
		left:0,
		title: 'Button Three',
		width: '50%',
		color: 'white',
		backgroundColor:_.green
	});

	var btnFour = Ti.UI.createButton({
		height:60,
		bottom:0,
		right:0,
		title: 'Button Four',
		width: '50%',
		color: 'white',
		backgroundColor:_.green
	});

	// Add everything to the shell.
	pickerShell.add(pickerBlocker);
	pickerShell.add(pickerView);
	pickerView.add(btnOne);
	pickerView.add(btnTwo);
	pickerView.add(btnThree);
	pickerView.add(btnFour);

	// Create reference point to objects for use in the other methods.
	self.parentView = parentView;
	self.pickerShell = pickerShell;
	self.pickerBlocker = pickerBlocker;
	self.pickerView = pickerView;
	self.btnOne = btnOne;
	self.btnTwo = btnTwo;
	self.btnThree = btnThree;
	self.btnFour = btnFour;

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
	// closeBtn.addEventListener('click', self.closeBtnClickEvent);

};

// Used to show the time picker.
FourButtonPicker.prototype.open = function(callback) {
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
			duration:375
		});
	});
};

// Used to hide the time picker.
FourButtonPicker.prototype.close = function(callback) {
	var self = this;
	if (typeof callback !== 'function') {
		var callback = function () {};
	}
	util.hideKeyboard(self.parentView);
	self.callback();
	self.pickerView.animate({
		bottom:-(self.pickerView.height + 8),
		duration:375
	}, function () {
		self.pickerBlocker.animate({
			opacity:0,
			duration:200
		}, function () {
			self.parentView.remove(self.pickerShell);
			callback();
		});
	});
	return;
};

module.exports = FourButtonPicker;

/*
 * EOF
 */