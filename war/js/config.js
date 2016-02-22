"use strict";

(function() {
	
var app = angular.module('c4');

app.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise("/home");
	
	$stateProvider
		.state('home', {
			url: "/home",
			templateUrl: "views/home.html"
		})
		.state('profile', {
			url: "/profile",
			templateUrl: "views/profile.html"
		});
});
	
})();