"use strict";

//any news made page needs to add to the grunt.js file
(function() {

angular.module('c4').controller('seriesCtrl', ['$scope', '$http', 'GApi', '$state', '$stateParams', 'imgService', 'IMG_PREFIXES',
                                    function(	 $scope, $http,   GApi,   $state,   $stateParams, 	imgService,    IMG_PREFIXES ){
		//init
		//DO NOT MOVE THESE METHODS 
		$scope.loadMore = function() {
			if($scope.comics_reserve.length >0 ){
				$scope.comics.push($scope.comics_reserve.shift());
			}
		}
		$scope.getFirstPageURL = function(id){
			return imgService.getURL(IMG_PREFIXES.PAGE, id);
		}
		$scope.series_id=$stateParams.id;
		//aggregate comics
		$scope.comics=[];
		$scope.comics_reserve=[];
		$scope.author_name="Author Name Not Found";
		$scope.series = {
				authorId: null,
				title: "No Title Found",
				description: "No Summary Found",
				comics: [],
				rating: null,
				bgImageURL: null
		};
		$scope.goToComics = function(id){
			if(id == null){
				$state.go("error");
			}
			else{
				$state.go("comic", {"id": id});
			}
		}
		//execute using (endpoint, method for endpoint, parameter for method)
		GApi.execute("seriesendpoint", "getSeries", {"id":$scope.series_id}).then(
			function(resp){
				$scope.series = resp;
				//query for author name
				GApi.execute( "c4userendpoint","getC4User", {"id":$scope.series.authorId}).then(
					function(resp){
						$scope.author_name = resp.username;
					},
					function(resp){	
					}
				);
				//query for comics
				if($scope.series.comics.length == 0){
					console.log("no comics");
				} else{
					//query for comics_ids 
					console.log($scope.series.comics);
					for(var i = 0; i < $scope.series.comics.length; i ++){
						GApi.execute("comicendpoint","getComic", {"id":$scope.series.comics[i]}).then(
							function(resp2){
								$scope.comics_reserve.push({
									id:resp2.id,
									//get the first page for image
									page: resp2.pages,
									title:resp2.title,
									type:"comics"
								});
								
								//put one in the comics
								if($scope.comics_reserve.length > 0){
									$scope.comics.push($scope.comics_reserve.shift());
								}
							},
							function(resp2){
								console.log("no comics found for " + $scope.series.comics[i]);
							}
						);
					}
				}
			},function(resp){
			}
		);
		/* attempted ngStyle, they dont work
		$scope.bg_img="background:#ffffff url('https://www.planwallpaper.com/static/images/6790904-free-background-wallpaper.jpg') no-repeat center center;";
		$scope.bg_img="{'background-color':'red'}";
		*/
		$scope.goToAuthor=function(){
			if($scope.series.authorId==null){
				$state.go('error');
			}
			else{
				$state.go('profile',{"id": $scope.series.authorId});
			}
		}
		$scope.$apply;
		
		
}]);
})();
