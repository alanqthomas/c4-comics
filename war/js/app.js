"use strict";

var app = angular.module('c4', ['ui.router', 'ngCookies' ,'angular-google-gapi']);

// Initialize angular-google-gapi
app.run(['GAuth', 'GData', 'GApi', '$rootScope', '$window', '$state', 'authService',
 function(GAuth,   GData,   GApi,   $rootScope,   $window,   $state,   authService){
				
		var CLIENT = '432508624556-h5pq1n44nmg5p21r55mubj54cnuptojv.apps.googleusercontent.com';
		var BASE = '//' + window.location.host + '/_ah/api';
		
		GApi.load('userendpoint', 'v1', BASE).then(function(res){
			console.log("userendpoint: ", res);
		});
		
		GAuth.setClient(CLIENT);
		GAuth.setScope("https://www.googleapis.com/auth/userinfo.email");
		
		
		// UI-Router state authorization
		$rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
			var loggedIn = false;
			authService.checkAuth().then(
				function(res){
					loggedIn = res;
				}			
			);
			
			if(toState.authenticate && !loggedIn){
				$state.transitionTo("home");
				event.preventDefault();
			}
		});
		
		
}]);

