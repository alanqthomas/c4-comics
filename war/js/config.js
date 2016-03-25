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
		.state('series', {
			url: "/series",
			templateUrl: "views/series.html",
			authenticate: false
		})
		.state('draw', {
			url: "/draw",
			templateUrl: "views/draw.html",
			authenticate: false
		})
		.state('editComic', {
			url: "/editComic",
			templateUrl: "views/editComic.html",
			authenticate: false
		})
		.state('browse', {
			url: "/browse",
			templateUrl: "views/browse.html",
			authenticate: false
		})
		.state('search', {
			url: "/search",
			templateUrl: "views/search.html",
			authenticate: false
		})
});

})();
