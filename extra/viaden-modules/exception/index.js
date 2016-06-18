(function () {

	"use strict";
	/*global */

	var exception, mainCfg, util, path, webDriver, fs, log;

	fs = require('fs');

	path = require('path');

	mainCfg = require('viaden-modules/config/main.js');

	util = require('viaden-modules/util/');

	webDriver = require('selenium-webdriver');

	log = require('viaden-modules/log').getLog();

	exception = {

		path: {
			report: path.resolve(util.getStartPath(), mainCfg.folder.exception)
		},

		namePrefix: 'Exception-',

		attributes: {

		},

		get: function (key) {
			return this.attributes[key];
		},

		set: function (key, value) {
			return this.attributes[key] = value;
		},

		empty: function () {
			this.attributes = {};
		},

		extend: function (data) {

			var key;

			for (key in data) {
				if (data.hasOwnProperty(key)) {
					this.set(key, data[key]);
				}
			}

		},

		startListener: function () {

			if ( !fs.existsSync(this.path.report) ) {
				fs.mkdirSync(this.path.report);
			}

			var that = this;

			webDriver.promise.controlFlow().once('uncaughtException', function (e) {
				log('%c red', e);
				that.save(e);
			});

		},

		save: function (e) {

			var reporter = this.get('reporter'),
				driver = this.get('driver'),
				dirName = this.namePrefix + reporter.date,
				pathToFolder = path.resolve(this.path.report, dirName),
				pathToReport = path.resolve(pathToFolder, 'log' + reporter.date + '.txt'),
				log = this.get('url') + '\n' + JSON.stringify(this.get('args')) + '\n' + JSON.stringify(e);

			log = log.replace(/,/g, ',\n');

			//create folders
			fs.mkdirSync(pathToFolder);

			driver.takeScreenshot().then(function (image, err) {
				fs.writeFile(path.resolve(pathToFolder, 'screenshot.png'), image, 'base64');
			});

			fs.writeFile(pathToReport, log, function(err) {
				if(err) {
					log('%c red', err);
				} else {
					log('%c red', "The EXCEPTION was saved in " + pathToReport);
				}
			});

			reporter.compile();

			driver.quit();


		}

	};

	module.exports = exception;

}());