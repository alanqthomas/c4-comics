"use strict";

(function() {
angular.module('c4').controller('navCtrl', ['$scope', '$http',
                                    function(	 $scope,   $http){
	GAuth.checkAuth().then(ifLogin(),ifLogout());
	$scope.signMsg = "Sign "+$scope.logMsg;
	$scope.checkLog = function(){
		GAuth.checkAuth().then(ifLogin(),ifLogout());
	}
	$scope.ifLogin = function() {
		$scope.logMsg = "Out";
	}
	$scope.ifLogout = function() {
		$scope.logMsg = "In";
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
