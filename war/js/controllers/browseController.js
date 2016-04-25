"use strict";

(function() {

angular.module('c4').controller('browseCtrl', ['$scope', '$http', 'GApi', '$state', '$stateParams', 'imgService', 'IMG_PREFIXES',
                                    function( $scope, $http, GApi, $state, $stateParams, imgService, IMG_PREFIXES){
	//init
	if($stateParams.tagList != null){
		$scope.selTags = $stateParams.tagList;
	}else{
		$scope.selTags = [];
	}
	$scope.resultsBool = false;
	$scope.displayTags = [];
	$scope.tagDisplayStyle = {
		'background':'rbga(0,0,0,225)',
		'color' : 'rbga(255,255,255,215)'
	};
	$scope.go_to = function(type, id){	
		if(type == "comic" && id != null){
			$state.go('comic',{"id": id});
		} else {
			$state.go('error');
		}
	}
	$scope.prepareResult = function(part){
		//add the picture to part.src
		part.src = imgService.getURL(IMG_PREFIXES.COMIC, part.id);
		part.type = "comic";
	}
	$scope.getResults= function(){
		var resultReq = {
			"tags": $scope.selTags,
			"numResults" : $scope.resultSwitch
		};
		GApi.execute('browseendpoint', 'getResults', resultReq).then( 
			function(resp) {
				//console.log(resp);
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
	$scope.removeTag = function(tagToRemove){
		var index = $scope.selTags.indexOf(tagToRemove);
		if (index > -1){
			 $scope.selTags.splice(index, 1);
		}
		$scope.getResults();
	}
	$scope.addTag = function(){
		$scope.selTags.push($scope.currentTag);
		$scope.currentTag = "";
		$scope.getResults();
	}
}]);
})();
