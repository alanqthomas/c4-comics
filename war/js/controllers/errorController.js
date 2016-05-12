"use strict";

//any news made page needs to add to the grunt.js file
(function() {

angular.module('c4').controller('errorCtrl', ['$scope', '$http', 'GApi', '$state', '$stateParams',
                                    function(	 $scope, $http,   GApi,   $state,   $stateParams ){
	$scope.go_home = function(){
		$state.go("home");
	}

}]);
})();
