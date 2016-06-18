(function () {

	"use strict";
	/*global module, require */

	var TestParent = require('viaden-modules/test-parent');

	function Test() {

		this.info = {
			name: 'withdraw from card',
			description: 'withdraw from card',
			steps: [
			],
			expectedResult: ''
		};

		this.cfg = {
			userName: 'viaden13',
			password: 'qwerty123',
			amount: 10
		};

		this.args = {};

		this.body = function () {

			var dep = this.dep,
				util = dep.util,
				trueFn = dep.trueFn,
				falseFn = dep.falseFn,
				selector = dep.selector,
				args = this.args,
				cfg = this.cfg,
				driver = args.driver,
				reportItem = args.reportItem,
				startAmount,
				isFailed;

			function login() {
				var loginStep = require(dep.path.resolve(dep.util.getStartPath(), dep.mainCfg.folder.test, 'login.js'));
				loginStep = new loginStep();
				loginStep.extend('args', args);
				loginStep.extend('cfg', cfg);
				loginStep.mode = 'step';
				loginStep.run();
				return true;
			}

			driver.wait(function () {
				return driver.findElement({ css: selector.joinNow }).then(login, dep.falseFn);
			}, 10000).then(dep.trueFn, dep.falseFn); // prevent throw error (if user already logged)

			// get current amount
			driver.findElement({ css: selector.deposit.amount }).getInnerHtml().then(function (hmtl) {
				startAmount = parseFloat(hmtl.replace(/[^\d\.]/g, ''));
			});

			// open footer
			driver.findElement({ css: selector.openFooter }).click();

			// let footer to open
			driver.sleep(1000);

			// go to withdraw
			driver.wait(function () {
				return driver.findElement({ css: selector.withdraw.withdraw }).click().then(trueFn, falseFn);
			}, 5e3);

			// click to card withdraw
			driver.wait(function () {
				return driver.findElement({ css: selector.withdraw.card }).click().then(trueFn, falseFn);
			}, 25e3);

			// fill out withdraw field
			driver.findElement({ css: selector.withdraw.amountField }).sendKeys(cfg.amount);

			driver.findElement({ css: selector.withdraw.submitWithdraw }).click();

			driver.wait(function () {
				return driver.findElement({ css: selector.modalClose }).then(dep.clickTrueFn, dep.falseFn);
			}, 15e3).then(function () {
				reportItem.takeScreenShot('Successful withdraw');
			});

			driver.findElement({ css: selector.deposit.amount }).getInnerHtml().then(function (hmtl) {
				var newAmount = parseFloat(hmtl.replace(/[^\d\.]/g, ''));
				if (newAmount - startAmount + cfg.amount > 0.1) {
					isFailed = true;
					reportItem.takeScreenShot('Deposit: ' + cfg.amount + ', before: ' + startAmount + ', after: ' + newAmount);
				}
			});

			driver.findElement({ css: '#toggle-account-wrap.expanded' }).then(dep.clickTrueFn, falseFn); // try to close footer if needed, only for tablet

			driver.sleep(1e3).then(function () {
				return isFailed || reportItem.setResult(reportItem.results.passed);
			});

			reportItem.takeScreenShot('End withdraw test');

		};

	}

	module.exports = Test;

	Test.prototype = new TestParent();

}());


