"use strict";

(function() {

angular.module('c4').controller('editComicCtrl', ['$scope', '$http', 'Upload', 'GApi', 'imgService', 'IMG_PREFIXES',
	function(	 $scope,   $http,   Upload,   GApi,   imgService,   IMG_PREFIXES){
			var id = '12345678';
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

			$scope.comic_id = $stateParams.id;
			if($scope.comic_id != null){
				GApi.execute("comicendpoint", "getComic", {"id":$scope.comic_id}).then(
				function(resp){
					$scope.comic = {
						"title" : resp.title,
						"tags" : resp.tags
					}
					for(var i=0;i<resp.pages.length;i++){
						$scope.pages.push({
							"id":resp.pages[i],
							"url":imgService.getURL(IMG_PREFIXES.PAGE, resp.pages[i]),
							"pageNumber":i
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
