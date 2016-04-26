"use strict";

(function() {

angular.module('c4').controller('editComicCtrl', ['$scope', '$http', '$state', 'Upload', 'GApi', 'imgService', 'IMG_PREFIXES',
	function(	 $scope,   $http, $state,  Upload,   GApi,   imgService,   IMG_PREFIXES){
			//init
			var id = '12345678';
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
				$scope.comic.tags.push($scope.newTag);
				//tag text is in $scope.newTag.
				GApi.execute("comicendpoint", "addComicTag", {"" : })
				$scope.newTag = "";
			}
			//main
			$scope.comic_id = $stateParams.id;
			if($scope.comic_id != null){
				GApi.execute("comicendpoint", "getComic", {"id" : $scope.comic_id}).then(
				function(resp){
					$scope.comic = {
						"title" : resp.title,
						"tags" : resp.tags,
						"pages" : []
					}
					for(var i=0;i<resp.pages.length;i++){
						$scope.comic.pages.push({
							"id":resp.pages[i],
							"url":imgService.getURL(IMG_PREFIXES.PAGE, resp.pages[i]),
							"pageNumber":i+1
						});
					}
				},function(resp){
					console.log("Error retrieving comic.");
					console.log(resp);

				}
		);
	}

}]);


})();
