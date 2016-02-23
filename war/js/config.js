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
			authenticate: true
		});
});
	
})();