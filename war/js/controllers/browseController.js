"use strict";

(function() {

angular.module('c4').controller('browseCtrl', ['$scope', '$http',	'GApi',
                                    function(	$scope,   $http,	 GApi){

		$scope.selTags = $stateParams.list;
		$scope.removeTag = function(tagToRemove){
			var index = $scope.selTags.indexOf(tagToRemove);
			if (index > -1){
				 $scope.selTags.splice(index, 1);
			}
		}
		$scope.addTag = function(tagToAdd){
			$scope.selTags.push(tagToAdd);
		}

}]);


})();
