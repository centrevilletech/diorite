/*
 * selectList.js
 * Select list view file.
 */

function SelectListView() {

	console.log('Creating new SelectListView().');

	var $ = {};

	$.window = Ti.UI.createWindow({
		title: 'Select List',
		top: util.isIos7OrGreater() ? 20 : 0,
		bottom: 0,
		orientationModes: [
			Ti.UI.PORTRAIT
		]
	});

	$.addNewListButton = Ti.UI.createImageView({
		height: 34,
		width: 34,
		right: 9,
		center: 0,
		backgroundImage: '/images/plusButton.png'
	});

	$.navBar = app.loadComponent('navBar', {
		barAction: 'menu',
		rightView: $.addNewListButton
	});

	$.tableOfLists = Ti.UI.createTableView({
		top: 50,
		bottom: 0,
		left: 0,
		right: 0,
		height: Ti.UI.FILL,
		width: Ti.UI.FILL
	});

	$.navBar.addToView($.window, 'Select List');
	$.window.add($.tableOfLists);

	/*
	 * View Functions.
	 */

	$.generateListRow = function (title) {
		var listRow = Ti.UI.createTableViewRow({
			title: title,
			height: 50
		});
		return listRow;
	};

	return $;

}

module.exports = SelectListView;

/*
 * EOF
 */