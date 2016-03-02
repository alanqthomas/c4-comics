"use strict";

(function() {
	
var app = angular.module('hci');

app.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise("/home");
	
	$stateProvider
		.state('home', {
			url: "/home",
			templateUrl: "views/home.html",
			authenticate: false
		})
});
	
})();