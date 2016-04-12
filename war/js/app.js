"use strict";

(function() {

var app = angular.module('c4', ['ui.router', 'ngCookies' ,'angular-google-gapi', 'ui.bootstrap', 'infinite-scroll']);

// Initialize angular-google-gapi
app.run(['GAuth', 'GData', 'GApi', '$rootScope', '$window', '$state', 'authService',
 function(GAuth,   GData,   GApi,   $rootScope,   $window,   $state,   authService){
				
		var CLIENT = '1083248008700-71nc8q8mmgq8fvtuocveont6su4djrne.apps.googleusercontent.com';
		var BASE = '//' + window.location.host + '/_ah/api';
		
		GApi.load('c4userendpoint', 'v1', BASE).then(function(res){
			console.log("c4userendpoint: ", res);
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

})();