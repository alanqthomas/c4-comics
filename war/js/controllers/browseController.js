"use strict";

(function() {

angular.module('c4').controller('browseCtrl', ['$scope', '$http',	'GApi',
                                    function(	$scope,   $http,	 GApi){
	if($stateParams.tagList == null){
		$scope.selTags = $stateParams.tagList;
	}else{
		$scope.selTags = [];
	}
	$scope.displayTags = [];
	$scope.removeTag = function(tagToRemove){
		var index = $scope.selTags.indexOf(tagToRemove);
		if (index > -1){
			 $scope.selTags.splice(index, 1);
		}
	}
	$scope.addTag = function(tagToAdd){
		$scope.selTags.push(tagToAdd);
	}
//gets tags for further sorting, sorted by popularity.
	$scope.getTopTags= function(){
		var resultReq = {
			"tags": $scope.selTags,
		};
		/*GApi.execute('browseEndpoint', 'getTags', resultReq).then( 
			function(resp) {
			$scope.value = resp.items;//add here
			//result is placed in $scope.displayTags.
			}, function(resp) {
				console.log("error :(");
			}
		);*/
	}
	$scope.checkResults=function(){
		var resultReq = {
			"tags": $scope.selTags,
			"numResults": $scope.resultSwitch
		};
		/*GApi.execute('browseEndpoint', 'checkResults', resultReq).then( 
			function(resp) {
			$scope.value = resp.items;//extract a boolean, call methods.
			}, function(resp) {
				console.log("error :(");
			}
		);*/
	}
	
//gets matching comics, sorted by popularity.
	$scope.getResults= function(){
		var resultReq = {
			"tags": $scope.selTags,
			"numResults": $scope.resultSwitch
		};
		/*GApi.execute('browseEndpoint', 'getResults', resultReq).then( 
			function(resp) {
			$scope.value = resp.items;//add here
			//result is placed in $scope.browseResults.
			}, function(resp) {
				console.log("error :(");
			}
		);*/
	}
}]);
})();
