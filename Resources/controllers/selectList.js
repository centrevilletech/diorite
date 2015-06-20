/*
 * selectList.js
 * Select list controller.
 */

var view, lists;

function SelectListCtrl() {
	view = app.loadView('selectList');
	lists = app.loadModel('lists');
	this.view = view;
	this.init();
}

// Controller initiation point.
SelectListCtrl.prototype.init = function() {

	var self = this;
	self.closeEvent = function () {};

	self.addListItemClickEvent = function(e) {
		textEntryDialog = app.loadComponent('textEntryDialog', {
			parentView: view.window,
			closeButtonText: 'Done',
			hintText: 'Enter list title.'
		});
		textEntryDialog.open(function (newListTitle) {
			if (newListTitle === '') {
				return;
			}
			// Add a new list based on the list title entered.
			var newList = lists.createList(newListTitle);
			lists.addList(newList);
			self.populate();
			// Scroll the table to the bottom.
			setTimeout(function() {
				view.tableOfLists.scrollToIndex(view.tableOfLists.tableData.length-1, {
					animated: Titanium.UI.ANIMATION_CURVE_EASE_OUT,
					position: Titanium.UI.iPhone.TableViewScrollPosition.TOP
				});
			}, 0);
		});
	};

	view.addNewListButton.addEventListener('click', self.addListItemClickEvent);

};

// Used to show the corresponding view.
SelectListCtrl.prototype.open = function(callback) {
	if (typeof callback !== 'function') {
		var callback = function () {};
	}
	this.populate();
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
SelectListCtrl.prototype.close = function(callback) {
	if (typeof callback !== 'function') {
		var callback = function () {};
	}
	if (util.isIos()) {
		view.window.animate({
			opacity: 0,
			duration: 500
		}, function () {
			view.window.close();
		});
	} else {
		view.window.close();
	}
};

// Used to populate the view.
SelectListCtrl.prototype.populate = function() {

	var self = this;

	// Handle clicking of a table row.
	self.tableRowClickEvent = function(e) {
		selectedList = e.row.list;
		listCtrl = app.loadController('list');
		listCtrl.populate(selectedList.id);
		listCtrl.open();
		listCtrl.closeEvent = function () {
			this.populate();
		};
	};

	// Loop through and build the table.
	var currentLists = lists.get();
	var tableRows = [];
	var count = 0;
	while (currentLists[count]) {
		tableRows[count] = view.generateListRow(currentLists[count].title);
		tableRows[count].list = currentLists[count];
		tableRows[count].addEventListener('click', self.tableRowClickEvent);
		count++;
	}

	view.tableOfLists.tableData = tableRows;
	return view.tableOfLists.setData(tableRows);

};

module.exports = SelectListCtrl;