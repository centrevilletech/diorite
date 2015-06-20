/*
 * List.js
 * List view controller.
 */

var view, lists;

function ListCtrl() {
	view = app.loadView('list');
	lists = app.loadModel('lists');
	this.view = view;
	this.init();
}

// Controller initiation point.
ListCtrl.prototype.init = function() {

	var self = this;
	self.closeEvent = function () {};

	self.addListItemClickEvent = function(e) {
		textEntryDialog = app.loadComponent('textEntryDialog', {
			parentView: view.window,
			closeButtonText: 'Done',
			hintText: 'Enter list item.'
		});
		textEntryDialog.open(function (newToDoText) {
			if (newToDoText === '') {
				return;
			}
			// Add a new list item based on the text returned.
			var newListItem = lists.createListItem(newToDoText);
			lists.addItemToList(newListItem, self.listId);
			self.populate(self.listId);
			self.scrollViewToBottom();
		});
	};

	view.addNewToDoButton.addEventListener('click', self.addListItemClickEvent);

};

// Used to show the corresponding view.
ListCtrl.prototype.open = function(callback) {
	if (typeof callback !== 'function') {
		var callback = function () {};
	}
	if (util.isIos()) {
		view.window.opacity = 0;
		view.window.open();
		view.window.animate({
			opacity: 1,
			duration: 500
		}, function () {
			callback();
		});
	} else {
		view.window.open();
		callback();
	}
};

// Used to close the corresponding view.
ListCtrl.prototype.close = function(callback) {
	if (typeof callback !== 'function') {
		var callback = function () {};
	}
	if (util.isIos()) {
		view.window.animate({
			opacity: 0,
			duration: 500
		}, function () {
			view.window.close();
			self.closeEvent();
		});
	} else {
		view.window.close();
		self.closeEvent();
	}
};

// Used to scroll the corresponding view table to the bottom.
ListCtrl.prototype.scrollViewToBottom = function () {
	setTimeout(function() {
		view.tableOfToDos.scrollToIndex(view.tableOfToDos.tableData.length-1, {
			animated: Titanium.UI.ANIMATION_CURVE_EASE_OUT,
			position: Titanium.UI.iPhone.TableViewScrollPosition.TOP
		});
	}, 0);
};

// Used to populate the view.
ListCtrl.prototype.populate = function(listId) {

	var self = this;

	// Handle clicking of a table row.
	self.tableRowClickEvent = function(e) {

		var selectedListItem = e.row.item;

		var fourButtonPicker = app.loadComponent('fourButtonPicker', {
			parentView: view.window
		});

		// Style the buttons.
		fourButtonPicker.btnOne.title = 'Edit';
		fourButtonPicker.btnTwo.title = 'Delete';
		fourButtonPicker.btnThree.title = 'Share';
		fourButtonPicker.btnFour.title = 'Close';
		fourButtonPicker.btnOne.backgroundColor = _.green;
		fourButtonPicker.btnTwo.backgroundColor = _.red;
		fourButtonPicker.btnThree.backgroundColor = _.dark_pris;
		fourButtonPicker.btnFour.backgroundColor = _.blue;

		// Assign the click events.

		// Handle the EDIT action.
		fourButtonPicker.btnOne.addEventListener('click', function () {
			fourButtonPicker.close(function () {
				textEntryDialog = app.loadComponent('textEntryDialog', {
					parentView: view.window,
					closeButtonText: 'Done',
					hintText: 'Todo list text.',
					textValue: selectedListItem.content
				});
				textEntryDialog.open(function (newTodoContentText) {
					if (newTodoContentText === '') {
						return alert('Cannot save a blank TODO text value.');
					}
					// Update the list item, then repopulate the view.
					selectedListItem.content = newTodoContentText;
					lists.updateListItemById(selectedListItem);
					self.populate(self.listId);
					self.scrollViewToBottom();
				});
			});
		});

		// Handle the DELETE action.
		fourButtonPicker.btnTwo.addEventListener('click', function () {
			lists.deleteListItemById(selectedListItem.id);
			self.populate(self.listId);
			fourButtonPicker.close();
		});

		// Handle the SHARE action.
		fourButtonPicker.btnThree.addEventListener('click', function () {
			fourButtonPicker.close();
		});

		// Handle the CLOSE action.
		fourButtonPicker.btnFour.addEventListener('click', function () {
			fourButtonPicker.close();
		});

		// Open the picker.
		fourButtonPicker.open();

	};

	// Handle switching of a table row switch.
	self.tableRowSwitchChangeEvent = function (e) {
		var selectedListItem = e.source.item;
		selectedListItem.status = e.value;
		lists.updateListItemById(selectedListItem);
	};

	var list = lists.getListBasedOnId(listId);
	self.listId = listId;

	view.navBar.setTitle(list.title);

	var tableRows = [];
	var count = 0;
	while (list.items[count]) {
		console.log(JSON.stringify(list.items[count]))
		tableRows[count] = view.generateToDoRow(list.items[count].content);
		tableRows[count].item = list.items[count];
		tableRows[count].toggleSwitch.item = list.items[count];
		tableRows[count].toggleSwitch.manualChange = true;
		tableRows[count].toggleSwitch.value = list.items[count].status;
		tableRows[count].addEventListener('click', self.tableRowClickEvent);
		tableRows[count].toggleSwitch.addEventListener('change', self.tableRowSwitchChangeEvent);
		count++;
	}

	view.tableOfToDos.tableData = tableRows;
	return view.tableOfToDos.setData(tableRows);

};

module.exports = ListCtrl;