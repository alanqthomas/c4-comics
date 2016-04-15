"use strict";

//any news made page needs to add to the grunt.js file
(function() {

angular.module('c4').controller('seriesCtrl', ['$scope', '$http', 'GApi', '$state', '$stateParams',
                                    function(	 $scope, $http,   GApi,   $state,   $stateParams ){
		//init
		$scope.series_id=$stateParams.id;
		//aggregate comics
		$scope.comics=[];
		$scope.comics_reserve=[];
		//execute using (endpoint, method for endpoint, parameter for method)
		GApi.execute("SeriesEndpoint", "getSeries", {"id":$scope.series_id}).then(
			function(resp){
				$scope.author_id=resp.authorId;
				$scope.series_name=resp.title;
				$scope.summary=resp.description;
				$scope.comics_id=resp.comics;
				$scope.rating = resp.rating;
				$scope.bg_imageURL = resp.resp.bgImage;
			},function(resp){
				$scope.author_id=null;
				$scope.author_name="No Author Found";
				$scope.summary="No Summary Found";
				$scope.comics_id = null;
				$scope.rating = null;
				$scope.bg_imageURL = null;
				console.log("error no series result");
			}
		);
		//checking for null values when the query returns null
		if($scope.author_name == null){
			$scope.author_name="Author Name Not Found";
		}
		if($scope.series_name == null){
			$scope.series_name="Title Not Found";
		}
		if($scope.summary== null){
			$scope.summary="No Summary Found";
		}
		if($scope.comics_id == null){
			//PLACE HOLDERS if there are no comics_id, populate placeholder
			/* to my understanding how infi scroll works
			 * images is the array of all images. ng-repeat is going on those
			 * infi scroll is going to call a function to update images.
			 */
			/*
			$scope.comics = [1, 2, 3, 4, 5, 6, 7, 8];
			//the infinite load function
			$scope.loadMore = function() {
				//get the last image
				var last = $scope.comics[$scope.comics.length - 1];
				//pushes images to the array. load more
				for(var i = 1; i <= 8; i++) {
					$scope.comics.push(last + i);
				}
			};*/
		} else{
			//query for comics_ids 
			for(var i = 0; i < $scope.comics_id.length; i ++){
				GApi.execute("comicendpoint","getComic", {"id":$scope.comics_id[i]}).then(
					function(){
						$scope.comics_reserve.push({
							id:resp.id,
							//use the create url 
							title:resp.title,
							type:"comics"
						});
					},
					function(){
						console.log("no comics found for " + $scope.comics_id[i]);
					}
				);
			}
			//put one in the comics
			$scope.comics.push($scope.comics_reserve.shift());
		}
		/* attempted ngStyle, they dont work
		$scope.bg_img="background:#ffffff url('https://www.planwallpaper.com/static/images/6790904-free-background-wallpaper.jpg') no-repeat center center;";
		$scope.bg_img="{'background-color':'red'}";
		*/
		$scope.goToAuthor=function(){
			if($scope.author_id==null){
				$state.go('error');
			}
			else{
				$state.go('profile',{"id": $scope.author_id});
			}
		}
		
}]);
})();
