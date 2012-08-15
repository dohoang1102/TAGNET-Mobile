function ErrorHandler(data) {
	//var loadopenWindow.GLOBALS = require('openWindow.GLOBALS');
	//var openWindow.GLOBALS = new loadopenWindow.GLOBALS();
	var sql = Titanium.Database.open('mobile'), _data = data;
	Ti.API.info('@@@ Error Handler @@@ FIRED : ' + Ti.App.username + ', ' + new Date() + ', ' + _data.err + ', ' + _data.location);
	sql.execute('insert into errorLog(user, time, error, location) values (?,?,?,?)', Ti.App.username, new Date(), _data.err, _data.location);
	sql.close();
}

module.exports = ErrorHandler; 