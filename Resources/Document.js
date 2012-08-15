function Document(details) {
	
	var docDetails = details;
	function guidGenerator() {
		var S4 = function() {
			return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
		};
		return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
	}

	function confirm(data) {
		var myData = data;
		var opts = {
			cancel : 1,
			options : ['Submit Document', 'Help', 'Cancel'],
			selectedIndex : 0,
			destructive : 1,
			title : 'Submit for approval'
		};
		var dialog = Ti.UI.createOptionDialog(opts);
		dialog.show();
		dialog.addEventListener('click', function(e){
			var n = e.index;
			switch(n){
				case 0:
				save();
				break;
				case 1:
				//help();
				break;
				case 2:
				cancel();
				break;
			}		});
		function cancel() {
			myData = null;
			data = null;
			var toast = Ti.UI.createNotification({
				message : "TAGNET : Document Canceled",
				duration : Ti.UI.NOTIFICATION_DURATION_SHORT
			});
			toast.show();
		}

		function save() {

			var base64 = Ti.Utils.base64encode(myData);
			base64 = base64.toString();
			base64 = base64.replace(/\s/g, '');
			base64 = base64.replace(/(\r\n|\n|\r)/gm, "");
			function network(base64) {
				var toast = Ti.UI.createNotification({
					message : "TAGNET : Connecting to document server.",
					duration : Ti.UI.NOTIFICATION_DURATION_SHORT
				});
				toast.show();
				//Ti.API.warn('base64 string : '+base64);
				var toast = Ti.UI.createNotification({
					message : "File Length : " + base64.length,
					duration : Ti.UI.NOTIFICATION_DURATION_SHORT
				});
				toast.show();
				//Ti.API.warn('base64 decoded string : '+Ti.Utils.base64decode(base64));
				var xhr = Ti.Network.createHTTPClient();
				xhr.setTimeout(60000);

				xhr.onload = function(e) {
					var toast = Ti.UI.createNotification({
						message : "TAGNET : Document successfully submit, and is now in queue for processing.",
						duration : Ti.UI.NOTIFICATION_DURATION_SHORT
					});
					toast.show();
					myData = null;
					data = null;
					return;

				};
				xhr.onerror = function(e) {
					var toast = Ti.UI.createNotification({
						message : "TAGNET : Document network error : " + e.error + '. Please try again.',
						duration : Ti.UI.NOTIFICATION_DURATION_SHORT
					});
					toast.show();
					myData = null;
					data = null;
					return;
				};
				Ti.API.info('@@@ XHR DEBUG @@@ json TO loginToServer : ' + JSON.stringify(base64));
				xhr.open("POST", "http://69.170.41.73:4000/postDocumentData");
				xhr.setRequestHeader("enctype", "multipart/form-data;");
				xhr.setRequestHeader('companynumber', docDetails.CompanyNumber);
				xhr.setRequestHeader('controlnumber', docDetails.ControlNumber);
				xhr.setRequestHeader('username', docDetails.username);
				xhr.setRequestHeader('doctype', docDetails.doctype);
				xhr.setRequestHeader('docid', guidGenerator());
				//xhr.setRequestHeader('docdata', base64);
				xhr.send(base64);

			}


			

			network(base64);
		}



	}


	Titanium.Media.showCamera({

		success : function(event) {

			// attach a blob
			confirm(event.media);

		},
		cancel : function() {
			//imagePath = false;
		},
		error : function(error) {
			// create alert

			// set message
			if (error.code == Titanium.Media.NO_CAMERA) {
				Ti.API.info('Device does not have camera capabilities, or access.');
			} else {
				Ti.API.info('Unexpected error: ' + error.code);
			}

			// show alert
			//imagePath = false;
		},
		allowEditing : true
	});
}

module.exports = Document;
