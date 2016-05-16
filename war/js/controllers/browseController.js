"use strict";

(function() {

angular.module('c4').controller('browseCtrl', ['$scope', '$http', 'GApi', '$state', '$stateParams', 'imgService', 'IMG_PREFIXES',
                                    function( $scope, $http, GApi, $state, $stateParams, imgService, IMG_PREFIXES){
	//init
	$scope.resultSwitch = 12;
	$scope.resultsBool = false;
	if($stateParams.tagList != null){
		$scope.selTags = $stateParams.tagList;
	}else{
		$scope.selTags = [];
	}
	$scope.displayTags = [];
	$scope.resultTags = [];
	//css
	$scope.tagDisplayStyle = {
		'background':'rbga(0,0,0,225)',
		'color' : 'rbga(255,255,255,215)'
	};
	//infi scroll function
	$scope.shiftTags = function(){
		if ($scope.resultTags != null && $scope.resultTags.length > 0) {
			$scope.displayTags.push($scope.resultTags.shift());
		};
	}
	//functions
	$scope.prepareResult = function(part){//add the picture to part.src
		part.src = imgService.getURL(IMG_PREFIXES.COMIC, part.id);
		part.type = "comic";
	}
	$scope.getResults= function(){
		if($scope.selTags.length < 1){
			GApi.execute('tagendpoint', 'listTag', {}).then( 
				function(resp) {
					$scope.resultsBool = false;
					$scope.browseResults = null;
					$scope.resultTags = resp.items;
					$scope.displayTags = [];
					$scope.shiftTags();
				}, function(resp) {
					console.log("Result call failed.");
					console.log(resp);
				}
			);
		}else{
			var resultReq = {
				"tags": $scope.selTags,
				"numResults" : $scope.resultSwitch
			};
			GApi.execute('browseendpoint', 'getResults', resultReq).then( 
				function(resp) {
					$scope.resultsBool = resp.comics;
					if($scope.resultsBool){
						$scope.displayTags = null;
						$scope.resultTags = null;
						$scope.browseResults = resp.results;
						$scope.browseResults.forEach(prepareResult(part));
					} else {
						$scope.browseResults = null;
						$scope.resultTags = resp.results;
						$scope.displayTags = [];
						$scope.shiftTags();
					}
				}, function(resp) {
					console.log("Result call failed.");
					console.log(resp);
				}
			);
		}
	}
	//tag manipulation functions
	$scope.removeTag = function(tagToRemove){
		var index = $scope.selTags.indexOf(tagToRemove);
		if (index > -1){
			 $scope.selTags.splice(index, 1);
		}
		$scope.getResults();
	}
	/*
	$scope.addTag = function(){
		$scope.selTags.push($scope.currentTag);
		$scope.currentTag = "";
		$scope.getResults();
	}*/
	//navigation
	$scope.go_to = function(type, id){	
		if(type == "comic" && id != null){
			$state.go('comic',{"id": id});
		} else {
			$state.go('error');
		}
	}
	//main
	$scope.getResults();
	
	
	
	
}]);
})();
