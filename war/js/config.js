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
			url: "/profile/:id",
			templateUrl: "views/profile.html",
			authenticate: false
		})
		.state('comic', {
			url: "/comic/:id",
			templateUrl: "views/comic.html",
			authenticate: false
		})
		.state('browse', {
			url: "/browse",
			templateUrl: "views/browse.html",
			authenticate: false
		})
		.state('series', {
			url: "/series/:id",
			templateUrl: "views/series.html",
			authenticate: false
		})
		.state('draw', {
			url: "/draw/:id",
			templateUrl: "views/draw.html",
			authenticate: true
		})
		.state('editComic', {
			url: "/editComic/:id",
			templateUrl: "views/editComic.html",
			authenticate: true
		})
		.state('search', {
			url: "/search/:list",
			templateUrl: "views/search.html",
			authenticate: false
		})
});

})();
