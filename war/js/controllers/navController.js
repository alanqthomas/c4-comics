"use strict";

(function() {

angular.module('c4').controller('navCtrl', ['$scope', '$http',
                                    function(	 $scope,   $http){
	$scope.loginMsg = "Sign In";
	$scope.logFunc = $scope.doLogin();
	$scope.checkLog = function(){
		GAuth.checkAuth().then(ifLogin(),ifLogout());
	}
	$scope.ifLogin = function() {
		$scope.loginMsg = "Sign Out";
	}
	$scope.ifLogout = function() {
		$scope.loginMsg = "Sign In";
	}
	$scope.doLogin = function() {
		GAuth.checkAuth().then(
			function () {
				ifLogin();
				},
			function() {
				GAuth.login().then(function(){
				ifLogin();
				});
			}
		);
	};
	$scope.doLogout = function() {
		GAuth.checkAuth().then(
			function(){
				GAuth.logout().then(function(){
					ifLogout();
				})
			},
			function(){
				ifLogout();
				}
			}
		);
	};
}]);


})();
