"use strict";

(function() {

var app = angular.module('c4', ['ui.router', 'ngCookies' ,'angular-google-gapi', 'ui.bootstrap', 'infinite-scroll']);

// Initialize angular-google-gapi
app.run(['GAuth', 'GData', 'GApi', '$rootScope', '$window', '$state', 'authService',
 function(GAuth,   GData,   GApi,   $rootScope,   $window,   $state,   authService){

		var CLIENT = '1083248008700-71nc8q8mmgq8fvtuocveont6su4djrne.apps.googleusercontent.com';
		var BASE = '//' + window.location.host + '/_ah/api';


    // Load C4 APIs
    var APIS = [ // List of APIs
      {'name': 'c4userendpoint', 'version': 'v1'},
      {'name': 'comicendpoint', 'version': 'v1'},
      {'name': 'pageendpoint', 'version': 'v1'}
    ];

    for(var i = 0; i < APIS.length; i++){
      GApi.load(APIS[i].name, APIS[i].version, BASE).then(function(res){
        console.log("Loaded API: ", res);
      });
    }

    // Load Google APIs
    GApi.load('storage', 'v1').then(function(res){
      console.log("Loaded API: ", res);
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
