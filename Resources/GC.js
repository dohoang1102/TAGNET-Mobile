var GC = function cleanWindow(winObj) {
	try {

		if (winObj.children) {
			Ti.API.info('Has children! Len: ' + winObj.children.length);
			for (var i = winObj.children.length; i > 0; i--) {
				Ti.API.info((i - 1) + ") " + winObj.children[i - 1]);
				cleanWindow(winObj.children[i - 1]);
				winObj.remove(winObj.children[i - 1]);
				nullThis(winObj.children[i - 1]);

			}
		}
	} catch(err) {
		return;
	}
	function nullThis(obj) {
		obj = null;
		return;
	}

	return;
}

module.exports = GC;
