"use strict";

(function() {
	
var app = angular.module('tictactoe');

app.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise("/home");
	
	$stateProvider
		.state('home', {
			url: "/home",
			templateUrl: "views/home.html"
		})
		.state('game', {
			url: "/game",
			templateUrl: "views/game.html"
		});
});
	
})();