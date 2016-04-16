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
		GApi.execute("seriesendpoint", "getSeries", {"id":$scope.series_id}).then(
			function(resp){
				/*
				$scope.author_id=resp.authorId;
				$scope.series_name=resp.title;
				$scope.summary=resp.description;
				$scope.comics_id=resp.comics;
				$scope.rating = resp.rating;
				$scope.bg_imageURL = resp.bgImageURL;
				*/
				$scope.series = {
					authorId: resp.authorId,
					title: resp.title,
					description: resp.description,
					comics_id: resp.comics,
					rating: resp.rating,
				};
				
			},function(resp){
				/*
				$scope.author_id=null;
				$scope.author_name="No Author Found";
				$scope.summary="No Summary Found";
				$scope.comics_id = null;
				$scope.rating = null;
				$scope.bg_imageURL = null;
				console.log("error no series result");*/
				
				$scope.series = {
					authorId: null,
					title: "No Summary Found",
					description: "No Summary Found",
					comics: [],
					rating: null,
					bgImageURL: null
				};
			}
		);
		
		//query for author name
		GApi.execute("c4userendpoint","getC4User", {"id": $scope.author_id}).then(
			function(resp){
				
			},
			function(resp){
				
			}
		);
		
		
		
		//checking for null values when the query returns null
		if($scope.author_name == null){
			$scope.author_name="Author Name Not Found";
		}
		
		
		
		
		
		if($scope.series.title == null){
			$scope.series.title="Title Not Found";
		}
		if($scope.series.description== null){
			$scope.series.description="No Summary Found";
		}
		
		if($scope.series.comics == null){
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
			for(var i = 0; i < $scope.series.comics.length; i ++){
				GApi.execute("comicendpoint","getComic", {"id":$scope.series.comics[i]}).then(
					function(){
						$scope.comics_reserve.push({
							id:resp.id,
							//use the create url 
							title:resp.title,
							type:"comics"
						});
					},
					function(){
						console.log("no comics found for " + $scope.series.comics[i]);
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
			if($scope.series.authorId==null){
				$state.go('error');
			}
			else{
				$state.go('profile',{"id": $scope.series.authorId});
			}
		}
		
}]);
})();
