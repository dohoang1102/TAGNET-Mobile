TAGNET Mobile 1.x
==========

This app has been developed for T.A.G. (Transportation Agent Grid, LP), as a communications mechanism between our 
brokerage, and our IC Drivers (IDPs). T.A.G. dispatches available work to our IDPs, 
they recieve the work via this app. Our IDPs enter POP, and POD info directly in to 
the app. Paperwork normally carried by the IDP is no longer required, as the app itself
is able to replicate and maintain the paperwork electronically.

This app is for internal T.A.G., and IC's T.A.G. only.

Modules used:
* ti.paint (http://www.apache.org/licenses/LICENSE-2.0)
https://marketplace.appcelerator.com/apps/807?1911931423
* uk.me.thepotters.atf.sys (http://www.apache.org/licenses/LICENSE-2.0)
https://marketplace.appcelerator.com/apps/2184?688253914


Release Notes : 
==========

1.081312rc
==========

* Open jobs now vertically stacks Pickup and Delivery, the current step always comes first.
* Pickup and Delivery depart time removed, unless specified needed per company / customer number
* Inbox - Estimated times default to Pickup and Delivery estimated times, respectively
* Added functionality to delete a job from the device, under the open jobs screen, at the very bottom
* Power consumption optimization
* Art work
* Fixed a bug where "Login" button would not appear on certain screen resolutions
* Enabled "Messages", which confirm if the driver is "on time" to their estimated times
* General fixed and optimizations

1.081012rc
==========
* Fixed the C# timestamp for JS Parsing
* Added dialog to confirm a decline
* Resized Accept and Decline Buttons
* Added Button to attache a document
* Renamed Take Photo, to Damage Photo
* Added prototype for Auction

1.702412rc
===========
* PU DL Phone added
* Phone URI Intent added
* Address URL Intent Added

1.072012rc:
===========
* Added Brand Name of order to the top of both inbox, and open jobs screens.
* Fixed a very minor bug related to the POD service.


1.071612rc:
===========
* Synchronization firing:
* I have changed the procedure in which POD's are fired from the mobile to the server. After the IDP has the customer fill out the tablet, and hits "Save and enter (POD or POP)", we now trigger the download and upload service to fire immediately. If for some reason there is no data available, the update will stay in queue and will try again at the next synchronization interval (ever 180 seconds).
* When a download event or upload event is successful, the app will show a brief, non-intrusive confirmation across the bottom 10% of the screen, stating "Download Sync Complete" for downloading data to the mobile app, and "Upload Sync Complete" when POD or POP is successfully uploaded.
* The "Sync Now" button, at the bottom of the home screen, will show a non-intrusive notification across the bottom of the screen describing 1 of 3 events: 1. Sync Start 2. Download Complete 3. Upload Complete (Upload will only show if there was a POD or POP to upload).
* GPS
* I have enabled the GPS mechanism to behave more aggressively.
* User Interface
* On home screen there is a message in bold red writing: "PLEASE KEEP MOBILE DEVICE PLUGGED IN TO CHARGER WHILE IN VEHICLE".
* While entering the POD / POP, the full name field, is not highlighted red with an asterisk to indicate it is required.
* In the case a POD requires a CSR form the free text field now has a default value of NONE.

* Please note: The IDP must charge the tablet or mobile device while in their vehicle.


1.061212rc:
===========
* Auto update service added. This will check our server at runtime for a new version, and give the user an oppertunity to update their app.
* sqlite optimization, utilizing transactional model for saving data.

TAGNET Mobile The Definitive Guide
==================================
* https://github.com/dperussina/TAGNET-Mobile-Release-Canidate/wiki/TAGNET-Mobile-The-Definitive-Guide

----------------------------------
Stuff our legal folk make us say:

Appcelerator, Appcelerator Titanium and associated marks and logos are 
trademarks of Appcelerator, Inc. 

Titanium is Copyright (c) 2008-2012 by Appcelerator, Inc. All Rights Reserved.

Titanium is licensed under the Apache Public License (Version 2). Please
see the LICENSE file for the full license.


