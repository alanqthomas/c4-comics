"use strict";

function init(){
	
		window.init();
}

angular.module('c4').controller('mainCtrl', ['$scope', '$rootScope', '$location', 'apiService', '$window',
                                  function(	  $scope,   $rootScope,   $location,   apiService,   $window){	
	$window.init=function(){
		$scope.$apply($scope.initgapi);
	};
	
	$scope.initgapi=function(){
		//apiService.init().then(function(){console.log("Api Initialized")});
		console.log("Initialized");
	}
	
		
}]);