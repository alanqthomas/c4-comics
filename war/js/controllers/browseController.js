"use strict";

(function() {

angular.module('c4').controller('browseCtrl', ['$scope', '$http', 'GApi', '$state', '$stateParams', 'imgService', 'IMG_PREFIXES',
                                    function( $scope, $http, GApi, $state, $stateParams, imgService, IMG_PREFIXES){
	//init
	$scope.resultsBool = false;
	$scope.browseResults = [];
	if($stateParams.tagList != null){
		$scope.selTags = $stateParams.tagList;
	}else{
		$scope.selTags = [];
	}
	$scope.displayTags = [];
	$scope.resultTags = [];

  $scope.defaultPageImg = imgService.getURL(IMG_PREFIXES.PAGE, '123456');
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
		if($stateParams.tag == ""){
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
		} else{
			$scope.resultsBool = true;
			$scope.tagId = $stateParams.tag;
			//query for comic ids associated with the tag
			GApi.execute("tagendpoint", "getTag", {"id":$scope.tagId}).then(
				function(resp){
					//query for comics based on these id
					if(resp.comicsWithTag != null && resp.comicsWithTag.length>0){
						for(var i = 0; i < resp.comicsWithTag.length; i ++){
							GApi.execute("comicendpoint", "getComic", {"id":resp.comicsWithTag[i]}).then(
								function(resp2){
									//console.log(resp2);
									$scope.browseResults.push(resp2);
								},
								function(resp2){

								}
							);
						}
					}
				},
				function(resp){

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
		//console.log($scope.browseResults);
		//console.log("type: " + type + " id: " + id);
		if(id != null){
			$state.go('comic',{"id": id});
		} else {
			$state.go('error');
		}
	}
	//main
	$scope.getResults();

	$scope.tagClick = function(tag){
		$state.go('browse', {'tag':tag});
	}

  $scope.getFirstPageURL = function(id){
    return imgService.getURL(IMG_PREFIXES.PAGE, id);
  }

}]);
})();
