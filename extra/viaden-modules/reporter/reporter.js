(function () {

	"use strict";
	/*global console, alert, require, exports, module */

	var mainCfg, util, openHtml, fs, EasyZip, path, nodemailer, pathHere, log;

	mainCfg = require('viaden-modules/config/main.js');
	util = require('viaden-modules/util');
	openHtml = require('open');
	fs = require('fs');
	EasyZip = require('easy-zip').EasyZip;
	path = require('path');
	nodemailer = require('nodemailer');
	pathHere = __dirname;
	log = require('viaden-modules/log').getLog();

	function Reporter() {

		this.data = {
			timeStart: new Date()
		};

		// create folder with report if needed
		if ( !fs.existsSync(this.path.report) ) {
			fs.mkdirSync(this.path.report);
		}

		this.init();
		this.items = [];

	}

	Reporter.prototype = {
		path: {
			report: path.resolve(util.getStartPath(), mainCfg.folder.report),
			test: path.resolve(util.getStartPath(), mainCfg.folder.test)
		},
		namePrefix: 'Report-',
		newItem: function (data) {
			data.reporter = this;
			var item = new ReportItem(data); // fileName, driver, reporter
			this.items.push(item);
			return item;
		},
		compile: function () {

			var dirName = this.dirName,
				pathToFolder = path.resolve(this.path.report, dirName),
				pathToReport = path.resolve(pathToFolder, dirName + '.html'),
				pathToZipReport = path.resolve(this.path.report, dirName + '.zip'),
				html = this.template(this.reportTemplate)(this).replace('{{script}}', '<script type="text/javascript">' + this.reportJs + '	</script>');

			fs.writeFile(pathToReport, html, function (err) {
				var zip5;
				if (err) {
					log('%c red', err);
				} else {
					log('%c blue', "The report was saved in " + pathToReport);

					zip5 = new EasyZip();

					zip5.zipFolder(pathToFolder, function(){

						zip5.writeToFile(pathToZipReport, function(){

							//if (that.data.argsHash.sendMail) {
							//	that.sendMail(pathToZipReport);
							//}

						});

					});

					openHtml(pathToReport);

				}

			});

			// create report

		},
		init: function () {

			// .dirName
			// .date
			// .reportTemplate
			// .reportCss
			// .reportJs

			var date = new Date();

			this.date = [
				date.getFullYear(),
				date.getMonth() + 1,
				date.getDate(),
				date.getHours(),
				date.getMinutes(),
				date.getSeconds()].join('-').replace(/(-)(\d)(?!\d)/gi, function (match, p1, p2) {
					return p1 + '0' + p2;
				});

			this.dirName = this.namePrefix + this.date;

			// create folders
			fs.mkdir(path.resolve(this.path.report, this.dirName));
			fs.mkdir(path.resolve(this.path.report, this.dirName, 'screenshot'));

			// read html template
			fs.readFile(path.resolve(pathHere, 'html', 'report-template.html'), "utf8", (function (err, data) {
				if (err) {
					return log('%c red', err);
				}
				this.reportTemplate = data;
			}.bind(this)));


			// read css' (2 files)
			this.reportCss = '';
			['reset.css', 'report.css'].forEach(function (fileName) {
				fs.readFile(path.resolve(pathHere, 'css', fileName), "utf8", (function (err, data) {
					if (err) {
						return log('%c red', err);
					}
					this.reportCss += data;
				}.bind(this)));
			}, this);

			// read js
			fs.readFile(path.resolve(pathHere, 'js', 'script.js'), "utf8", (function (err, data) {
				if (err) {
					return log('%c red', err);
				}
				this.reportJs = data;
			}.bind(this)));

		},
		template:  function (str) {
			return new Function("obj",
					"var p=[];obj=obj||{};with(obj){p.push('" + str
					.replace(/[\r\t\n]/g, " ")
					.split("<%").join("\t")
					.replace(/((^|%>)[^\t]*)'/g, "$1\r")
					.replace(/\t=([\s\S]*?)%>/g, "',$1,'")
					.split("\t").join("');")
					.split("%>").join("p.push('")
					.split("\r").join("\\'") + "');} return p.join('');");
		},
		sendMail: function(path) { // todo: add send mail

			log('%c blue', 'send mail');

			return;

			var transporter, mailOptions;

			transporter = nodemailer.createTransport({
				service: 'Gmail',
				auth: {
					user: 'web.best.master@gmail.com',
					pass: 'colos_inc.'
				}
			});

			mailOptions = {
				from: 'node.js', // sender address
				to: 'dmitry.turovtsov@gmail.com', // list of receivers
				subject: 'Test report - ' + this.date, // Subject line
				text: 'Test report - ' + this.date, // plaintext body
				html: 'Test report - ' + this.date, // html body
				attachments: [
					{
						path: path
					}
				]
			};

			transporter.sendMail(mailOptions, function(error, info){
				return error ? log(error) : log('Message sent: ' + info.response);
			});

		}
	};


	function ReportItem(data) {

		this.isEnable = true;

		this.data = {
			timeStart: new Date(),
			timeEnd: new Date(),
			testFileName: data.testFileName,
			testInfo: data.test.info || {},
			result: this.results.failed
		};

		this.reporter = data.reporter;
		this.driver = data.driver;
		this.items = [];

	}

	ReportItem.prototype = {
		results: {
			failed: 'failed',
			passed: 'passed'
		},
		disable: function () {
			this.isEnable = false;
		},
		enable: function () {
			this.isEnable = true;
		},
		setResult: function(result) {

			if ( !this.isEnable ) {
				return;
			}

			this.data.timeEnd = new Date();
			this.data.result = result;

		},
		getResult: function(){
			return this.data.result;
		},
		markStartTime: function() {

			if ( !this.isEnable ) {
				return;
			}

			this.data.timeStart = new Date();

		},
		addText: function (text) {

			if ( !this.isEnable ) {
				return;
			}

			this.items.push({
				type: 'text',
				text: text,
				timeStamp: new Date()
			});

			return this;

		},
		takeScreenShot: function (data) { // data.label

			if ( !this.isEnable ) {
				return;
			}

			if (typeof data === 'string' || typeof data === 'number') {
				data = {
					label: data.toString()
				}
			}

			if (!data) {
				data = {
					label: ''
				}
			}

			var timeStamp = new Date(),
				item = {
					type: 'image',
					label: data.label,
					timeStamp: timeStamp,
					src: 'screenshot/screenshot-' + timeStamp.getTime() + '.png',
					screenShotSrc: path.resolve(util.getStartPath(), this.reporter.path.report, this.reporter.dirName, 'screenshot', 'screenshot-' + timeStamp.getTime() + '.png')
				};

			this.driver.takeScreenshot().then(function (image, err) {

				fs.writeFile(item.screenShotSrc, image, 'base64');

			});

			this.items.push(item);

		}
	};

	module.exports = Reporter;

}());