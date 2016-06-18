(function () {

	"use strict";
	/*global module, require */

	var TestParent = require('viaden-modules/test-parent');

	function Test() {

		this.info = {
			name: 'logout test',
			description: 'test logout user',
			steps: [
				'load page',
				'login',
				'logout'
			],
			expectedResult: 'All point in check list must be passed'
		};

		this.args = {};

		this.body = function () {

			var dep = this.dep,
				selector = dep.selector,
				args = this.args,
				driver = args.driver,
				reportItem = args.reportItem;

			// login
			var loginStep = require(dep.path.resolve(dep.util.getStartPath(), dep.mainCfg.folder.test, 'login.js'));
			loginStep = new loginStep();
			loginStep.extend('args', this.args);
			loginStep.mode = 'step';
			loginStep.run();

			// open footer
			driver.wait(function () {
				return driver.findElement({css: selector.openFooter}).click().then(dep.trueFn, dep.falseFn);
			}, 5000);

			// let the footer to open, for tablet only
			driver.sleep(2000);

			// click to logout link
			driver.wait(function () {
				return driver.findElement({css: selector.logout.openLogout}).click().then(dep.trueFn, dep.falseFn);
			}, 5000);

			// click to submit logout button
			driver.wait(function () {
				return driver.findElement({css: selector.modal + ' ' + selector.logout.logoutSubmit}).click().then(dep.trueFn, dep.falseFn);
			}, 5000);

			driver.sleep(1000);

			driver.wait(function () {
				return driver.findElement({ css: selector.modalClose }).then(function (elem) {
					reportItem.takeScreenShot('Logout successful - popup');
					elem.click();
					return true;
				}, dep.falseFn);
			}, 5000).then(dep.trueFn, dep.falseFn);

			driver.sleep(1000).then(function () {
				reportItem.setResult(reportItem.results.passed);
				reportItem.takeScreenShot({label: 'Logout successful - logout state'});
			});

		};

	}

	module.exports = Test;

	Test.prototype = new TestParent();

}());


