(function () {

	"use strict";
	/*global */

	var	util = require('viaden-modules/util'),
		deps = {
			selector: require('viaden-modules/config/css-selector' + (util.get('args').tablet ? '-tablet' : '')),
			util: util,
			trueFn: util.trueFn,
			falseFn: util.falseFn,
			clickTrueFn: util.clickTrueFn,
			clickFalseFn: util.clickFalseFn,
			exception: require('viaden-modules/exception'),
			mainCfg: require('viaden-modules/config/main.js'),
			path: require('path'),
			log: require('viaden-modules/log').getLog()
		};

	function TestParent () {

		this.init();

		return this;

	}

	module.exports = TestParent;

	TestParent.prototype = {

		init: function () {

			this.endTimeout = 1000;

			this.mode = 'test';

			this.dep = {};

			this.extend('dep', deps);

		},

		run: function () {

			this.startPart();

			this.body();

			return this.endPart();

		},

		startPart: function () {

			var mode = this.mode,
				info = this.info,
				args = this.args,
				reportItem = args.reportItem,
				driver = args.driver,
				dep = this.dep,
				exception = dep.exception,
				util = dep.util,
				reporter = args.reporter;

			driver.sleep(100).then(function () {
				deps.log('%c green', '-----------');
				deps.log('%c green', 'Test "' + info.name + '" run as ' + mode.toUpperCase() );
			})

			if (this.mode === 'test') {

				reportItem.markStartTime();
				reportItem.addText(this.info.name);

				driver.get(args.url).then(function () {


					exception.empty();

					exception.extend({
						url: args.url,
						args: util.get('args'),
						driver: driver,
						reporter: reporter
					});


				});

				return;

			}

			reportItem.disable();

		},

		endPart: function () {

			return this.args.driver.sleep(this.endTimeout).then((function () {
				this.args.reportItem.enable();
				deps.log('%c green', 'Test "' + this.info.name + '" stop as ' + this.mode.toUpperCase() );
				deps.log('%c green', '-----------');
			}.bind(this)));

		},

		extend: function (testKey, data) {

			var key;

			if (typeof testKey === 'string') {

				this[testKey] = this[testKey] || {};

				for (key in data) {
					if (data.hasOwnProperty(key)) {
						this[testKey][key] = data[key];
					}
				}

				return this;

			}

			data = testKey;

			for (key in data) {
				if (data.hasOwnProperty(key)) {
					this[key] = data[key];
				}
			}

			return this;

		}

	}

}());