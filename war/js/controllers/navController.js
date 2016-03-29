"use strict";

(function() {
angular.module('c4').controller('navCtrl', ['$scope', '$http', '$state',	'GAuth','GApi', 'GData',
                                  function(	 $scope,   $http,	$state,		 GAuth,	 GApi,   GData){

	var doLogin = function(){
		$scope.signMsg = "Sign Out";
		$scope.username = GData.getUser().name
	}

	$scope.username = "No user";		


	$scope.doAuth = function(){
		if($scope.signMsg == "Sign In"){
			GAuth.checkAuth().then(
				function(){
					doLogin();
				},
				function(){
					GAuth.login().then(function(){
						doLogin();
					});
				}
			);
		} else {
			GAuth.logout().then(function(){
				$scope.signMsg = "Sign In";
				$scope.username = "No user";
			});
		}
	};

	GAuth.checkAuth().then(
		function(){
			$scope.signMsg = "Sign Out";
		},
		function(){
			$scope.signMsg = "Sign In";
		}
	);

	$scope.navSearch = function(){
		//this makes an error, unclear why.
		$state.go('search',{"list": $scope.searchTerms});
	}
}]);

})();
