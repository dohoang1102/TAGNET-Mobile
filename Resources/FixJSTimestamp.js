function FixJSTimestamp(t) {
	if(t === null) {
		return null;
	}
	Ti.API.info('@@@ TIMESTAMP DEBUG @@@ t : ' + t);
	var _t = t, that = this;
	Ti.API.info('@@@ TIMESTAMP DEBUG @@@ _t : ' + _t);
	function fixTime(d) {
		if(d < 10) {
			d = "0" + d;
		}
		return d;
	}


	this.hour = fixTime(_t.getHours());
	this.minute = fixTime(_t.getMinutes());
	this.second = fixTime(_t.getSeconds());
	this.month = fixTime(_t.getMonth() + 1);
	this.day = fixTime(_t.getDate());
	this.year = _t.getFullYear();
	this.timestamp = this.month + "/" + this.day + "/" + this.year + " " + this.hour + ":" + this.minute + ":" + this.second;
	this.time = this.hour + ":" + this.minute + ":" + this.second;
	this.date = this.month + "/" + this.day + "/" + this.year;
	return this;
}
module.exports = FixJSTimestamp;