(function () {

	"use strict";
	/*global */

	var selector;

	selector = {

		navigation: {

			headerDropDown: '.global-nav .active-nav-item',
			headerDropDownOpen: '.global-nav .active-nav-item.m-opened',
			menuLinksWrapper: '.nav-list',
			menuLinks: ['a[href="/"]', 'a[href="/gaming/all"]', 'a[href="/promotions"]', 'a[href="/info/rewards"]', 'a[href="/clubs"]', 'a[href="/"]']

		},

		register: {
			registrationForm: '.registration-form', // div
			eMail: '#email', // text
			phoneNumber: '#cell', // number
			userName: '#userName', // text
			password: '#password', // text
			confirmPassword: '#confirm-password', // text
			title: '#title option:nth-child(2)', // select
			firstName: '#firstname', // text
			lastName: '#lastname', // text
			birthDate: '#birthdate', // text
			country: '#cor option[value=GB]', // select
			postcode: '#postcode', // text
			postcodeFind: '#postcodeButton', // button
			postcodeSuggestion: '#postcodeSuggestionSelect option[value="0"]', // select
			submit: 'input[type="submit"][name="submit"]', // button
			termsContent: '.accept-terms-popup .scroll-box.info-content', // div
			termsSubmit: '.accept-terms-popup [data-action="accept"]', // button
			deposit: '.deposit-btn', // button
			marketing: '#marketing'
		},

		joinNow: '.join-now-btn',
		topBarBackButton: '.acc-back-btn',

		login: {
			openLogin: '[href="/login"]',
			userName: '#username',
			password: '#password',
			loginSubmit: '.login-popup input[type="submit"]',
			loginSuccessPopup: '.login-success-popup'
		},

		modal: 'body .modal:last-of-type',
		modalClose: 'body .modal:last-of-type .alert-close',

		openFooter: '[href="/account"]',
		closeFooter: 'a[href="/"].homeLink',
		home: '.main-nav a[href="/"]',

		logout: {
			openLogout: '#account a[href="/logout"]',
			logoutSubmit: '[href="/logout"]'
		},

		regVisa: {
			toDeposit: '[href="/payment/deposit"]',
			visaCard: '[href="/payment/addcard/VISA"]',
			visaCardIFrame: '#ThirdPartyPaymentIframe',
			cardNumber: '#cc_card_number',
			cardMonth: '#cc_exp_month option[value="11"]',
			cardYear: '#cc_exp_year option[value="23"]',
			submitCard: '#continueButton'
		},

		gameFinder: {
			wrapper: '.js-search-wrapper',
			gameFind: '.js-btn-games-search',
			searchField: '.js-search',
			resultList: '.games-finder-list',
			gamesCounter: '.js-games-counter',
			clearSearch: '.js-clear-search',
			backFade: '.js-close-search'
		},

		deposit: {
			amount: '#toggle-account .amount',
			amountField: '#amount',
			deposit: '[href="/payment/deposit"]',
			submitDeposit: '[type=button][name=submit]',
			card: '#registered-account-list li',
			quickAmountsItems: '.quick-amounts-list .quick-amount-item',
			cv2: '#cv2'
		},

		withdraw: {
			withdraw: '[href="/payment/withdraw"]',
			card: '#registered-account-list li',
			amountField: '#amount',
			submitWithdraw: '.account-wrap [type=button][name=submit]'
		}

	};


	module.exports = selector;

}());