"use strict";

(function() {

angular.module('c4').controller('editComicCtrl', ['$scope', '$http', '$state', 'Upload', 'GApi', 'imgService', 'IMG_PREFIXES', '$stateParams',
	function(	 $scope,   $http, $state,  Upload,   GApi,   imgService,   IMG_PREFIXES, $stateParams){
			//init
			var id;
			if($stateParams.id != null){
				id = $stateParams.id;
			} else {
				$state.go('error');
			}
			//functions
			$scope.upload = function(){
				$http({
					method: 'POST',
					url: imgService.getUploadURL(IMG_PREFIXES.PAGE, id),
					headers:{
						'Content-Type': $scope.file.type
					},
					data: $scope.file
				});
				console.log($scope.file);
			};
			$scope.go_to_series = function(seriesId){
				$state.go('sereis',{"id": seriesId});
			}
			$scope.removeTag = function(tagObj){
				var tagParam = {
					"tagId" : tagObj.id,
					"comicId" : id
				};
				GApi.execute("comicendpoint", "deleteComicTag", tagParam).then(
					function(resp){
						//console.log(resp);
						console.log("Tag removed: "+resp.id +" "+ resp.name+".")
						$scope.comic.tags.splice($scope.comic.tags.indexOf(tagObj), 1);
					},
					function(resp){
						console.log("Error removing tag" + tagObj.name);
						console.log(resp);
					}
				);
			}
			$scope.addTag = function(){
				var tagParam = {
					"tag" : $scope.newTag,
					"comicId" : id
				};
				GApi.execute("comicendpoint", "addComicTag", tagParam).then(
					function(resp){
						//console.log(resp);
						console.log("Tag added: "+resp.id +" "+ resp.name+".")
						$scope.comic.tags.push({
							'id' : resp.id,
							'text' : resp.name
						});
						$scope.newTag = "";
					},
					function(resp){
						console.log("Error adding tag" +  $scope.newTag);
						console.log(resp);
					}
				);
				
			}
			//main
			if($stateParams.id != null){
				id = $stateParams.id;
			} else {
				$state.go('error');
			}
			if(id != null){
				GApi.execute("comicendpoint", "getComic", {"id" : id}).then(
				function(resp){
					$scope.comic = {
						"id" : resp.id,
						"title" : resp.title,
						"tags" : [],
						"pages" : []
					}
					if(resp.tags != null){
						for(var i=0;i<resp.tags.length;i++){
							GApi.execute("tagendpoint", "getTag", {'id' : resp.tags[i]}).then(
								function(resp1){
									$scope.comic.tags.push({
										"id" : resp1.id,
										"text" : resp1.name
									});
								},
								function(resp1){
									console.log("Error retrieving tag");
									console.log(resp1);
								}
							);
						}
					}
					if(resp.pages != null){
						for(var i=0;i<resp.pages.length;i++){
							$scope.comic.pages.push({
								"id":resp.pages[i],
								"src":imgService.getURL(IMG_PREFIXES.PAGE, resp.pages[i]),
								"pageNumber":i+1
							});
						}
					}
				},function(resp){
					console.log("Error retrieving comic.");
					console.log(resp);
					$state.go('error');
				}
		);
	}

}]);


})();
