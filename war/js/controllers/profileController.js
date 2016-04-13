"use strict";
(function() {
//angular.module('c4', ['ngAnimate', 'ui.bootstrap']);
angular.module('c4').controller('profileCtrl', ['$scope', '$http', 'GApi', 'GAuth', 'GData', '$stateParams', "$state",
                                    function(	 $scope,   $http,  GApi, 	GAuth, 	GData,	 $stateParams,   $state){	
		//PLACE HOLDERS
		//this is image url for initial display
		$scope.series = [{
		                  src:'http://media.salon.com/2014/10/archie_comics.jpg',
		                  id:1}];
		$scope.favorites = [{
							src: 'http://downloadicons.net/sites/default/files/favorite-icon-47070.png',
							id:26}];
		
		//this is added for infinite scroll
		$scope.series_reserves = [
			{
				src:"http://cpassets-a.akamaihd.net/images/comic/original/126_lrg-en.gif",
				id:2
			},{
				src: "http://nerdist.com/wp-content/uploads/2014/12/BongoSimpsons-1.jpg",
				id:3
			},{
				src: "http://www.jinxthemonkey.com/comics/comic_img/comic04-color.jpg",
				id:4
			},{
				src:"http://www.readcomics.net/images/manga/the-bunker/15/1.jpg",
				id:5
			},{
				src:"http://www.readcomics.net/images/manga/the-bunker/15/2.jpg",
				id:6
			},{
				src:"http://www.readcomics.net/images/manga/the-bunker/15/3.jpg",
				id:7
			},{
				src:"http://www.readcomics.net/images/manga/the-bunker/15/4.jpg",
				id:8
			},{
				src:"http://www.readcomics.net/images/manga/the-bunker/15/5.jpg",
				id:9
			},{
				src:"http://www.readcomics.net/images/manga/the-bunker/15/6.jpg",
				id:10
			},{
				src:"http://www.readcomics.net/images/manga/the-bunker/15/7.jpg",
				id:11
			},{
				src:"http://www.readcomics.net/images/manga/the-bunker/15/8.jpg",
				id:12
			},{
				src:"http://www.readcomics.net/images/manga/the-bunker/15/9.jpg",
				id:13
			},{
				src:"http://www.readcomics.net/images/manga/the-bunker/15/10.jpg",
				id:14
			},{
				src:"http://www.readcomics.net/images/manga/the-bunker/15/11.jpg",
				id:15
			},{
				src:"http://www.readcomics.net/images/manga/the-bunker/15/12.jpg",
				id:16
			},{
				src:"http://www.readcomics.net/images/manga/the-bunker/15/13.jpg",
				id:17
			},{
				src:"http://www.readcomics.net/images/manga/the-bunker/15/14.jpg",
				id:18
			},{
				src:"http://www.readcomics.net/images/manga/the-bunker/15/15.jpg",
				id:19
			},{
				src:"http://www.readcomics.net/images/manga/the-bunker/15/16.jpg",
				id:20
			},{
				src:"http://www.readcomics.net/images/manga/the-bunker/15/17.jpg",
				id:21
			},{
				src:"http://www.readcomics.net/images/manga/the-bunker/15/18.jpg",
				id:22
			},{
				src:"http://www.readcomics.net/images/manga/the-bunker/15/19.jpg",
				id:23
			},{
				src:"http://www.readcomics.net/images/manga/the-bunker/15/20.jpg",
				id:24
			},{
				src:"http://www.readcomics.net/images/manga/the-bunker/15/21.jpg",
				id:25
			}];
		$scope.favorites_reserved= [{
				src:'http://www.simchatyisrael.org/wp-content/uploads/2015/08/follow-me.jpg',
				id:27
          	},{
          		src:" http://www.readcomics.net/images/manga/deadpool-2016/1/1.jpg",
          		id:28
          	},{
          		src:"http://www.readcomics.net/images/manga/deadpool-2016/1/2.jpg",
          		id:29
          	},{
          		src: "http://www.readcomics.net/images/manga/deadpool-2016/1/3.jpg",
          		id: 30
          	},{
          		src: "http://www.readcomics.net/images/manga/deadpool-2016/1/4.jpg",
          		id: 31
          	},{
          		src:"http://www.readcomics.net/images/manga/deadpool-2016/1/5.jpg",
          		id: 32
          	},{
          		src:"http://www.readcomics.net/images/manga/deadpool-2016/1/6.jpg",
          		id:33
          	},{
          		src:"http://www.readcomics.net/images/manga/deadpool-2016/1/7.jpg",
          		id:34
          	},{
          		src:"http://www.readcomics.net/images/manga/deadpool-2016/1/8.jpg",
          		id:35
          	},{
          		src:"http://www.readcomics.net/images/manga/deadpool-2016/1/9.jpg",
          		id:36
          	},{
          		src:"http://www.readcomics.net/images/manga/deadpool-2016/1/10.jpg",
          		id:37
          	},{
          		src:"http://www.readcomics.net/images/manga/deadpool-2016/1/11.jpg",
          		id:38
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
		
		//for the images, the url is created by buildURL(id, type);
		
		
		
		//query for series
		//take out following comment to take out placeholder
		//$scope.series = [];
		//$scope.favorites=[];
		if($scope.series_id == null){
			console.log("no seires")
		}
		else{
			for(var i = 0;i < $scope.series_id.length; i ++){
				GApi.execute("seriesendpoint","getSeries", {"id":$scope.series_id[i]}).then(
					function(){$scope.series_reserve.push({
							id:resp.id,
							url:resp.bgImageURL,
							title:resp.title
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
							url:resp.bgImageURL,
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
							url:resp.bgImageURL,
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
							url:resp.profileImageURL,
							title:resp.username,
							type:"user"
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
		$scope.$apply;
		
		
		
		
	
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
		
		//display tabs base on content
		$scope.tabs = [];
		if($scope.series.length>0){
			$scope.tabs.push({
				slug: 'series',
		        title: "Series",
		        content: $scope.series,
		        load_m: $scope.series_loadMore
			});
		}
		if($scope.favorites.length>0){
			$scope.tabs.push({
				slug: 'fav',
		        title: "Favorites",
		        content: $scope.favorites,
		        load_m: $scope.favorites_loadMore
			});
		}
	
		
		
		
		$scope.go_to_series=function(param_id){
			if(param_id==null){
				$state.go('error');
			}
			else{
				$state.go('series',{"id": param_id});
			}
		}
		
}]);
})();


