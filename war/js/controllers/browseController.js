"use strict";

(function() {

angular.module('c4').controller('browseCtrl', ['$scope', '$http',	'GApi',
                                    function(	$scope,   $http,	 GApi){
	if($stateParams.tagList != null){
		$scope.selTags = $stateParams.tagList;
	}else{
		$scope.selTags = [];
	}
	$scope.resultsBool = false;
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
	$scope.tagDisplayStyle = {
		'background':'rbga(0,0,0,225)',
		'color' : 'rbga(255,255,255,215)'
	};
	function prepareComic(part){
		part.url = buildImageURL('comic', part.id);
	}
	$scope.getResults= function(){
		var resultReq = {
			"tags": $scope.selTags,
			"numResults" : $scope.resultSwitch
		};
		GApi.execute('browseendpoint', 'getResults', resultReq).then( 
			function(resp) {
			console.log(resp);
			$scope.resultsBool = resp.comics;
			if($scope.resultsBool){
				$scope.displayTags = null;
				$scope.browseResults = resp.results;
				$scope.browseResults.forEach(prepareResult(part));
			} else {
				$scope.browseResults = null;
				$scope.displayTags = resp.results;
			}

			//result is placed in $scope.displayTags.
			}, function(resp) {
				console.log("Result call failed.");
				console.log(resp);
			}
		);
	}
}]);
})();
