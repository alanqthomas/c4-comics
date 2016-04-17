"use strict";
(function() {
	angular.module('c4').controller('profileCtrl', ['$scope', '$http', 'GApi', 'GAuth', 'GData', '$stateParams', "$state", 
	                                        function($scope,   $http,   GApi,   GAuth,   GData,   $stateParams,   $state){
		//TODO Link Profile to SERIES
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
		//PLACE HOLDERS
		//*****************************
		//this is image url for initial display
		$scope.series = [{
			title:"series1",
		    src:'http://media.salon.com/2014/10/archie_comics.jpg',
		    type:"series",
		    id:1}
		];
		$scope.favorites = [{
			title:"fav0",
			src: 'https://pixabay.com/static/uploads/photo/2013/07/12/19/27/favorite-154801_960_720.png',
		    type:"comic",
			id:26}];
		$scope.series_reserve = [{
			title:"series2",
			src:"http://www.readcomics.net/images/manga/the-bunker/15/21.jpg",
			type: "series",
			id:20
		},{
			title:"series3",
			src:"http://www.readcomics.net/images/manga/the-bunker/15/22.jpg",
			type: "series",
			id:21
		},{
			title:"series4",
			src:"http://www.readcomics.net/images/manga/the-bunker/15/23.jpg",
			type: "series",
			id:22
		},{
			title:"series5",
			src:"http://www.readcomics.net/images/manga/the-bunker/15/24.jpg",
			type: "series",
			id:23
		}];
		$scope.favorites_reserve=[{
			title:"fav1",
			src:'http://www.simchatyisrael.org/wp-content/uploads/2015/08/follow-me.jpg',
		    type:"series",
			id:27
      	},{
      		title:"fav2",
      		src:" http://www.readcomics.net/images/manga/deadpool-2016/1/1.jpg",
		    type:"series",
      		id:28
      	},{
      		title:"fav3",
      		src:"http://www.readcomics.net/images/manga/deadpool-2016/1/2.jpg",
		    type:"series",
      		id:29
      	},{
      		title:"fav4",
      		src: "http://www.readcomics.net/images/manga/deadpool-2016/1/3.jpg",
		    type:"series",
      		id: 30
      	}];
		//*********************** PLACEHOLDER END
		
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
		//TAKE OUT THE FOLLOWING COMMMENT TO TAKE OUT PLACEHOLDER
		/*$scope.series = [];
		$scope.series_reserve = [];
		$scope.favorites=[];
		$scope.favorites_reserve = [];*/
		
		$scope.subscriptions = [];
		$scope.subscriptions_reserve = [];
		//initalize and query for profileEndpoints
		$scope.profile_id = $stateParams.id;
		GApi.execute( "c4userendpoint","getC4User", {"id":$scope.profile_id}).then(
			function(resp){	
				console.log(resp);
				$scope.profile = resp;
				console.log($scope.profile.profileImageURL);
				//queries for series
				$scope.query_for_series();
			}, function(resp){
				
			}
		);
		
		
		
		
		
		$scope.query_for_series = function() {
			//query for series
			if($scope.profile.userSeries == null){
				console.log("no user series")
			}
			else{
				for(var i = 0;i < $scope.profile.userSeries.length; i ++){
					GApi.execute("seriesendpoint","getSeries", {"id":$scope.profile.userSeries[i]}).then(
						function(resp1){
							$scope.series_reserve.push({
								id:resp1.id,
								//url:buildImageURL("series", resp.id),
								title:resp1.title,
								type:"series"
							});
						},
						function(resp1){
						}
					);
					//put one in the initial
					if($scope.series_reserve.length > 0){
						$scope.series.push($scope.series_reserve.shift());
					}
				}
			}
			//query for favorites series
			if($scope.profile.favoriteSeries == null){
				console.log("no favorites series");
			}
			else{
				for(var i = 0;i < $scope.profile.favoriteSeries.length; i ++){
					GApi.execute("seriesendpoint","getSeries", {"id":$scope.profile.favoriteSeries[i]}).then(
						function(resp1){
							$scope.favorites_reserve.push({
								id:resp1.id,
								//url:buildImageURL("series", resp.id),
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
			if($scope.profile.favoriteComics == null){
				console.log("no favorites comics");
			}
			else{
				for(var i = 0;i < $scope.profile.favoriteComics.length; i ++){
					GApi.execute("comicendpoint","getComic", {"id":$scope.profile.favoriteComics[i]}).then(
						function(resp1){
							$scope.favorites_reserve.push({
								id:resp1.id,
								//url:buildImageURL("comic", resp.id),
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
			if($scope.profile.favoriteAuthors == null){
				console.log("no favorites author");
			}
			else{
				for(var i = 0;i < $scope.profile.favoriteAuthors.length; i ++){
					GApi.execute("c4userendpoint","getC4User", {"id":$scope.profile.favoriteAuthors[i]}).then(
						function(resp1){
							$scope.favorites_reserve.push({
								id:resp1.id,
								//url:buildImageURL("profile", resp.id),
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
			if($scope.profile.subscriptions == null){
				console.log("no subscriptions");
			}
			else {
				for(var i = 0; i < $scope.profile.subscriptions.length; i++){
					GApi.execute("seriesendpoint", "getSeries", {"id": $scope.profile.subscriptions[i]}).then(
						function(resp1){
							$scope.subscriptions_reserve.push({
								id:resp1.id,
								//url:buildImageURL("series", resp.id),
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
			$scope.isOwner = false;
		} else {
			$scope.isOwner = (GData.getUser().id == $stateParams.id);
		}
		
		//set css.

		var bgStyleStr = '#ffffff no-repeat center center';
			//url('+buildImageURL("profilebg", $scope.profile_id)+') 
		$scope.bgStyle = {'background': bgStyleStr};
		$scope.$apply;
		
		$scope.newSeries = function(){
			if($scope.isOwner){
				var param = createSeries($scope.profile_id);
				GApi.execute("seriesendpoint","insertSeries", param).then(
					function(resp){	
						$scope.go_to_series(resp.id);
					}, function(resp){
						console.log("Failed to create new series.");
						console.log(resp);
					}
				);
			}
		}
		//push delete and change local variable.
		$scope.deleteFav = function(object){
			if($scope.isOwner){
				var paramName = object.type+"Id";
				var param = {"userId":$scope.profile_id, 
						paramName: object.id}
				GApi.execute( "c4userendpoint","deletefavorite",param).then(
						function(resp){	
							$scope.favorites.splice($scope.favorites.indexOf(object), 1);
						}, function(resp){
							console.log("Failed to delete favorite.");
							console.log(resp);
						}
					);
			}
		}
		//SHOULD IDEALLY BE THE LAST THING IN THE CONTROLLER
		//add tab if content or owner
		$scope.tabs = [];
		if($scope.series.length > 0 || $scope.isOwner){
			$scope.tabs.push({
				slug: 'series',
		        title: "Series",
		        content: $scope.series,
		        load_m: $scope.series_loadMore
			});
		}
		if($scope.favorites.length > 0 || $scope.isOwner){
			$scope.tabs.push({
				slug: 'fav',
		        title: "Favorites",
		        content: $scope.favorites,
		        load_m: $scope.favorites_loadMore
			});
		}
		if($scope.isOwner){
			$scope.tabs.push({
				slug: 'sub',
				title: "Subscription",
				content: $scope.subscriptions,
				load_m: $scope.subscriptions_loadMore
			});
		}
		
		
		
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


