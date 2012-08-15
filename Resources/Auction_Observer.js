(function AuctionObserver() {

	var db = Titanium.Database.open('mobile');
	var checkForAuction, cache = [];
	checkForAuction = db.execute('select * auctions;');
	if (checkForAuction.rowCount > 0) {
		var toast = Ti.UI.createNotification({
			message : "TAGNET : New auction available. Place your bid!",
			duration : Ti.UI.NOTIFICATION_DURATION_SHORT
		});
		toast.show();
	}
})();
