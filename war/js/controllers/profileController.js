 "use strict";
(function() {
	angular.module('c4').controller('profileCtrl', ['$scope', '$http', 'GApi', 'GAuth', 'GData', '$stateParams', "$state", 'imgService', 'IMG_PREFIXES',
	                                        function($scope,   $http,   GApi,   GAuth,   GData,   $stateParams,   $state,  imgService,   IMG_PREFIXES){
		//THIS MUST BE BEFORE Tab is created
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
		//init display settings
		$scope.editName = false;
		$scope.editBio = false;
		//initalize and query for profileEndpoints
		$scope.profile_id = $stateParams.id;
		$scope.followed = false;
		$scope.faved = false;
		
		
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
		
		$scope.series = [];
		$scope.series_reserve = [];
		$scope.favorites=[];
		$scope.favorites_reserve = [];
		$scope.subscriptions = [];
		$scope.subscriptions_reserve = [];
		//INIT QUERY FOR PROFILE 
		$scope.getProfile = function() {GApi.execute( "c4userendpoint","getC4User", {"id":$scope.profile_id}).then(
				function(resp){	
					$scope.profile = resp;
					$scope.query_for_series();
					$scope.tabs = [];
					if($scope.profile.userSeries.length > 0 || $scope.is_owner){
						$scope.tabs.push({
							slug: 'series',
							title: "Series",
							content: $scope.series,
							load_m: $scope.series_loadMore
						});
					}
					if($scope.profile.favoriteSeries.length > 0 || $scope.profile.favoriteAuthors.length > 0 ||  $scope.profile.favoriteComics.length > 0 ||$scope.is_owner){
						$scope.tabs.push({
							slug: 'fav',
							title: "Favorites",
							content: $scope.favorites,
							load_m: $scope.favorites_loadMore
						});
					}
					if($scope.is_owner){
						$scope.tabs.push({
							slug: 'sub',
							title: "Subscription",
							content: $scope.subscriptions,
							load_m: $scope.subscriptions_loadMore
						});
					}
					$scope.update_follow();
					$scope.update_favorite();
				}, function(resp){
				}
			);
		};
		$scope.getProfile();
		//END INIT 
		//EDIT PROFILE FUNCTIONS 
		$scope.saveSettings= function(){
			$scope.newUser = {
				userID: $scope.profile_id,
				username: $scope.profile.username,
				biography: $scope.profile.biography
			};
			GApi.execute("c4userendpoint", "updateC4User", $scope.newUser).then(
				function(resp){
					$scope.updateUser();
				},
				function(resp){
					
				}
			);
			
		}
		//toggle edit
		$scope.toggle= function(toToggle){
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
		$scope.updateUser = function(){
			GApi.execute("c4userendpoint", "getC4User",{"id":$scope.profile_id}).then(
				function(resp){	
					$scope.profile.username = resp.username;
					$scope.profile.biography = resp.biography;
				}, function(resp){
				}
			);
		};
		//END OF EDIT FUNCTIONS
		//FOLLOWING FUNCTIONS 
		//check if user is logged in and followed
		$scope.update_follow = function() {GAuth.checkAuth().then(
				function(){
					$scope.logged_in = true;
					$scope.user_id = GData.getUser().id;
					if($scope.profile_id== $scope.user_id){
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
		//END FAVORITE FUNCTION 
		
		//Querying for series 
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
							
						}
					);
				}
			}
		}
		if($scope.favorites_reserve != null && $scope.favorites_reserve.length > 0){
			$scope.favorites.push($scope.favorites.shift());
		}
		//owner boolean
		if(GData.getUser() == null){
			$scope.is_owner = false;
		} else {
			$scope.is_owner = (GData.getUser().id == $stateParams.id);
		}
		
		//set css.
		var bgStyleStr = '#ffffff no-repeat center center';
			//url('+buildImageURL("profilebg", $scope.profile_id)+') 
		$scope.bgStyle = {'background': bgStyleStr};
		$scope.$apply;

		//functions to create series 
		function createSeries(authorId){
			return {
				authorId: authorId,
				description: "Write a description here!"
			}
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
			}else if(tabSlug=='sub'){
				deleteSub(obj);
			}else if(tabSlug=='series'){
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
					paramName: object.id
				};
				GApi.execute( "c4userendpoint","deletesubscription",param).then(
						function(resp){	
							$scope.profile.subscriptions.splice($scope.profile.subscriptions.indexOf(object), 1);
						}, function(resp){
							console.log("Failed to delete subscription.");
							console.log(resp);
						}
					);
			}
		}
		function deleteSeries(object){
			if($scope.is_owner){
				var paramName = object.type+"Id";
				var param = {
					"userId":$scope.profile_id, 
					paramName: object.id
				};
				GApi.execute( "c4userendpoint","deleteseries",param).then(
						function(resp){	
							$scope.profile.userSeries.splice($scope.profile.userSeries.indexOf(object), 1);
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
	
	}]);
})();


