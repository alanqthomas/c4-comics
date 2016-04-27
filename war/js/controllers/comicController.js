"use strict";

(function() {

angular.module('c4').controller('comicCtrl', ['$scope', '$http', 'GApi', '$state', '$stateParams', 'imgService', 'IMG_PREFIXES', "GAuth" , "GData",
									function(    $scope,   $http,   GApi,   $state,   $stateParams,   imgService,   IMG_PREFIXES, GAuth,    GData){

	var BASE = "https://storage.googleapis.com/c4-comics.appspot.com/";

	/* README
	 * All comments are in the $scope.comments variable. The 4 fields are username(username...duh), 
	 * comment(actual comment), profileImageURL(the url to profile image), dateString(string for date and time) 
	 * The "Add" button adds comment. The cross next to your own comment deletes it  
	 
	 * The "commment icon" is binded to show/hide comment box, use method toggleCommets()/closeComments
	 * 
	 */
	var id;
	if($stateParams.id){
		id = $stateParams.id;
	} else{
		$state.go('error');
	}
	$scope.comic_id = $stateParams.id;
	$scope.seriesTitle = "NO TITLE";
	$scope.pages = [];
	$scope.comics = [];
	$scope.series = null;
	$scope.comments = [];
	$scope.comment_ids = [];
	$scope.show_comment = true;
	//THIS MUST BE AN OBJECT. according to angular api, best practice with 
	//ng-model is using "."
	$scope.comment_obj = {comment: ""};
	$scope.logged_in = false;
	
	//check auth
	GAuth.checkAuth().then(
		function(){
			$scope.logged_in = true;
			$scope.user_id = GData.getUser().id;
		}, 
		function(){
			
		}
	);
	
	
	//COMMENT FUNCTIONS 
	$scope.add_comment = function(){
		//console.log("add reached UserId: " + $scope.user_id + " comicId: " + $scope.comic_id + " comment: " + $scope.comment_obj.comment);
		GApi.execute("comicendpoint",'addComicComment', {"userId": $scope.user_id, "comicId":$scope.comic_id, "comment":$scope.comment_obj.comment}).then(
			function(resp){
				$scope.getComic();
				$scope.comment_obj.comment = "";
			},
			function(resp){
				
			}
		);
	}
	$scope.delete_comment = function(delete_id){
		//console.log("del reached UserId: " + $scope.user_id + " comicId: " + $scope.comic_id + " commentId: " + delete_id);
		GApi.execute("comicendpoint", "deleteComicComment", {"userId": $scope.user_id, "comicId": $scope.comic_id, "commentId":delete_id}).then(
			function(resp){
				$scope.getComic();
			},
			function(resp){
				
			}
		);
	}
	//DONOT USE THIS TO UPDATE COMMENTS, use getComic() ...get/update the comments
	$scope.update_comments = function(){
		if($scope.comment_ids != null){	
			//query for each comment
			$scope.comments = [];
			for(var i = 0; i < $scope.comment_ids.length; i ++){
				GApi.execute("commentendpoint", "getComment", {"id":$scope.comment_ids[i]}).then(
					function(commentResp){
						//query for the author
						//console.log(commentResp.userId);
						GApi.execute("c4userendpoint","getC4User", {"id":commentResp.userId}).then(
							function(userResp){
								$scope.comments.push({
									id: commentResp.id,
									user_id: commentResp.userId,
									comment:commentResp.comment,
									username:userResp.username,
									dateString:commentResp.dateString,
									profileImageURL: userResp.profileImageURL,
									date: commentResp.date
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
	
	$scope.toggleComments = function(comic){
		//open a thing with whatever comments.
		$scope.show_comment = !$scope.show_comment;
	}
	
	$scope.closeComments = function(){
		$scope.show_comment = false;
	}
	
	//END COMMENT FUNCTIONS
	
	
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
				$scope.comics = [];
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
