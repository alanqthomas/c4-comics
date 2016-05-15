 "use strict";
(function() {
	angular.module('c4').controller('profileCtrl', ['$scope', '$http', 'GApi', 'GAuth', 'GData', '$stateParams', "$state", 'imgService', 'IMG_PREFIXES', '$cookies',
	                                        function($scope,   $http,   GApi,   GAuth,   GData,   $stateParams,   $state,  imgService,   IMG_PREFIXES, $cookies){
		//infinite scrolling functions
		$scope.series_loadMore = function() {
			//pushes images to the array. load more
			if ($scope.series_reserve.length > 0){
				$scope.series.push($scope.series_reserve.shift());
			}
		};
		$scope.favorites_loadMore = function() {
			if ($scope.favorites_reserve.length > 0){
				$scope.favorites.push($scope.favorites_reserve.shift());
			}
		}
		$scope.subscriptions_loadMore = function(){
			if ($scope.subscriptions_reserve.length > 0){
				$scope.subscriptions.push($scope.subscriptions_reserve.shift());
			}
		}
		//main
		//init display settings
    $scope.editName = false;
		$scope.editBio = false;
		$scope.followed = false;
		$scope.faved = false;
		//set variables for getting users.
		$scope.profile_id = $stateParams.id;
    $scope.defaultPageImg = imgService.getURL(IMG_PREFIXES.PAGE, '123456');
    $scope.defaultCoverImg = 'https://storage.googleapis.com/c4-comics.appspot.com/default-series-bg?' + Date.now();
    console.log(imgService.getURLDecache(IMG_PREFIXES.USER_BG, $scope.profile_id));
		$scope.profileCoverImg = imgService.getURLDecache(IMG_PREFIXES.USER_BG, $scope.profile_id);
		if(GData.getUser() == null){
			$scope.is_owner = ($cookies.get('userId') == $scope.profile_id);
		} else {
			$scope.is_owner = (GData.getUser().id == $scope.profile_id);
		}
		$scope.profile = {
			username: "No Username Found",
			biography: "Write a biography here!",
			//all of the following are Ids
			userSeries: [],
			favoriteSeries: [],
			favoriteAuthors : [],
			favoriteComics: [],
			subscriptions: [],
			profileImageURL: 'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png'
		};

    $scope.$watch('coverImg', function(){
      $scope.upload($scope.coverImg);
    });
		//end main

		//display functions
    $scope.upload = function(file){
      $http({
        'method': 'POST',
        'url': imgService.getUploadURL(IMG_PREFIXES.USER_BG, $scope.user_id),
        headers:{
          'Content-type': file.type
        },
        data: file
      }).then(function(resp){
        console.log("New cover image uploaded");
        console.log(resp);
        $scope.profileCoverImg = imgService.getURLDecache(IMG_PREFIXES.USER_BG, $scope.profile_id);
      },function(resp){
        console.log("ERROR uploading cover image");
      });
    };

		function setCSS(){
			//$("#cover").css("background-image" , $scope.profile.bgImageURL);
			$(".cssHeader").css("color" , $scope.profile.cssHeadingColor);
			$("#bio").css("color" , $scope.profile.cssBiographyColor);
			$("#name").css("color" , $scope.profile.cssUsernameColor);
			$("#profPage").css("color" , $scope.profile.cssBGColor);
		}
		$scope.saveSettings= function(){//saves user
			$scope.newUser = {
				userID : $scope.profile_id,
				username :  $scope.profile.username,
				biography : $scope.profile.biography,
				cssBiographyColor : $scope.profile.cssBiographyColor,
				cssHeadingColor : $scope.profile.cssHeadingColor,
				cssUsernameColor : $scope.profile.cssUsernameColor,
				cssBGolor : $scope.profile.cssBackgroundColor
			};
			GApi.execute("c4userendpoint", "updateC4User", $scope.newUser).then(
				function(resp){
					$scope.updateUser();
				},
				function(resp){
					console.log("Error saving settigs to db.")
				}
			);
			setCSS();
		}
		$scope.toggle= function(toToggle){//toggle edit on an element
			if(toToggle == "editName"){
				if($scope.editName == true){
					$scope.saveSettings();
				}
				$scope.editName = !($scope.editName);
			}
			if(toToggle == "editBio"){
				if($scope.editBio == true){
					$scope.saveSettings();
				}
				$scope.editBio = !($scope.editBio);
			}
		}
		$scope.updateUser = function(){//
			GApi.execute("c4userendpoint", "getC4User",{"id":$scope.profile_id}).then(
				function(resp){
					$scope.profile.username = resp.username;
					$scope.profile.biography = resp.biography;
				}, function(resp){
				}
			);
		};

    $scope.updateName = function(value){
      var newUser = {
        'userID' : $scope.user_id,
        'username': value
      };
      GApi.execute("c4userendpoint", "updateC4User", newUser).then(
        function(resp){
          console.log("Username updated");
        }, function(resp){
          console.log("ERROR updating username")
      });

      return value;
    };

    $scope.updateBio = function(value){
      var newUser = {
        'userID' : $scope.user_id,
        'biography': value
      };
      GApi.execute("c4userendpoint", "updateC4User", newUser).then(
        function(resp){
          console.log("Biography updated");
        }, function(resp){
          console.log("ERROR updating biography")
      });

      return value;
    };



		//check if user is logged in and followed
		$scope.update_follow = function() {GAuth.checkAuth().then(
				function(){
					$scope.logged_in = true;
					$scope.user_id = GData.getUser().id;
					if($scope.profile_id == $scope.user_id){
						$scope.is_owner = true;
					}
					else {
						$scope.is_owner = false;
					}
					GApi.execute("c4userendpoint", "getC4User", {"id":$scope.profile_id}).then(
						function(resp){
							$scope.profile = resp;
							if($scope.profile.followers == null){
								$scope.followed = false;
							}
							else {
								if($scope.profile.followers.indexOf($scope.user_id.toString()) >= 0){
									$scope.followed = true;
								}
								else{
									$scope.followed = false;
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
		$scope.follow = function(){
			GApi.execute("c4userendpoint", "addfollow", {"userId": $scope.user_id, "authorId": $scope.profile_id}).then(
				function(resp){
					$scope.update_follow();
					//$scope.subbed = true;
				},
				function(resp){
					console.log("Error following.");
					console.log(resp);
				}
			);
		};
		$scope.unfollow = function(){
			GApi.execute("c4userendpoint", "deletefollow", {"userId": $scope.user_id, "authorId": $scope.profile_id}).then(
				function(resp){
					$scope.update_follow();
					//$scope.subbed = false;
				},
				function(resp){
					console.log("Error unfollowing.");
					console.log(resp);
				}
			);
		};
		//END FOLLOWING FUNCTIONS
		//FAVORITE FUNCTION
		//check if user is logged in and followed
		$scope.update_favorite = function() {GAuth.checkAuth().then(
				function(){
					$scope.logged_in = true;
					$scope.user_id = GData.getUser().id;
					if($scope.profile_id== $scope.user_id){
						$scope.is_owner = true;
					}
					else {
						$scope.is_owner = false;
					}
					//update user
					GApi.execute("c4userendpoint", "getC4User", {"id":$scope.user_id}).then(
						function(resp){
							$scope.user = resp;
							if($scope.user.favoriteAuthors == null){
								$scope.faved = false;
							}
							else {
								if($scope.user.favoriteAuthors.indexOf($scope.profile_id.toString()) >= 0){
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
			GApi.execute("c4userendpoint", "addfavorite", {"userId": $scope.user_id, "authorId": $scope.profile_id}).then(
				function(resp){
					$scope.update_favorite();
					//$scope.subbed = true;
				},
				function(resp){

				}
			);
		};
		$scope.unfav = function(){
			GApi.execute("c4userendpoint", "deletefavorite", {"userId": $scope.user_id, "authorId": $scope.profile_id}).then(
				function(resp){
					$scope.update_favorite();
					//$scope.subbed = false;
				},
				function(resp){

				}
			);
		};
		$scope.query_for_series = function() {
			//query for series
			if($scope.profile.userSeries != null){
				for(var i = 0;i < $scope.profile.userSeries.length; i ++){
					GApi.execute("seriesendpoint","getSeries", {"id":$scope.profile.userSeries[i]}).then(
						function(resp1){
							$scope.series_reserve.push({
								id:resp1.id,
								src: imgService.getURL(IMG_PREFIXES.SERIES, resp1.id),
								title:resp1.title,
								type:"series"
							});
						},
						function(resp1){
							console.log("Error loading a series.");
							console.log(resp1);
						}
					);
				}
				//put one in the initial
				if($scope.series_reserve.length > 0){
					$scope.series.push($scope.series_reserve.shift());
				}
			}
			//query for favorites series
			if($scope.profile.favoriteSeries != null){
				for(var i = 0;i < $scope.profile.favoriteSeries.length; i ++){
					GApi.execute("seriesendpoint","getSeries", {"id":$scope.profile.favoriteSeries[i]}).then(
						function(resp1){
							$scope.favorites_reserve.push({
								id:resp1.id,
								src: imgService.getURL(IMG_PREFIXES.SERIES, resp1.id),
								title:resp1.title,
								type:"series"
							});
						},
						function(resp1){
							console.log("Error loading a favorite series.");
							console.log(resp1);
						}
					);
				}
			}
			//query for favorites comics
			if($scope.profile.favoriteComics != null){
				for(var i = 0;i < $scope.profile.favoriteComics.length; i ++){
					GApi.execute("comicendpoint","getComic", {"id":$scope.profile.favoriteComics[i]}).then(
						function(resp1){
							$scope.favorites_reserve.push({
								id:resp1.id,
								src: imgService.getURL(IMG_PREFIXES.COMIC, resp1.id),
								title:resp1.title,
								type:"comic"
							});
						},
						function(){
							console.log("Error loading a favorite comic.");
							console.log(resp1);
						}
					);
				}
			}
			//query for favorites author
			if($scope.profile.favoriteAuthors != null){
				for(var i = 0;i < $scope.profile.favoriteAuthors.length; i ++){
					GApi.execute("c4userendpoint","getC4User", {"id":$scope.profile.favoriteAuthors[i]}).then(
						function(resp1){
							$scope.favorites_reserve.push({
								id:resp1.userID,
								src: imgService.getURL(IMG_PREFIXES.PROFILE, resp1.id),
								title:resp1.username,
								type:"profile"
							});
						},
						function(resp1){
							console.log("Error loading a favorite author.");
							console.log(resp1);
						}
					);
				}
			}
			//query for subscriptions
			if($scope.profile.subscriptions != null){
				for(var i = 0; i < $scope.profile.subscriptions.length; i++){
					GApi.execute("seriesendpoint", "getSeries", {"id": $scope.profile.subscriptions[i]}).then(
						function(resp1){
							$scope.subscriptions_reserve.push({
								id:resp1.id,
								src: imgService.getURL(IMG_PREFIXES.SERIES, resp1.id),
								title:resp1.title,
								type:"series"
							});
						},
						function(resp1){
							console.log("Error loading a subscription.");
							console.log(resp1);
						}
					);
				}
			}
			if($scope.favorites_reserve != null && $scope.favorites_reserve.length > 0){
				$scope.favorites.push($scope.favorites.shift());
			}
		}
		$scope.getProfile = function() {
			$scope.series = [];
			$scope.series_reserve = [];
			$scope.favorites=[];
			$scope.favorites_reserve = [];
			$scope.subscriptions = [];
			$scope.subscriptions_reserve = [];
			GApi.execute( "c4userendpoint","getC4User", {"id":$scope.profile_id}).then(
				function(resp){
					$scope.profile = resp;
					$scope.query_for_series();
					$scope.tabs = [];
					if($scope.is_owner || $scope.profile.userSeries.length){
						$scope.tabs.push({
							slug: 'series',
							title: "Series",
							content: $scope.series,
							load_m: $scope.series_loadMore
						});
					}
					if( ($scope.profile.favoriteSeries != null && $scope.profile.favoriteSeries.length > 0)
					 || ($scope.profile.favoriteAuthors != null && $scope.profile.favoriteAuthors.length > 0)
					 || ($scope.profile.favoriteComics != null && $scope.profile.favoriteComics.length > 0) ){
						$scope.tabs.push({
							slug: 'fav',
							title: "Favorites",
							content: $scope.favorites,
							load_m: $scope.favorites_loadMore
						});
					}
					if($scope.is_owner && ($scope.profile.subscriptions != null && ($scope.profile.subscriptions.length > 0) ) ){
						$scope.tabs.push({
							slug: 'sub',
							title: "Subscriptions",
							content: $scope.subscriptions,
							load_m: $scope.subscriptions_loadMore
						});
					}
					$scope.update_follow();
					$scope.update_favorite();
					setCSS();
				}, function(resp){
					console.log("Error getting user.");
					console.log(resp);
				}
			);
		};



		//set css.
		var bgStyleStr = '#ffffff no-repeat center center';
			//url('+buildImageURL("profilebg", $scope.profile_id)+')
		$scope.bgStyle = {'background': bgStyleStr};
		$scope.$apply;

		//functions to create series
		function createSeries(authorId){
			return {//might need to not be strings?
				authorId: authorId,
				title: "New Series",
				description: "Write a description of your series here!",
				cssTitleColor : "#000000",
				cssHeadingColor : "#000000",
				cssDescriptionColor : "#000000",
				cssBGColor : "#000000",
				bgImageURL : "https://storage.googleapis.com/c4-comics.appspot.com/series-bg",
				cssComicTitleColor : "#000000",
				cssComicTitleBGColor : "#000000",
				cssComicBGColor : "#000000"
			};
		}


		$scope.newSeries = function(){
			if($scope.is_owner){
				var param = createSeries($scope.profile_id);
				GApi.execute("seriesendpoint","insertSeries", param).then(
					function(resp){
						GApi.execute("c4userendpoint", "adduserseries", {"userId" : $scope.profile_id,"seriesId" : resp.id}).then(
							function(resp1){
								$scope.go_to_series(resp.id);
							},
							function(resp1){
								console.log("SEVERE ERROR: Series not associated with user.");
								console.log(resp);
							}
						);
					}, function(resp){
						console.log("Failed to create new series.");
						console.log(resp);
					}
				);
			}
		}



		//delete Functions: push delete and change local variable.
		//should make them use GData instead of $scope.profile, but this is good enough.
		$scope.deleteThing = function(tabSlug, obj){
			if(tabSlug =='fav'){
				deleteFav(obj);
			}else if(tabSlug =='sub'){
				deleteSub(obj);
			}else if(tabSlug =='series'){
 				deleteSeries(obj);
 			} else {
 				console.log("Attempted delete from unsupported tab. Add tab to deleteThing().");
 			}
		}

		function deleteFav(object){
			if($scope.is_owner){
				var paramName = object.type+"Id";
				var param = {
					"userId":$scope.profile_id,
					paramName: object.id
				};
				GApi.execute( "c4userendpoint","deletefavorite",param).then(
						function(resp){
							if(object.type == 'series'){
								$scope.profile.favoriteSeries.splice($scope.profile.favoriteSeries.indexOf(object), 1);
							} else if(object.type == 'profile'){
								$scope.profile.favoriteAuthors.splice($scope.profile.favoriteAuthors.indexOf(object), 1);
							} else if(object.type == 'comic'){
								$scope.profile.favoriteComics.splice($scope.profile.favoriteComics.indexOf(object), 1);
							} else {//error
								console.log("Invalid delete type.");
								console.log(object);
							}
						}, function(resp){
							console.log("Failed to delete favorite.");
							console.log(resp);
						}
					);
			}
		}
		function deleteSub(object){
			if($scope.is_owner){
				var paramName = object.type+"Id";
				var param = {
					"userId":$scope.profile_id,
					"seriesId" : object.id
				};
				GApi.execute( "c4userendpoint","deletesubscription",param).then(
						function(resp){
							//$scope.profile.subscriptions.splice($scope.profile.subscriptions.indexOf(object), 1);
							$scope.getProfile();
						}, function(resp){
							console.log("Failed to delete subscription.");
							console.log(resp);
						}
					);
			}
		}
		function deleteSeries(object){
			console.log(object);
			if($scope.is_owner){
				var paramName = object.type+"Id";
				var param = {
					"userId":$scope.profile_id,
					"seriesId" : object.id
				};
				GApi.execute("c4userendpoint", "deleteuserseries",param).then(
				//GApi.execute("c4userendpoint", "deleteseries",param).then(
						function(resp){
							//$scope.profile.userSeries.splice($scope.profile.userSeries.indexOf(object), 1);
							$scope.getProfile();
						}, function(resp){
							console.log("Failed to delete series.");
							console.log(resp);
						}
				);
			}
		}
		//navigation functions
		$scope.page_go = function(type, id){
			if(type == "series"){
				$scope.go_to_series(id);
			} else if(type == "profile"){
				$scope.go_to_profile(id);
			} else if(type == "comic"){
				$scope.go_to_comics(id);
			}
		}
		$scope.go_to_series = function(param_id){
			if(param_id==null){
				$state.go('error');
			}
			else{
				$state.go('series',{"id": param_id});
			}
		}
		$scope.go_to_profile=function(param_id){
			if(param_id==null){
				$state.go('error');
			}
			else{
				$state.go('profile',{"id": param_id});
			}
		}
		$scope.go_to_comics=function(param_id){
			if(param_id==null){
				$state.go("error");
			}
			else{
				$state.go("comic",{"id":param_id});
			}
		}
		//main
		$scope.getProfile();
	}]);
})();
