"use strict";

//any news made page needs to add to the grunt.js file
(function() {

angular.module('c4').controller('seriesCtrl', ['$scope', '$http', 'GApi', '$state', '$stateParams', 'imgService', 'IMG_PREFIXES', "GAuth", "GData",
                                    function(	 $scope, $http,   GApi,   $state,   $stateParams, 	imgService,    IMG_PREFIXES,   GAuth,   GData ){
		/* README
		 * All comments are in the $scope.comments variable. The 4 fields are username(username...duh), 
		 * comment(actual comment), profileImageURL(the url to profile image), dateString(string for date and time) 
		 * 
		 * The "commment icon" is binded to show/hide comment box, use method toggleCommets()/closeComments
		 */
		//init
		//DO NOT MOVE THINGS IN INIT
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
		$scope.editTitle = false;
		$scope.editDescription = false;
		$scope.comments = [];
		$scope.show_comment = true;
		//THIS MUST BE AN OBJECT. according to angular api, best practice with 
		//ng-model is using "."
		$scope.comment_obj = {comment: ""};
		$scope.faved = false;
		//END init
		//EDIT SERIES FUNCTIONS
		$scope.saveSettings= function(){
			$scope.newSeries= {
				id: $scope.series_id,
				title: $scope.series.title,
				description: $scope.series.description
			};
			GApi.execute("seriesendpoint", "updateSeries", $scope.newSeries).then(
				function(resp){
					$scope.updateSeries();
				},
				function(resp){
					
				}
			);
		};
		$scope.toggle= function(toToggle){
			if(toToggle == "editTitle"){
				if($scope.editTitle == true){
					$scope.saveSettings();
				}
				$scope.editTitle = !($scope.editTitle);
			}
			if(toToggle == "editDescription"){
				if($scope.editDescription == true){
					$scope.saveSettings();
				}
				$scope.editDescription = !($scope.editDescription);
			}
		}
		$scope.updateSeries = function(){
			GApi.execute("seriesendpoint", "getSeries",{"id":$scope.series_id}).then(
				function(resp){	
					$scope.series.title= resp.title;
					$scope.series.description= resp.description;
				}, function(resp){
				}
			);
		};
		//END EDIT FUNCTIONS
		//COMMENT FUNCTIONS
		$scope.add_comment = function(){
			//console.log("add reached UserId: " + $scope.user_id + " comicId: " + $scope.comic_id + " comment: " + $scope.comment_obj.comment);
			GApi.execute("seriesendpoint",'addSeriesComment', {"userId": $scope.user_id, "seriesId":$scope.series_id, "comment":$scope.comment_obj.comment}).then(
				function(resp){
					$scope.update_comments();
					$scope.comment_obj.comment = "";
				},
				function(resp){
					
				}
			);
		}
		$scope.delete_comment = function(delete_id){
			//console.log("del reached UserId: " + $scope.user_id + " comicId: " + $scope.comic_id + " commentId: " + delete_id);
			GApi.execute("seriesendpoint", "deleteSeriesComment", {"userId": $scope.user_id, "seriesId": $scope.series_id, "commentId":delete_id}).then(
				function(resp){
					$scope.update_comments();
				},
				function(resp){
					
				}
			);
		}
		//USE THIS TO UPDATE COMMENTS, use getComic() ...get/update the comments
		$scope.update_comments = function(){
			GApi.execute("seriesendpoint", "getSeries", {"id":$scope.series_id}).then(
				function(resp){
					$scope.series = resp;
					if($scope.series.comments != null){	
						//query for each comment
						$scope.comments = [];
						for(var i = 0; i < $scope.series.comments.length; i ++){
							GApi.execute("commentendpoint", "getComment", {"id":$scope.series.comments[i]}).then(
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
				},
				function(){
					
				}
			);
		};
		$scope.toggleComments = function(comic){
			//open a thing with whatever comments.
			$scope.show_comment = !$scope.show_comment;
		}
		$scope.closeComments = function(){
			$scope.show_comment = false;
		}
		//END COMMENT FUNCTIONS
		
		
		//SUBSCRIBING FUNCTIONS 
		//check if user is logged in and subbed
		$scope.update_sub = function() {GAuth.checkAuth().then(
				function(){
					$scope.logged_in = true;
					$scope.user_id = GData.getUser().id;
					if($scope.series.authorId == $scope.user_id){
						//console.log("Comic Author ID: " + $scope.series.authorId);
						//console.log("User ID: " + $scope.user_id);
						$scope.is_owner = true;
					}
					else {
						$scope.is_owner = false;
					}
					GApi.execute("seriesendpoint", "getSeries", {"id":$scope.series_id}).then(
						function(resp){
							$scope.series = resp;
							if($scope.series.subscribers == null){
								$scope.subbed = false;
							}
							else {
								if($scope.series.subscribers.indexOf($scope.user_id.toString()) >= 0){
									$scope.subbed = true;
								}
								else{
									$scope.subbed = false;
								} 
							}
						},
						function(resp){	
						}
					);
				},
				function(){
					$scope.logged_in = false;
					$scope.user_id = null;
				}
			);
			//$scope.is_owner = false;
		};
		$scope.subscribe = function(){
			GApi.execute("c4userendpoint", "addsubscription", {"userId": $scope.user_id, "seriesId": $scope.series_id}).then(
				function(resp){
					$scope.update_sub();
					//$scope.subbed = true;
				},
				function(resp){
					
				}
			);
		};
		$scope.unsubscribe = function(){
			GApi.execute("c4userendpoint", "deletesubscription", {"userId": $scope.user_id, "seriesId": $scope.series_id}).then(
				function(resp){
					$scope.update_sub();
					//$scope.subbed = false;
				},
				function(resp){
					
				}
			);
		};
		//END SUBSCRIBING FUNCTIONS 
		
		//FAVORITE FUNCTION 
		//check if user is logged in and followed
		$scope.update_favorite = function() {GAuth.checkAuth().then(
				function(){
					$scope.logged_in = true;
					$scope.user_id = GData.getUser().id;
					if($scope.series.authorId == $scope.user_id){
						//console.log("Comic Author ID: " + $scope.series.authorId);
						//console.log("User ID: " + $scope.user_id);
						$scope.is_owner = true;
					}
					else {
						$scope.is_owner = false;
					}
					//update user
					GApi.execute("c4userendpoint", "getC4User", {"id":$scope.user_id}).then(
						function(resp){
							$scope.user = resp;
							if($scope.user.favoriteSeries == null){
								$scope.faved = false;
							}
							else {
								if($scope.user.favoriteSeries.indexOf($scope.series_id.toString()) >= 0){
									$scope.faved = true;
								}
								else{
									$scope.faved = false;
								} 
							}
						},
						function(resp){	
						}
					);
				},
				function(){
					$scope.logged_in = false;
					$scope.user_id = null;
				}
			);
			//$scope.is_owner = false;
		};
		$scope.fav = function(){
			GApi.execute("c4userendpoint", "addfavorite", {"userId": $scope.user_id, "seriesId": $scope.series_id}).then(
				function(resp){
					$scope.update_favorite();
					//$scope.subbed = true;
				},
				function(resp){
					
				}
			);
		};
		$scope.unfav = function(){
			GApi.execute("c4userendpoint", "deletefavorite", {"userId": $scope.user_id, "seriesId": $scope.series_id}).then(
				function(resp){
					$scope.update_favorite();
					//$scope.subbed = false;
				},
				function(resp){
					
				}
			);
		};
		//END FAVORITE FUNCTION 
		
		
		
		
		
		
		//Init Query. execute using (endpoint, method for endpoint, parameter for method)
		GApi.execute("seriesendpoint", "getSeries", {"id":$scope.series_id}).then(
			function(resp){
				$scope.series = resp;
				//query for author name
				GApi.execute( "c4userendpoint","getC4User", {"id":$scope.series.authorId}).then(
					function(resp1){
						$scope.author_name = resp1.username;
					},
					function(resp1){	
					}
				);
				//query for comics
				if($scope.series.comics == null || $scope.series.comics.length == 0){
					console.log("no comics");
				} else{
					//query for comics_ids 
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
				//query for comments 
				$scope.update_comments();
				$scope.update_favorite();
				//user as in the one who is currently browsing this page
				$scope.user_id = 0;
				
				$scope.update_sub();
				
			},function(resp){
				console.log("Error getting series.");
				console.log(resp);
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
		$scope.goToComics = function(id){
			if(id == null){
				$state.go("error");
			}
			else{
				$state.go("comic", {"id": id});
			}
		}
		$scope.goToEditComics = function(id){
			if(id == null){
				$state.go("error");
			}
			else{
				$state.go("editComic", {"id": id});
			}
		}
		$scope.newComics = function(){
			if($scope.is_owner){
				//console.log("seriesID: " + $scope.series_id);
				GApi.execute("comicendpoint","insertComic", {"authorId":$scope.user_id, "description":"New comics description", "seriesId": $scope.series_id}).then(
					function(resp){
						//add the new comic
						GApi.execute("seriesendpoint", "addseriescomic", {"seriesId" : $scope.series_id,"comicId" : resp.id}).then(
							function(resp1){
								$scope.goToEditComics(resp.id);
							},
							function(resp1){
								console.log("SEVERE ERROR: Series not associated with user.")
							}
						);
					}, function(resp){
						console.log("Failed to create new series.");
						console.log(resp);
					}
				);
			} else {
				console.log("Not logged in as owner, cannot add new comic.");
			}
		}
}]);
})();
