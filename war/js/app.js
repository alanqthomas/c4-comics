"use strict";

var app = angular.module('c4', ['ui.router', 'ngCookies' ,'angular-google-gapi']);

// Initialize angular-google-gapi
app.run(['GAuth', 'GData', 'GApi', '$rootScope', '$window',
 function(GAuth,   GData,   GApi,   $rootScope,   $window){
				
		var CLIENT = '432508624556-h5pq1n44nmg5p21r55mubj54cnuptojv.apps.googleusercontent.com';
		var BASE = '//' + window.location.host + '/_ah/api';
		
		GApi.load('userendpoint', 'v1', BASE).then(function(res){
			console.log("userendpoint: ", res);
		});
		
		GAuth.setClient(CLIENT);
		GAuth.setScope("https://www.googleapis.com/auth/userinfo.email");
		
}]);

