
function OpenCamera(allJobs) {
	//var currentControlNumber = controlNumber;
	//var win = theWindow;
	var allJobsToEmail = allJobs;

	Ti.API.info('allJobsToEmail.length ' + allJobsToEmail.length)

	Titanium.Media.showCamera({

		success : function(event) {
			var i = 0, theLength = allJobsToEmail.length;
			for(i; i < theLength; i++) {
				allJobsToEmail[i];
				Ti.API.info(allJobsToEmail[i]);

				var emailDialog = Titanium.UI.createEmailDialog();
				//var file = pictureArray;

				//var i = 0;
				//Ti.API.info('@@@ Debug @@@ file for email' + file);
				//Ti.API.info('@@@ Debug @@@ file.length for email' + file.length);
				//Ti.API.info('@@@ Debug @@@ file[0].pic for email' + file[0].pic);
				if(!emailDialog.isSupported()) {
					Ti.UI.createAlertDialog({
						title : 'Error',
						message : 'Email not available'
					}).show();
					return;
				}
				emailDialog.setSubject(allJobsToEmail[i]);
				emailDialog.setToRecipients(['w.photo@agentgrid.net']);
				emailDialog.setCcRecipients(['danp@agentgrid.net']);
				//emailDialog.setBccRecipients(['perussin@gmail.com']);

				if(Ti.Platform.name == 'iPhone OS') {
					//emailDialog.setMessageBody('<b>Appcelerator Titanium Rocks!</b>å');
					emailDialog.setHtml(true);
					emailDialog.setBarColor('#336699');
				} else {
					emailDialog.setMessageBody('Picture of Freight');
				}

				// attach a blob
				emailDialog.addAttachment(event.media);

				// attach a file
				//var f = Ti.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'cricket.wav');
				//for(i; i < file.length; i++) {
				//	emailDialog.addAttachment(file[i].pic);
				//}

				emailDialog.addEventListener('complete', function(e) {
					if(e.result == emailDialog.SENT) {
						if(Ti.Platform.osname != 'android') {
							// android doesn't give us useful result codes.
							// it anyway shows a toast.
							alert("message was sent");
						}
					} else {
						alert("message was not sent. result = " + e.result);
					}
				});
				emailDialog.open();
			}
		},
		cancel : function() {
			//imagePath = false;
		},
		error : function(error) {
			// create alert

			// set message
			if(error.code == Titanium.Media.NO_CAMERA) {
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

module.exports = OpenCamera;