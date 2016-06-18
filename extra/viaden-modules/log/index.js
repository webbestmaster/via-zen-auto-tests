(function () {

	"use strict";
	/*global module */
	/*global */

	/*
	* How to use
	*
	* log('%c red', 'some text')
	*
	* >some text // with red color
	*
	* */

	var log;

	log = {
		attributes: {
			isEnabled: true,
			isInited: false
		},
		reColor: /^%c\s(\w+)/i,
		color: {},
		init: function () {

			if (this.get('isInited')) {
				return;
			}

			var colors = require('util').inspect.colors,
				key;
			for (key in colors) {
				if (colors.hasOwnProperty(key)) {
					this.color[key] = colors[key][0];
				}
			}

			this.set('isInited', true);

		},
		replacer: function (value) {

			var reColor = this.reColor,
				color = this.color;

			if (reColor.test(value)) {
				value = value.replace(reColor, function (match, p1) {
					return ['\x1b[', color[p1], 'm'].join('');
				});
			}
			return value;
		},

		get: function (value) {
			return this.attributes[value];
		},

		set: function (key, value) {
			return this.attributes[key] = value;
		},

		log: function () {

			if (!this.get('isEnabled')) {
				return;
			}

			var args = Array.prototype.slice.call(arguments).map(this.replacer.bind(this));
			args.unshift(new Date().toString());
			args.push('\x1b[0m');
			return console.log.apply(console, args);

		},
		turn: function (isNeeded) {

			if (!!isNeeded === this.get('isEnabled')) {
				return;
			}

			if (isNeeded) {
				this.log('%c green', 'LOG is turn ON');
			} else {
				this.log('%c red', 'LOG is turn OFF');
			}

			this.set('isEnabled', isNeeded);

		},
		getLog: function () {
			return this.log.bind(this);
		}

	}

	log.init();

	module.exports = log;

}());