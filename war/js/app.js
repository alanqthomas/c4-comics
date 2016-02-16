"use strict";

var app = angular.module('tictactoe', ['ui.router', 'ngCookies' ,'angular-google-gapi', 'userModule']);

app.run(['GAuth', 'GData', '$state', '$rootScope', '$window',
 function(GAuth,   GData,   $state,   $rootScope,   $window){
				
		var CLIENT = '559176139847-d94n68qu4h8i4uq2p8eh5kmjt17gm02p.apps.googleusercontent.com';
		
		GAuth.setClient(CLIENT);
		GAuth.setScope("https://www.googleapis.com/auth/userinfo.email");
		
}]);

