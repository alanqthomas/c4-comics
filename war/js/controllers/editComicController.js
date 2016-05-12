"use strict";

(function() {

angular.module('c4').controller('editComicCtrl', ['$scope', '$http', '$state', 'Upload', 'GApi', 'imgService', 'IMG_PREFIXES', '$stateParams', '$timeout',
	function(	 $scope,   $http, $state,  Upload,   GApi,   imgService, IMG_PREFIXES, $stateParams, $timeout){
			//init
			var id;

			$scope.$watch('files', function(){
				$scope.upload($scope.files);
			});

			//functions
			$scope.upload = function(files){
				if(files && files.length){
					for(var i = 0; i < files.length; i++){
						var file = files[i];
						var pageId;
						GApi.execute('comicendpoint', 'addcomicpage', {'comicId': id}).then(
							function(resp){
								console.log("Page id: ", resp.id);
								$http({
									method: 'POST',
									url: imgService.getUploadURL(IMG_PREFIXES.PAGE, resp.id),
									headers:{
										'Content-Type': file.type
									},
									data: file
								}).then(function(resp){
									console.log("Success: " + resp);
								}, function(resp){
									console.log("ERROR: File upload " + resp);
								});
							},
							function(resp){
								console.log("ERROR inserting page:" + resp);
							}
						);
					}//for
				}//if
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
