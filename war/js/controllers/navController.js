"use strict";

(function() {

angular.module('c4').controller('navCtrl', ['$scope', '$http',
                                    function(	 $scope,   $http){
	$scope.loginMsg = "Sign In";
	$scope.checkLog = function(){
		GAuth.checkAuth().then(ifLogin(),ifLogout());
	}
	$scope.ifLogin = function() {
		$scope.loginMsg = "Sign Out";
	}
	$scope.ifLogout = function() {
		$scope.loginMsg = "Sign In";
	}
	$scope.logFunc = function() {
		GAuth.checkAuth().then(
			function(){
				GAuth.logout().then(ifLogout());
				},
			function(){
				GAuth.login().then(ifLogin());
			}
		);
	};
}]);


})();
