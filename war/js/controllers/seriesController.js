"use strict";

//any news made page needs to add to the grunt.js file
(function() {

angular.module('c4').controller('seriesCtrl', ['$scope', '$http', 'GApi', '$state', '$stateParams',
                                    function(	 $scope, $http,   GApi,   $state,   $stateParams ){

		
		$scope.series_id=$stateParams.id;
		$scope.series_name="Series Name";
		$scope.summary="Default Summary: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ex velit, commodo ac dolor sed, auctor commodo nisi. Fusce quis purus enim. Fusce in lobortis magna. Vestibulum sit amet aliquam nibh. Quisque ac porta dolor, sed tincidunt neque. Nullam tristique commodo nunc at sagittis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Morbi elit est, consectetur vel dui at, placerat venenatis eros. Curabitur porta mi eu velit efficitur, id varius arcu vehicula. Sed at felis ante. Maecenas pretium erat dolor, vitae congue tellus finibus et. Aliquam ac congue arcu. Nulla elementum, tellus non lacinia lobortis, sapien ante tincidunt lectus, nec bibendum tortor risus eget tortor.";
		
		
		//author name
		$scope.author_name="Author Name";
		//author id, default -1
		$scope.author_id=-1;
		
		
		
		//aggregate pages
		$scope.comics=null;
		//page boolean, false if no pages available, true if at least 1 page is available
		$scope.pages_bool=true;
		
		
		
		
		//this is the parameter object
		
		//execute using (endpoint, method for endpoint, parameter for method)
		//then do (if true) $scope.value = resp.items (get the result)
		//(if false) print error
		GApi.execute("SeriesEndpoint", "getSeries", {"id":$scope.series_id}).then(
			function(resp){
				$scope.author_id=resp.authorId;
				$scope.series_name=resp.title;
				$scope.summary=resp.description;
				$scope.comics=resp.comics;
			},function(resp){
				$scope.author_name="Default Author";
				$scope.author_id=-1;
				console.log("error no series result");
			}
		);
		
		//queries for author name
		
		
		
		/*
		 *
		$scope.getSummary=function(){
			var resultReq={
				'series_id':$scope.series_id
			};
			GApi.execute("C4UserEndpoint", "getSummary", resultReq).then(
				function(resp){
					$scope.bio=resp.items;
				},function(resp){
					$scope.bio="Default Summary";
					console.log("error no summary");
				}
			)
		}
		
		//TODO, parse each individual pages
		$scope.getPages=function(){
			var resultReq={
				'series_id':$scope.series_id
			};
			GApi.execute("C4UserEndpoint", "getPages", resultReq).then(
				function(resp){
					$scope.pages=resp.items;
					$scope.pages_boolean = true;
				},function(resp){
					$scope.pages=null;
					$scope.pages_boolean = false;
					console.log("error no pages");
				}
			)
		}
		*/
		
		$scope.goToAuthor=function(){
			if($scope.author_id==-1){
				$state.go('profile');
			}
			else{
				//Suppose to go to the state with parameters, but i dont know how to implement these
				//$scope.author_id is the id of the author
				var res={referer:"what", param2:37};
				$state.go('profile',res);
			}
		}
		
		
		
		/* to my understanding how infi scroll works
		 * images is the array of all images. ng-repeat is going on those
		 * infi scroll is going to call a function to update images.
		 */
		
		
		$scope.images = [1, 2, 3, 4, 5, 6, 7, 8];
		//the infinite load function
		$scope.loadMore = function() {
			//get the last image
			var last = $scope.images[$scope.images.length - 1];
			//pushes images to the array. load more
			for(var i = 1; i <= 8; i++) {
				$scope.images.push(last + i);
			}
		};

		
}]);
})();
