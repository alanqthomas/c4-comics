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
			url: "/profile/:id",
			templateUrl: "views/profile.html"
		})
		.state('comic', {
			url: "/comic/:id",
			templateUrl: "views/comic.html",
			authenticate: false
		})
		.state('browse', {
			url: "/browse",
			templateUrl: "views/browse.html"
		})
		.state('series', {
			url: "/series/:id",
			templateUrl: "views/series.html"
		})
		.state('draw', {
			url: "/draw/:id",
			templateUrl: "views/draw.html"
		})
		.state('editComic', {
			url: "/editComic/:id",
			templateUrl: "views/editComic.html"
		})
		.state('search', {
			url: "/search/:list",
			templateUrl: "views/search.html"
		})
		.state('myComics', {
			url: "/myComics",
			templateUrl: "views/myComics.html"
		})
		.state('error', {
			url: "/error/",
			templateUrl: "views/error.html"
		})
});

})();
