/*
 * list.js
 * List view file-- used to view/edit a todo list.
 */

function ListView() {

	console.log('Creating new ListView().');

	var $ = {};

	$.window = Ti.UI.createWindow({
		title: 'List',
		top: util.isIos7OrGreater() ? 20 : 0,
		bottom: 0,
		orientationModes: [
			Ti.UI.PORTRAIT
		]
	});

	$.addNewToDoButton = Ti.UI.createImageView({
		height: 34,
		width: 34,
		right: 9,
		center: 0,
		backgroundImage: '/images/plusButton.png'
	});

	$.navBar = app.loadComponent('navBar', {
		barAction: 'close',
		rightView: $.addNewToDoButton
	});

	$.tableOfToDos = Ti.UI.createTableView({
		top: 50,
		bottom: 0,
		left: 0,
		right: 0,
		height: Ti.UI.FILL,
		width: Ti.UI.FILL
	});

	$.navBar.addToView($.window, 'List');
	$.window.add($.tableOfToDos);

	/*
	 * View Functions.
	 */

	$.generateToDoRow = function (title) {

		var toDoRow = Ti.UI.createTableViewRow({
			title: title,
			height: 50,
			width: '100%'
		});

		var toggleSwitch = Ti.UI.createSwitch({
			right: 15,
			style: Ti.UI.Android.SWITCH_STYLE_CHECKBOX
		});

		toDoRow.add(toggleSwitch);

		toDoRow.toggleSwitch = toggleSwitch;

		return toDoRow;
	};

	return $;

}

module.exports = ListView;

/*
 * EOF
 */