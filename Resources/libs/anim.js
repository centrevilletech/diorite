/*
 * anim.js
 * Pre-defined animations library.
 */

function Anim() {

}

// Used to spin a view 360 degrees.
Anim.prototype.spin360 = function(view, duration, callback) {
	if (typeof view === 'undefined' || typeof duration === 'undefined') {
		return;
	}
	var matrix2d = Ti.UI.create2DMatrix();
	var matrix2dd = Ti.UI.create2DMatrix();
	matrix2d = matrix2d.rotate(180); // in degrees
	matrix2dd = matrix2dd.rotate(360); // in degrees
	var a = Ti.UI.createAnimation({
		transform: matrix2d,
		duration: util.calcAnimationTime((duration/2))
	});
	var b = Ti.UI.createAnimation({
		transform: matrix2dd,
		duration: util.calcAnimationTime((duration/2))
	});
	view.animate(a);
	a.addEventListener('complete', function() {
		view.animate(b);
	});
	b.addEventListener('complete', function() {
		view.transform = Ti.UI.create2DMatrix().rotate(0);
		if (typeof callback === 'function') {
			callback();
		}
	});
};

module.exports = Anim;

/*
 * EOF
 */