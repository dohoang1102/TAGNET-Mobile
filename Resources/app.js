// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');


function Start() {
	var initDb, checkForNewVersion, DashBoard, dash, getService, service;

	initDb = require('InitDb');
	initDb();

	checkForNewVersion = require('autoupdate');
	getService = require('StartService');
	service = getService();
	DashBoard = require('DashBoard');
	dash = DashBoard();
	return;
};
Start();
