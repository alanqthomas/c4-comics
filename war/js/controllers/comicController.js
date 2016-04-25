"use strict";

(function() {

angular.module('c4').controller('comicCtrl', ['$scope', '$http', 'GApi', '$state', '$stateParams', 'imgService', 'IMG_PREFIXES', "GAuth" , "GData",
									function(    $scope,   $http,   GApi,   $state,   $stateParams,   imgService,   IMG_PREFIXES, GAuth,    GData){

	var BASE = "https://storage.googleapis.com/c4-comics.appspot.com/";

	/* README
	 * All comments are in the $scope.comments variable. The 4 fields are username(username...duh), 
	 * comment(actual comment), profileImageURL(the url to profile image), dateString(string for date and time) 
	 * 
	 * The "commment icon" is binded to show/hide comment box, use method toggleCommets()/closeComments
	 * 
	 * doug hasnt done it yet in the backend, but add will write the comment
	 */
	var id;
	if($stateParams.id){
		id = $stateParams.id;
	} else{
		$state.go('error');
	}
	$scope.seriesTitle = "NO TITLE";
	$scope.pages = [];
	$scope.comics = [];
	$scope.series = null;
	$scope.comments = [];
	$scope.comment_ids = [];
	$scope.show_comment = true;
	$scope.your_comment = "";
	$scope.logged_in = false;
	
	$scope.toggleComments = function(comic){
		//open a thing with whatever comments.
		$scope.show_comment = !$scope.show_comment;
	}
	
	$scope.closeComments = function(){
		$scope.show_comment = false;
	}
	
	//check auth
	GAuth.checkAuth().then(
		function(){
			$scope.logged_in = true;
			$scope.user_id = GData.getUser().id;
		}, 
		function(){
			
		}
	);
	
	
	$scope.add_comment = function(){
		GApi.execute("comicendpoint",'addComicComment', {"userId": $scope.user_id, "comicsId:":id, "comment":$scope.your_comment}).then(
			function(resp){
				
			},
			function(resp){
				
			}
		);
		
		
	}
	
	
	
	
	//get/update the comments
	$scope.update_comments = function(){
		if($scope.comment_ids != null){	
			//query for each comment
			for(var i = 0; i < $scope.comment_ids.length; i ++){
				GApi.execute("commentendpoint", "getComment", {"id":$scope.comment_ids[i]}).then(
					function(commentResp){
						//query for the author
						GApi.execute("c4userendpoint","getC4User", {"id":commentResp.user}).then(
							function(userResp){
								$scope.comments.push({
									comment:commentResp.comment,
									username:userResp.username,
									dateString:commentResp.dateString,
									profileImageURL: userResp.profileImageURL
								});
							},
							function(userResp){
								
							}
						);
						//$scope.comments.push(commentResp);
						
					},
					function(resp){
						//if query for comment fails
					}
				);
			}
		}
	};
	
	
	$scope.getComic = function(){
		GApi.execute("comicendpoint", "getComic", {"id": id}).then(
			function(resp){
				//supporting displaying multiple comics.
				var rating = 0;
				var ratingsSum =0;
				$scope.comment_ids = resp.comments;
				$scope.update_comments();
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
				if(resp.pages != null){
					for(var i = 0; i < resp.pages.length; i++){
						$scope.comics[$scope.comics.length -1].pages.push(
						{
							id: resp.pages[i],
							url: imgService.getURL(IMG_PREFIXES.PAGE, resp.pages[i])
						});
					}
				}
				/*
				for(var i = 0; i < resp.pages.length; i++){
					//$scope.pages.push("" + BASE + "page-" + res.pages[i])
					$scope.pages.push(imgService.getURL(IMG_PREFIXES.PAGE, resp.pages[i]));
				}
				*/
				//query for series title
				if($scope.series == null){
					$scope.seriesId = resp.seriesId;
					if($scope.seriesId != null){
						GApi.execute("seriesendpoint", "getSeries", {"id":resp.seriesId}).then(
							function(resp){
								$scope.seriesTitle = resp.title;
								//$scope.authorName = resp.authorId;
							},
							function(resp){
								//bad things,
								console.log(resp);
							}
						);
					}
				}
			},
			function(resp){
				console.log("ERROR. Comic not found.", resp);
				//$state.go('error');
			}
		);
	};
	$scope.getComic(id);
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
