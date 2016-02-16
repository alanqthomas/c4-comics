"use strict";
	
(function() {

angular.module('tictactoe').controller('homeCtrl', ['$scope', 'GAuth', 'GData', '$cookies', 'GApi', 'userService', '$http',
                                        function($scope, GAuth, GData, $cookies, GApi, userService, $http){	
	
	userService.listUsers($scope);	
	$scope.pageLoaded = true;
	
	$scope.checkLoggedIn = function(){
		if($cookies.get('userId')){
			$scope.loggedIn = true;		
		} else {
			$scope.loggedIn = false;
		}
	};	
	$scope.checkLoggedIn();
	
	var postLogin = function(){				
		putUserCookies();
		var x = parseInt(GData.getUser().id);
		x = parseInt(x/100000);
		$scope.insert = {};
		$scope.insert.id = x;
		$scope.insert.email = GData.getUser().email;
		$scope.insert.name = GData.getUser().name;
		$scope.insert.score = 0;	
		insertUser();				
		
		$scope.checkLoggedIn();
	};
	
	$scope.login = function(){
		GAuth.checkAuth().then(
			function(user){
				postLogin();
				console.log(user.name + ' is logged in');				
			}, 
			function(){
				GAuth.login().then(function(){
					postLogin();
				});
			});
	};
	
	$scope.logout = function(){
		GAuth.logout().then(function() {
			removeUserCookies();
			$scope.checkLoggedIn();
			console.log('User logged out');
		});
	};
	
	var insertUser = function(){
		gapi.client.userendpoint.insertUser($scope.insert).execute(
			function(res){
				if(!res.code){
					console.log(res);
					$cookies.put("userScore", res.score);
				} else{
					console.log("Error: ", res.code);
				}
			}
		);
	}
	
	var putUserCookies = function(){
		$cookies.put('userId', GData.getUser().id);
		$cookies.put('userName', GData.getUser().name);
		$cookies.put('userEmail', GData.getUser().email);
	};
	
	var removeUserCookies = function(){
		$cookies.remove('userId');
		$cookies.remove('userName');
		$cookies.remove('userEmail');
		$cookies.remove('userScore');
	};
	
}]);


})();