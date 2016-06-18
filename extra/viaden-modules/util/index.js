(function () {

	"use strict";
	/*global */

	var util, fs, webDriver, mainCfg, path, startPath, chrome, log;

	fs = require('fs');

	webDriver = require('selenium-webdriver');

	mainCfg = require('viaden-modules/config/main.js');

	path = require('path');

	startPath = process.cwd();

	chrome = require('selenium-webdriver/chrome');

	log = require('viaden-modules/log').getLog();

	util = {

		keyList: ['isDevice', 'isSendMail'],

		attributes: {

		},

		getRandomDigit: function (max) {
			return Math.floor( Math.random() * (max || 10) );
		},

		getCardNumber: function (numberLength) {

			numberLength = (numberLength || 16) - 1;

			var getRandomDigit = this.getRandomDigit,
				number;

			function getCardNumber() {

				var arr = [4],
					lastNumber,
					originalNumber,
					i;

				// Original Number
				for (i = 0; i < numberLength; i += 1) {
					arr.push( getRandomDigit() );
				}
				originalNumber = arr.join('');

				// Drop the last digit
				lastNumber = arr.pop();

				// Reverse the digits
				//arr.reverse();

				// Multiple odd digits by 2
				arr = arr.map(function (value, index) {
					var newValue = value * 2;
					if (newValue > 9) {
						newValue = newValue % 10 + 1;
					}
					return newValue;
				});


				// Subtract 9 to numbers over 9
				//arr = arr.map(function (value) {
				//	return value > 9 ? value - 9 : value;
				//});

				// Count control number
				var controlSum = 0;
				arr.forEach(function (value) {
					controlSum += value;
				});
				controlSum *= 9;

				controlSum = String(controlSum);

				var controlNumber = 10 - (parseInt( controlSum[controlSum.length - 1] ) || 10);

				return (controlNumber === lastNumber) && originalNumber;

			}

			do {
				number = getCardNumber();
			} while (!number);

			return number;

		},



		getCardNumberOld: function (numberLength) {

			numberLength = (numberLength || 13) - 2;

			var getRandomDigit = this.getRandomDigit,
				number;

			function getCardNumber() {

				var arr = [5, 2],
					lastNumber,
					originalNumber,
					i;

				// Original Number
				for (i = 0; i < numberLength; i += 1) {
					arr.push( getRandomDigit() );
				}
				originalNumber = arr.join('');

				// Drop the last digit
				lastNumber = arr.pop();

				// Reverse the digits
				arr.reverse();

				// Multiple odd digits by 2
				arr = arr.map(function (value, index) {
					return index % 2 ? value : value * 2;
				});

				// Subtract 9 to numbers over 9
				arr = arr.map(function (value) {
					return value > 9 ? value - 9 : value;
				});

				// Count control number
				var controlSum = 0;
				arr.forEach(function (value) {
					controlSum += value;
				});
				var controlNumber = controlSum % 10;

				return controlNumber === lastNumber && originalNumber;

			}

			do {
				number = getCardNumber();
			} while (!number);

			return number;

		},

		trueFn: function () {
			return true;
		},

		falseFn: function () {
			return false;
		},

		clickTrueFn: function (elem) {
			elem.click();
			return true;
		},

		clickFalseFn: function (elem) {
			elem.click();
			return false;
		},

		get: function (key) {
			return this.attributes[key];
		},

		set: function (key, value) {
			return this.attributes[key] = value;
		},

		createWebDriverClient: function() {

			var opts,
				args = this.get('args'),
				driver,
				ua;

			if (args.browser === 'chrome' && args.ua) {

				//if (args.ua) {
				opts = new chrome.Options();
				ua = mainCfg.ua[args.ua];
				if (ua) {
					opts.addArguments(['user-agent="' + ua + '"']); // args.ua // mainCfg.ua.ios7iPad : mainCfg.ua.ios7iPhone
				} else {
					log('%c red', 'No such ua ' + args.ua);
				}

				driver = new webDriver
					.Builder()
					.usingServer(args.host)
					.withCapabilities(opts.toCapabilities())
					.build();

			} else {

				driver = new webDriver
					.Builder()
					.usingServer(args.host)
					.withCapabilities({
						browserName: args.browser
					})
					.build();
			}

			driver.manage().timeouts().implicitlyWait(150);

			switch (args.size) {

				case 'mobile':

					// set mobile size
					break;

				case 'tablet':

					// set tablet size
					break;

			}

			driver.manage().window().setSize(800, 1024);

			if (!args.host) {
				//driver.manage().window().setSize(600, 1000);
			}

			return driver;

		},
		getTest: function (list) {

			if (list) {
				if (list.indexOf(',') !== -1) {
					return list.replace(/\s+/, '').replace(/,/g, '.js,').split(',');

				} else {
					return [ list.trim() + '.js' ];
				}
			}

			return fs.readdirSync( path.resolve(startPath, mainCfg.folder.test) );

		},
		getStartPath: function () {
			return startPath;
		},

		scrollTo: function(driver, selector) {
			return driver.executeScript("document.querySelector('" + selector + "').scrollIntoView(true); window.scrollBy(0, 200);").then(function () {
				return driver.sleep(500);
			});
		},

		argsInit: function () {

			var reIsBool = /^(true|false)$/,
				reIsNumber = /^((\d+(\.\d+)?)|(\.\d+))$/, // 1.2 || .3
				data = {},
				definedParams = mainCfg.definedParams,
				key;

			process.argv.forEach(function (val) {

				var arr, key, value;

				arr = val.split('=');
				key = arr.shift();
				value = arr.join('=');

				if ( key[0] === '-' ) {
					key = key.substr(1);
					data[key] = false;
					return;
				}

				if ( key[0] === '+' ) {
					key = key.substr(1);
					data[key] = true;
					return;
				}

				if ( reIsBool.test(value) ) {
					data[key] = 'true' === value;
					return;
				}

				if ( reIsNumber.test(value) ) {
					data[key] = parseFloat(value);
					return;
				}

				data[key] = value;

			}, this);

			if (data.host === true) { // detect extra string
				data.host = mainCfg.mobileHost;
			}

			for (key in definedParams) {
				if (definedParams.hasOwnProperty(key) && !data.hasOwnProperty(key)) {
					data[key] = definedParams[key];
				}
			}

			this.set('args', data);

			return data;

		},

		isPlainObject: function (obj) {
			return obj && obj.constructor === Object;
		},

		toArray: function (args) {
			return Array.prototype.slice.call(args);
		},

		extend: function () { // args1, args2, args3, args4 .....

			var mixin = {};

			this.toArray(arguments).forEach(function (obj) {
				var key, tweek;
				for (key in obj) {
					if (obj.hasOwnProperty(key)) {
						tweek = obj[key];
						mixin[key] = this.isPlainObject(tweek) ? this.extend(mixin[key], tweek) : tweek;
					}
				}
			}, this);

			return mixin;

		}

	};

	util.argsInit();

	module.exports = util;

}());
