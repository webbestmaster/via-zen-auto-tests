(function () {

	"use strict";
	/*global require, module */

	var TestParent = require('viaden-modules/test-parent'),
		util = require('viaden-modules/util'),
		args = util.get('args');

	function Test() {

		this.cfg = {
			selector: {
				innerFooterLinks: ['/', '/gaming/all', '/promotions', /*'/info/rewards',*/ '/clubs', '/payment/deposit', '/transaction', /*'/info/bonusandpoints', '/info/rewards' ,*/ '/payment/withdraw', '/account/responsible', '/account/settings', '/'],
				dataWrapper: '.app.active'
			}
		};

		if (args.tablet) {
			this.cfg = util.extend(this.cfg, {
				selector: {
					innerFooterLinks: ['/payment/deposit', '/transaction', '/payment/withdraw', '/account/responsible', '/account/settings', '/payment/deposit'],
					dataWrapper: '.account-page'
				},
				tablet: true
			});
		}

		this.info = {
			name: 'footer links test and all game test',
			description: 'test registration for user register',
			steps: [
				'load page',
				'go to registration',
				'fill out all fields',
				'submit form',
				'accept terms and condition'
			],
			expectedResult: 'All point in check list must be passed'
		};

		this.args = {};

		this.body = function () {

			var dep = this.dep,
				log = dep.log,
				selector = dep.selector,
				args = this.args,
				util = dep.util,
				startedArgs = util.get('args'),
				cfg = this.cfg,
				driver = args.driver,
				reportItem = args.reportItem,
				trueFn = dep.trueFn,
				falseFn = dep.falseFn,
				isFailed = false;

			// login
			var loginStep = require(dep.path.resolve(dep.util.getStartPath(), dep.mainCfg.folder.test, 'login.js'));
			loginStep = new loginStep();
			loginStep.extend('args', args);
			loginStep.mode = 'step';
			loginStep.run();

			selector.navigation.menuLinks.forEach(function (linkSelector) {
				//return;
				var url;

				if (startedArgs.tablet) {

					driver.findElement({ css: linkSelector }).click().then(function () {
						log('%c yellow', 'css: "' + linkSelector + '" - click');
					});

					driver.sleep(1000);
					driver.getCurrentUrl().then(function (currentUrl) {
						url = currentUrl;
					});

				} else {

					driver.findElement({ css: selector.navigation.headerDropDownOpen }).then(function () {
						log('%c yellow', 'Header drop down menu is open');
					}, function () {
						driver.findElement({ css: selector.navigation.headerDropDown }).click().then(function () {
							log('%c yellow', 'click to css: ' + selector.navigation.headerDropDown + ' to open drop down menu');
						});
					});

					driver.sleep(1e3);

					driver.findElement({ css: selector.navigation.menuLinksWrapper + ' ' + linkSelector }).click().then(function () {
						log('%c yellow', 'css: "' + linkSelector + '" - click');
					});

					driver.sleep(1e3);

				}

				driver.getCurrentUrl().then(function (currentUrl) {
					url = currentUrl;
					reportItem.takeScreenShot('url: ' + url + ', by links: ' + linkSelector);
					log('%c yellow', 'Current url is: ' + currentUrl);
				});

			});

			driver.sleep(2000);

			if (startedArgs.tablet) {
				driver.findElement({ css: '.main-nav a[href="/gaming/all"]' }).click();
			} else {

				driver.findElement({ css: selector.navigation.headerDropDownOpen }).then(function () {
					log('%c yellow', 'Header drop down menu is open');
				}, function () {
					driver.findElement({ css: selector.navigation.headerDropDown }).click().then(function () {
						log('%c yellow', 'click to css: ' + selector.navigation.headerDropDown + ' to open drop down menu');
					});
				});

				driver.sleep(1000);

				driver.findElement({ css: selector.navigation.menuLinksWrapper + ' a[href="/gaming/all"]' }).click();

			}

			driver.sleep(1000);

			driver.findElements({ css: '.games-type-list:not(.m-fixed) .games-type-item-in' }).then(function (elems) {

				elems.forEach(function (elem, index) {

					elem.click();
					driver.sleep(1000).then(function () {
						reportItem.takeScreenShot(index);
					});

				});

				elems[0].click();
				driver.sleep(1000).then(function () {
					reportItem.takeScreenShot(0);
				});

			});

			driver.sleep(2000);
			driver.findElement({ css: selector.openFooter }).click();

			driver.sleep(1000);

			cfg.selector.innerFooterLinks.forEach(function (href) {

				if (cfg.tablet) {

					driver.findElement({css: '#account' + ' a[href="' + href + '"]' }).click();

					driver.sleep(2000);

					driver.wait(function () {
						return driver.findElement({ css: cfg.selector.dataWrapper + '> * > *:not(style)' }).then(trueFn, falseFn);
					}, 10000);

					driver.findElement({ css: cfg.selector.dataWrapper + '> * > *:not(style)' }).isDisplayed().then(function (isDisplayed) {
						if ( !isDisplayed ) {
							isFailed = true;
							reportItem.takeScreenShot('ERROR selector2: ' + cfg.selector.dataWrapper + ' a[href="' + href + '"]');
						} else {
							reportItem.takeScreenShot('PASSED selector: ' + cfg.selector.dataWrapper + ' a[href="' + href + '"]');
						}
					});

					return;

				}

				driver.findElement({css: cfg.selector.dataWrapper + ' a[href="' + href + '"]' }).click();

				driver.sleep(2000);

				driver.findElement({css: cfg.selector.dataWrapper + ' a[href="' + href + '"]' }).isDisplayed().then(
					function (isDisplayed) {

						if ( isDisplayed ) {
							isFailed = true;
							reportItem.takeScreenShot('ERROR selector1: ' + cfg.selector.dataWrapper + ' a[href="' + href + '"]');
						}

					},
					function () {
						driver.wait(function () {
							return driver.findElement({ css: cfg.selector.dataWrapper + '> * > *:not(style)' }).then(trueFn, falseFn);
						}, 10000);

						driver.findElement({ css: cfg.selector.dataWrapper + '> * > *:not(style)' }).isDisplayed().then(function (isDisplayed) {

							if ( !isDisplayed ) {
								isFailed = true;
								reportItem.takeScreenShot('ERROR selector2: ' + cfg.selector.dataWrapper + ' a[href="' + href + '"]');
							} else {
								reportItem.takeScreenShot('PASSED selector: ' + cfg.selector.dataWrapper + ' a[href="' + href + '"]');
							}

						});

						// click to back button, if back button is not on page, then click to open footer
						driver.findElement({ css: selector.topBarBackButton }).click().then(trueFn, function () {
							driver.findElement({ css: selector.openFooter }).click();
						});

						driver.sleep(2000);

					}
				);

			});

			driver.findElement({ css: selector.closeFooter }).click().then(function () {
				return reportItem.setResult(isFailed ? reportItem.results.failed : reportItem.results.passed);
			});

		};

	}

	module.exports = Test;

	Test.prototype = new TestParent();

}());