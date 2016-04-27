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
			$scope.addTag = function(){
				var tagParam = {
					"tag" : $scope.newTag,
					"comicId" : id
				};
				GApi.execute("comicendpoint", "addComicTag", tagParam).then(
					function(resp){
						$scope.comic.tags.push({
							'id' : resp.id,
							'text' : resp.name
						});
						$scope.newTag = "";
					},
					function(resp){
						console.log("Error adding tag" + newTag);
						console.log(resp);
					}
				);
				
			}
			//main
			$scope.comic_id = $stateParams.id;
			if($scope.comic_id != null){
				GApi.execute("comicendpoint", "getComic", {"id" : $scope.comic_id}).then(
				function(resp){
					$scope.comic = {
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

				}
		);
	}

}]);


})();
