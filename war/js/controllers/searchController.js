"use strict";

(function() {
angular.module('c4').controller('searchCtrl', ['$scope', '$http', 'GApi', 'imgService', 'IMG_PREFIXES', '$stateParams', '$state', 'searchScope', '$window',
																			 function($scope,   $http,   GApi,   imgService,   IMG_PREFIXES,  $stateParams,    $state,   searchScope,   $window){

		$scope.search = searchScope.data;
		$scope.$watch('search.terms', function(newValue, oldValue){
			$scope.getResults();
		});
		$scope.tabs = [];
		//funtions
		$scope.getResults= function(){
			var resultReq = {
				"input": $scope.search.terms
			};
			$scope.tabs = [];
			GApi.execute('searchendpoint', 'getResults', resultReq).then(
				function(resp) {
					$scope.comicResults=[];
					$scope.comicDisplay=[];
					if(resp.comicResults != null){
						for (var i = 0; i< resp.comicResults.length; i++){
							$scope.comicResults.push({
								id: resp.comicResults[i].id,
								title:resp.comicResults[i].title,
								src:imgService.getURL(IMG_PREFIXES.COMIC, resp.comicResults[i].id),
								type:"comic"
							});
						};
						$scope.comicDisplay.push($scope.comicResults.shift());
						$scope.tabs.push({
							slug: 'comic',
		        			title: "Comics",
					        content: $scope.comicDisplay,
					        load_m: $scope.comic_loadMore
						});
					}
					$scope.profileResults=[];
					$scope.profileDisplay=[];
					if(resp.authorResults != null){
						for (var i = 0; i< resp.authorResults.length; i++){
							console.log(resp.authorResults[i].id);
							$scope.profileResults.push({
								id: resp.authorResults[i].userID,
								title: resp.authorResults[i].username,
								src: resp.authorResults[i].profileImageURL,
								type:"profile"
							});
						};
						$scope.profileDisplay.push($scope.profileResults.shift());
						$scope.tabs.push({
							slug: 'profile',
		        			title: "Profiles",
					        content: $scope.profileDisplay,
					        load_m: $scope.profile_loadMore
						});
					}
					$scope.seriesResults=[];
					$scope.seriesDisplay=[];
					if(resp.seriesResults != null){
						for (var i = 0; i< resp.seriesResults.length; i++){
							$scope.seriesResults.push({
								id: resp.seriesResults[i].id,
								title:resp.seriesResults[i].title,
								src:imgService.getURL(IMG_PREFIXES.COMIC, resp.seriesResults[i].id),
								type:"series"
							});
						};
						$scope.seriesDisplay.push($scope.seriesResults.shift());
						$scope.tabs.push({
							slug: 'series',
		        			title: "Series",
					        content: $scope.seriesDisplay,
					        load_m: $scope.series_loadMore
						});
					}
					$scope.tagResults=[];
					$scope.tagDisplay=[];
					if(resp.tagResults != null){
						for (var i = 0; i< resp.tagResults.length; i++){
							$scope.tagResults.push({
								id: resp.tagResults[i].id,
								title:resp.tagResults[i].title,
								//src:imgService.getURL(IMG_PREFIXES.TAG, resp.tagResults[i].id),
								type:"tag"
							});
						};
						$scope.tagDisplay.push($scope.tagResults.shift());
						$scope.tabs.push({
							slug: 'tag',
		        			title: "Tags",
					        content: $scope.tagDisplay,
					        load_m: $scope.tag_loadMore
						});
					}
				}, function(resp) {
					console.log("Search failed.");
					console.log(resp);
				}
			);
		};
		//infinite scroll functions
		$scope.comic_loadMore = function(){

			if ($scope.comicResults!= null && $scope.comicResults.length > 0) {
				$scope.comicDisplay.push($scope.comicResults.shift());
			};
		}
		$scope.series_loadMore = function(){
			if ($scope.seriesResults!= null && $scope.seriesResults.length > 0) {
				$scope.seriesDisplay.push($scope.seriesResults.shift());
			};
		}
		$scope.profile_loadMore = function(){
			if ($scope.profileResults!= null && $scope.profileResults.length > 0) {
				$scope.profileDisplay.push($scope.profileResults.shift());
			};
		}
		$scope.tag_loadMore = function(){
			if ($scope.tagResults!= null && $scope.tagResults.length > 0) {
				$scope.tagDisplay.push($scope.tagResults.shift());
			};
		}
		//navigation functions
		$scope.page_go = function(type, id){
			if(type == "series"){
				$scope.go_to_series(id);
			} else if(type == "profile"){
				$scope.go_to_profile(id);
			} else if(type == "comic"){
				$scope.go_to_comics(id);
			} else if (type == "tag"){
				$scope.go_to_tag(id);
			}
		}
		$scope.go_to_series = function(param_id){
			if(param_id==null){
				$state.go('error');
			}
			else{
				$state.go('series',{"id": param_id});
			}
		}
		$scope.go_to_profile=function(param_id){
			if(param_id==null){
				$state.go('error');
			}
			else{
				$state.go('profile',{"id": param_id});
			}
		}
		$scope.go_to_comics=function(param_id){
			if(param_id==null){
				$state.go("error");
			}
			else{
				$state.go("comic",{"id":param_id});
			}
		}
		$scope.go_to_tag=function(param_id){
			if(param_id==null){
				$state.go("error");
			}
			else{
				$state.go("browse",{"searchIds":[param_id]});
			}
		}
		$scope.goBack = function(){
			$window.history.back();
		}
}]);
})();
