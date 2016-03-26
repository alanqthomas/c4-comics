"use strict";

(function() {

angular.module('c4').controller('navCtrl', ['$scope', '$http',
                                    function(	 $scope,   $http){
	$scope.checkLog = function(){
		GAuth.checkAuth().then(ifLogin(),ifLogout());
	}
	$scope.ifLogin = function() {
		$scope.logMsg = "Sign Out";
	}
	$scope.ifLogout = function() {
		$scope.logMsg = "Sign In";
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
