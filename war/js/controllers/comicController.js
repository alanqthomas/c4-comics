"use strict";

(function() {

angular.module('c4').controller('comicCtrl', ['$scope', '$http', 'GApi', '$state', '$stateParams', 'imgService', 'IMG_PREFIXES',
									function(    $scope,   $http,   GApi,   $state,   $stateParams,   imgService,   IMG_PREFIXES){

	var BASE = "https://storage.googleapis.com/c4-comics.appspot.com/";

	var id;
	if($stateParams.id){
	  id = $stateParams.id;
	} else{
	  $state.go('error');
	}
	$scope.seriesTitle = "NO TITLE";
	//$scope.pages = [];
	$scope.comics = [];
	
	GApi.execute("comicendpoint", "getComic", {"id": id}).then(
	  function(resp){
		  //supporting displaying multiple comics.
		  var rating = 0;
		  var ratingsSum =0;
		  /*
		  for(var i = 0; i < resp.ratings.length; i++){
			  ratingsSum += resp.ratings[i];
		  }
		  rating=ratingSum/resp.ratings.length;
		  */
		  $scope.comics.push({
			title : resp.title,
			comments : resp.comments,
			pages : []
			//rating: rating
			});
			for(var i = 0; i < resp.pages.length; i++){
				$scope.comics[$scope.comics.length -1].pages.push(
				{
					id: resp.pages[i],
					url: imgService.getURL(IMG_PREFIXES.PAGE, resp.pages[i])
				});
			}
		/*
		for(var i = 0; i < resp.pages.length; i++){
		  //$scope.pages.push("" + BASE + "page-" + res.pages[i])
		  $scope.pages.push(imgService.getURL(IMG_PREFIXES.PAGE, resp.pages[i]));
		}
		*/
		//query for series title
		$scope.seriesId = resp.seriesId;
		if($scope.seriesId != null){
			GApi.execute("seriesendpoint", "getSeries", {"id":resp.seriesId}).then(
				function(resp){
					$scope.seriesTitle = resp.title;
					$scope.authorName = resp.authorId;
				},
				function(resp){
					
				}
			);
		}
	  },
	  function(resp){
		console.log("ERROR. Comic not found.", resp);
		//$state.go('error');
	  }
	);
	$scope.loadComic = function(passedId){
		GApi.execute("comicendpoint", "getComic", {"id": id}).then(function(resp){
			var rating = 0;
			var ratingsSum = 0;
			/*
			for(var i = 0; i < resp.ratings.length; i++){
				ratingsSum += resp.ratings[i];
			}
			rating=ratingSum/resp.ratings.length;
			$scope.comics.push({
				title : resp.title,
				comments : resp.comments,
				pages : [],
				rating: rating
			});*/
			for(var i = 0; i < resp.pages.length; i++){
				$scope.comics[$scope.comics.length -1].pages.push(
				{
					id: resp.pages[i],
					url: imgService.getURL(IMG_PREFIXES.PAGE, resp.pages[i])
				});
			}
		},
		  function(resp){
			console.log("ERROR. Comic not found.", resp);
			//$state.go('error');
		  }
		);
	}
	$scope.goToSeries = function(id){
		if(id == null){
			$state.go("error");
		}
		else {
			$state.go("series", {"id":id});
		}
	}
	$scope.goToProfile = function(id){
		if(id == null){
			$state.go("error");
		}
		else {
			$state.go("profile", {"id":id});
		}
	}
}]);
})();
