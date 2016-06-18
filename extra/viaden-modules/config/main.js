(function () {

	"use strict";
	/*global */

	var mainCgf = {

		url: {
			gb: {
				default: 'http://gala-bingo/'
			}
		},

		mobileHost: 'http://localhost:8080/wd/hub',

		mail: {
			regCardUser: 'test@playtech.com'
		},

		definedParams: {
			urlPostfix: '',
			browser: 'chrome', // chrome || firefox
			list: false,
			host: '',
			tablet: false,
			log: true
		},

		ua: {
			ios7iPad: 'Mozilla/5.0 (iPad; CPU OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53',
			ios7iPhone: 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X; en-us) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53'
		},

		folder: {
			test: 'test', // folder with tests
			report: '__report__',
			exception: '__exception__'
		}

	};

	module.exports = mainCgf;

}());
