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
		$scope.series_id = $stateParams.id;
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
		$scope.show_comment = false;
		//THIS MUST BE AN OBJECT. according to angular api, best practice with
		//ng-model is using "."
		$scope.comment_obj = {comment: ""};
		$scope.faved = false;

		$scope.defaultPageImg = imgService.getURL(IMG_PREFIXES.PAGE, '123456');
		$scope.defaultCoverImg = 'https://storage.googleapis.com/c4-comics.appspot.com/default-series-bg';
		$scope.coverImgURL = imgService.getURLDecache(IMG_PREFIXES.SERIES, $scope.series_id);

		//End init
		//Display functions

		$scope.$watch('coverImg', function(){
			$scope.upload($scope.coverImg);
		});

		$scope.upload = function(file){
			if(file != null){
				$http({
					'method': 'POST',
					'url': imgService.getUploadURL(IMG_PREFIXES.SERIES, $scope.series_id),
					'headers':{
						'Content-Type': file.type
					},
					data: file
				}).then(function(resp){
					console.log("New cover image uploaded");
					$scope.coverImgURL = imgService.getURLDecache(IMG_PREFIXES.SERIES, $scope.series_id);
				}, function(resp){
					console.log("ERROR uploading cover image");
				});
			}else{
				console.log("Attempted to load img with null id.");
			}
		};
		$scope.saveSettings= function(){
			$scope.newSeries= {
				id: $scope.series_id,
				title: $scope.series.title,
				description: $scope.series.description,
				cssTitleColor : $scope.series.cssTitleColor,
				cssHeadingColor : $scope.series.cssHeadingColor,
				cssDescriptionColor : $scope.series.cssDescriptionColor,
				cssBGColor : $scope.series.cssBGColor,
				bgImageURL : $scope.series.bgImageURL,
				cssComicTitleColor : $scope.series.cssComicTitleColor,
				cssComicTitleBGColor : $scope.series.cssComicTitleBGColor,
				cssComicBGColor : $scope.series.cssComicTitleBGColor
			};
			GApi.execute("seriesendpoint", "updateSeries", $scope.newSeries).then(
				function(resp){
					$scope.loadSeries();
				},
				function(resp){
					console.log("Error saving settings to db.");
				}
			);
			//setCSS();
		};
		$scope.updateTitle = function(value){
			var newSeries = {
			  'id': $scope.series_id,
			  'title': value
			};

			GApi.execute("seriesendpoint", "updateSeries", newSeries).then(
			  function(resp){
				console.log("Title updated");
			  }, function(resp){
				console.log("ERROR updating series title");
			  }
			);

			return value;
		};
		$scope.updateDescription = function(value){
		  var newSeries = {
			'id': $scope.series_id,
			'description' : value
		  };
		  GApi.execute("seriesendpoint", "updateSeries", newSeries).then(
			function(resp){
			  console.log("Description updated");
			}, function(resp){
			  console.log("ERROR updating series description");
			});

		  return value;
		};
		$scope.hoverIn = function(){
			this.hoverEdit = true;
		};
		$scope.hoverOut = function(){
			this.hoverEdit = false;
		}
		//end display functions
		$scope.loadMore = function() {
			if($scope.comics_reserve.length >0 ){
				$scope.comics.push($scope.comics_reserve.shift());
			}
		}
		$scope.getFirstPageURL = function(id){
			return imgService.getURL(IMG_PREFIXES.PAGE, id);
		}
		function setAuth(){
			GAuth.checkAuth().then(
				function(){
					$scope.logged_in = true;
					$scope.user_id = GData.getUser().id;
					if($scope.series.authorId == $scope.user_id){
						$scope.is_owner = true;
					}	else {
						$scope.is_owner = false;
					}
				},
				function(){
					$scope.logged_in = false;
					$scope.user_id = null;
					$scope.is_owner = false;
				}
			);
		}
		$scope.loadSeries = function(){
			GApi.execute("seriesendpoint", "getSeries",{"id":$scope.series_id}).then(
				function(resp){
					$scope.series.title = resp.title;
					$scope.series.description = resp.description;
				}, function(resp){
					console.log("Error loading settings from db.");
				}
			);
		};
		//COMMENT FUNCTIONS
		$scope.add_comment = function(){
			//console.log("add reached UserId: " + $scope.user_id + " comicId: " + $scope.comic_id + " comment: " + $scope.comment_obj.comment);
			GApi.execute("seriesendpoint",'addSeriesComment', {"userId": $scope.user_id, "seriesId":$scope.series_id, "comment":$scope.comment_obj.comment}).then(
				function(resp){
					$scope.update_comments();
					$scope.comment_obj.comment = "";
				},
				function(resp){
					console.log("Error adding comment.");
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
					console.log("Error deleting comment.");
				}
			);
		}
		//USE THIS TO UPDATE COMMENTS, use getComic() ...get/update the comments
		$scope.update_comments = function(){
			GApi.execute("seriesendpoint", "getSeries", {"id":$scope.series_id}).then(
				function(resp){
					$scope.series = resp;
					$scope.comments = [];
					if($scope.series.comments != null){
						//query for each comment

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
											console.log("Error getting comment author.");
										}
									);
								},
								function(commentResp){
									console.log("Error getting comment.");
								}
							);
						}
					}
				},
				function(){
					console.log("Error getting series.");
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
		$scope.update_sub = function() {
			GAuth.checkAuth().then(
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
							console.log("Error updating subscription.")
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
					console.log("Error subscribing.");
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
					console.log("Error unsubscribing.");
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
		console.log(resp);
				$scope.series = resp;
		setAuth();
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
				//setCSS();
			},function(resp){
				console.log("Error getting series.");
				console.log(resp);
			}
		);

		$scope.goToAuthor=function(){
			if($scope.series.authorId==null){
				$state.go('error');
			}
			else{
				$state.go('profile',{"id": $scope.series.authorId});
			}
		}
		$scope.goToComic = function(id){
			if(id == null){
				$state.go("error");
			}
			else if($scope.is_owner){
				$state.go("editComic", {"id": id});
			} else {
				$state.go("comic", {"id": id});
			}
		}

		$scope.newComic = function(){
			if($scope.is_owner){
				//console.log("seriesID: " + $scope.series_id);
				GApi.execute("comicendpoint","insertComic", {"authorId":$scope.user_id, "title": "Untitled", "description":"Add a description", "seriesId": $scope.series_id}).then(
					function(resp){
						//add the new comic
						GApi.execute("seriesendpoint", "addseriescomic", {"seriesId" : $scope.series_id,"comicId" : resp.id}).then(
							function(resp1){
								$scope.goToComic(resp.id);
							},
							function(resp1){
								console.log("SEVERE ERROR: Comic not associated with user.")
							}
						);
					}, function(resp){
						console.log("Failed to create new comic.");
						console.log(resp);
					}
				);
			} else {
				console.log("Not logged in as owner, cannot add new comic.");
			}
		}
}]);
})();
