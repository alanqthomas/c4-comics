"use strict";
(function() {
angular.module('c4').controller('profileCtrl', ['$scope', '$http', 'GApi', 'GAuth', 'GData', '$stateParams', "$state",
                                    function(	 $scope,   $http,  GApi, 	GAuth, 	GData,	 $stateParams,   $state){
		//PLACE HOLDERS
		//this is image url for initial display
		$scope.series = [{
			title:"series1",
		    src:'http://media.salon.com/2014/10/archie_comics.jpg',
		    id:1}];
		$scope.favorites = [{
			title:"fav0",
			src: 'http://downloadicons.net/sites/default/files/favorite-icon-47070.png',
			id:26}];
		
		//this is added for infinite scroll
		$scope.series_reserves = [{
			title:"series2",
			url:"http://cpassets-a.akamaihd.net/images/comic/original/126_lrg-en.gif",
			id:2
		},{
			title:"series3",
			url: "http://nerdist.com/wp-content/uploads/2014/12/BongoSimpsons-1.jpg",
			id:3
		},{
			title:"series4",
			url: "http://www.jinxthemonkey.com/comics/comic_img/comic04-color.jpg",
			id:4
		},{
			title:"series5",
			url:"http://www.readcomics.net/images/manga/the-bunker/15/1.jpg",
			id:5
		},{
			title:"series6",
			url:"http://www.readcomics.net/images/manga/the-bunker/15/2.jpg",
			id:6
		},{
			title:"series7",
			url:"http://www.readcomics.net/images/manga/the-bunker/15/3.jpg",
			id:7
		},{
			title:"series8",
			src:"http://www.readcomics.net/images/manga/the-bunker/15/21.jpg",
			id:25
		}];
		$scope.favorites_reserved=[{
			title:"fav1",
			src:'http://www.simchatyisrael.org/wp-content/uploads/2015/08/follow-me.jpg',
			id:27
      	},{
      		title:"fav2",
      		src:" http://www.readcomics.net/images/manga/deadpool-2016/1/1.jpg",
      		id:28
      	},{
      		title:"fav3",
      		src:"http://www.readcomics.net/images/manga/deadpool-2016/1/2.jpg",
      		id:29
      	},{
      		title:"fav4",
      		src: "http://www.readcomics.net/images/manga/deadpool-2016/1/3.jpg",
      		id: 30
      	}];
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
		//for the images, the url is created by buildImageURL(id, type);
		//take out following comment to take out placeholder
		//$scope.series = [];
		//$scope.favorites=[];
		if($scope.series_id == null){
			console.log("no series")
		}
		else{
			for(var i = 0;i < $scope.series_id.length; i ++){
				GApi.execute("seriesendpoint","getSeries", {"id":$scope.series_id[i]}).then(
					function(){$scope.series_reserve.push({
							id:resp.id,
							url:buildImageURL("series", resp.id),
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
					function(){$scope.favorites_reserve.push({
							id:resp.id,
							url:buildImageURL("series", resp.id),
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
					function(){$scope.favorites_reserve.push({
							id:resp.id,
							url:buildImageURL("comic", resp.id),
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
					function(){$scope.favorites_reserve.push({
							id:resp.id,
							url:buildImageURL("profile", resp.id),
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
		$scope.isOwner = (scope.userId == $stateParams.id)
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
		$scope.series_loadMore = function(parameter1) {
			//pushes images to the array. load more
			if ($scope.series_reserves.length > 0){
				for(var i = 1; i <= 1; i++) {
					var image = $scope.series_reserves.shift();
					$scope.series.push(image);
				}
			}
			if ($scope.favorites_reserved.length > 0){
				for(var i = 1; i <= 1; i++) {
					var image = $scope.favorites_reserved.shift();
					$scope.favorites.push(image);
				}
			}
		};
		/*
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
		*/
		
		$scope.$apply;
		$scope.newSeries = function(){
			//call seriesEndpoint, insert new one, get the id back.
			if(param_id==null){
				$state.go('error');
			}
			else{
				$state.go('series',{"id": param_id});
			}
		}
		$scope.deleteFav = function(){
			//prompt confirm?
			//endpoint delete fav call.
		}
		$scope.go_to_series=function(param_id){
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
	}]);
});


