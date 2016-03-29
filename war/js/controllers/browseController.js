"use strict";

(function() {

angular.module('c4').controller('browseCtrl', ['$scope', '$http',	'GApi',
                                    function(	$scope,   $http,	 GApi){
		$scope.selTags = $stateParams.list;
		$scope.displayTags = null;
		$scope.removeTag = function(tagToRemove){
			var index = $scope.selTags.indexOf(tagToRemove);
			if (index > -1){
				 $scope.selTags.splice(index, 1);
			}
		}
		$scope.addTag = function(tagToAdd){
			$scope.selTags.push(tagToAdd);
		}
		$scope.getTopTags= function(){
			//endpoints call to get the top# of tags.
			//passes in $scope.selTags
			//result is placed in $scope.displayTags.
		}
		$scope.checkResults=function(){
			//checks if it should load results or tags.
			//passed in $scope.resultSwitch,  $scope.selTags
			//calls appropriate function and swaps hidden if necessary.
		}
		$scope.getResults= function(){
			//endpoints call to get the matching comics, sorted by popularity.
			//passed in $scope.resultSwitch, $scope.selTags
			//result is placed in $scope.browseResults.
		}
}]);
})();
