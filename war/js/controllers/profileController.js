"use strict";
(function() {
	angular.module('c4').controller('profileCtrl', ['$scope', '$http', 'GApi', 'GAuth', 'GData', '$stateParams', "$state", 
	                                        function($scope,   $http,   GApi,   GAuth,   GData,   $stateParams,   $state){
		
		
		
		//THIS MUST BE BEFORE Tab is created
		$scope.series_loadMore = function() {
			//pushes images to the array. load more
			if ($scope.series_reserves.length > 0){
				$scope.series.push($scope.series_reserves.shift());
			}
		};
		$scope.favorites_loadMore = function() {
			if ($scope.favorites_reserved.length > 0){
				$scope.favorites.push($scope.favorites_reserved.shift());
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
			src: 'http://downloadicons.net/sites/default/files/favorite-icon-47070.png',
		    type:"comic",
			id:26}];
		
		$scope.series_reserves = [{
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
		
		$scope.favorites_reserved=[{
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
		//initalize and query for profileEndpoints
		$scope.profile_id = $stateParams.id;
		GApi.execute( "c4userendpoint","getC4User", {"id":$scope.profile_id} ).then(
			function(resp){	
				console.log(resp);
				$scope.name = resp.username;
				$scope.bio = resp.biography;
				$scope.series_id = resp.userSeries;
				//favorite series
				$scope.favorites_series_id = resp.favoriteSeries;
				//favorite author
				$scope.favorites_author_id = resp.favoriteAuthors;
				//favorite comics
				$scope.favorites_comics_id = resp.favoriteComics;
			}, function(resp){
				console.log("error no user found for url ID");
				$scope.name = "No User Found For This ID";
				$scope.bio = "Write a biography here!";
				$scope.series_id = [];
				$scope.favorites_id = [];
			}
		);
		//TAKE OUT THE FOLLOWING COMMMENT TO TAKE OUT PLACEHOLDER
		//$scope.series = [];
		//$scope.favorites=[];
		
		if($scope.series_id == null){
			console.log("no series")
		}
		else{
			for(var i = 0;i < $scope.series_id.length; i ++){
				GApi.execute("seriesendpoint","getSeries", {"id":$scope.series_id[i]}).then(
					function(){
						$scope.series_reserve.push({
							id:resp.id,
							//url:buildImageURL("series", resp.id),
							title:resp.title,
							type:"series"
						});
					},
					function(){
						console.log("no series found for "+$scope.series_id[i]);
					}
				);
				//put one in the initial
				if($scope.series_reserve.length > 0){
					$scope.series.push($scope.series_reserve.shift());
				}
			}
		}
		//query for favorites series
		if($scope.favorites_series_id == null){
			console.log("no favorites series");
		}
		else{
			for(var i = 0;i < $scope.favorite_series_id.length; i ++){
				GApi.execute("seriesendpoint","getSeries", {"id":$scope.favorites_series_id[i]}).then(
					function(){
						$scope.favorites_reserve.push({
							id:resp.id,
							//url:buildImageURL("series", resp.id),
							title:resp.title,
							type:"series"
						});
					},
					function(){
						console.log("no series found for "+$scope.favorites_series_id[i]);
					}
				);
			}
		}	
		//query for favorites comics
		if($scope.favorites_comics_id == null){
			console.log("no favorites comics");
		}
		else{
			for(var i = 0;i < $scope.favorite_comics_id.length; i ++){
				GApi.execute("comicendpoint","getComic", {"id":$scope.favorites_comics_id[i]}).then(
					function(){
						$scope.favorites_reserve.push({
							id:resp.id,
							//url:buildImageURL("comic", resp.id),
							title:resp.title,
							type:"comic"
						});
					},
					function(){
						console.log("no comics found for "+$scope.favorites_comics_id[i]);
					}
				);
			}
		}
		//query for favorites author
		if($scope.favorites_author_id == null){
			console.log("no favorites author");
		}
		else{
			for(var i = 0;i < $scope.favorite_author_id.length; i ++){
				GApi.execute("c4userendpoint","getC4User", {"id":$scope.favorites_author_id[i]}).then(
					function(){
						$scope.favorites_reserve.push({
							id:resp.id,
							//url:buildImageURL("profile", resp.id),
							title:resp.username,
							type:"profile"
						});
					},
					function(){
						console.log("no comics found for "+$scope.favorites_comics_id[i]);
					}
				);
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
		/*
		var bgStyleStr = '#ffffff url('+buildImageURL("profilebg", $scope.profile_id)+') no-repeat center center';
		$scope.bgStyle = {'background': bgStyleStr};
		$scope.$apply;
		
		$scope.newSeries = function(){
			if($scope.isOwner){
				var param = createSeries($scope.profile_id);
				GApi.execute( "seriesendpoint","insertSeries", param).then(
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
		}*/
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


