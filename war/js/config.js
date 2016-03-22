"use strict";

(function() {

var app = angular.module('c4');

app.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise("/home");

	$stateProvider
		.state('home', {
			url: "/home",
			templateUrl: "views/home.html",
			authenticate: false
		})
		.state('profile', {
			url: "/profile",
			templateUrl: "views/profile.html",
			authenticate: false
		})
		.state('comic', {
			url: "/comic",
			templateUrl: "views/comic.html",
			authenticate: false
		})
		.state('draw', {
			url: "/draw",
			templateUrl: "views/draw.html",
			authenticate: false
		})
		.state('manage-comics', {
			url: "/manage-comics",
			templateUrl: "views/manage-comics.html",
			authenticate: false
		})
		.state('manage-subscriptions', {
			url: "/manage-subscriptions",
			templateUrl: "views/manage-subscriptions.html",
			authenticate: false
		})
		.state('new-comic', {
			url: "/new-comic",
			templateUrl: "views/new-comic.html",
			authenticate: false
		})
		.state('subscription', {
			url: "/subscription",
			templateUrl: "views/subscription.html",
			authenticate: false
		})
		.state('subscriptions', {
			url: "/subscriptions",
			templateUrl: "views/subscriptions.html",
			authenticate: false
		})
});

})();
