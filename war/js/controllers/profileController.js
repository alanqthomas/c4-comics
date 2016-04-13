"use strict";
(function() {
//angular.module('c4', ['ngAnimate', 'ui.bootstrap']);
angular.module('c4').controller('profileCtrl', ['$scope', '$http', 'GApi', 'GAuth', 'GData', '$stateParams',
                                    function(	 $scope,   $http,  GApi, 	GAuth, 	GData,	 $stateParams){	
		//PLACE HOLDERS
		//this is image url for initial display
		$scope.series = ['http://media.salon.com/2014/10/archie_comics.jpg'];
		$scope.favorites = ['http://downloadicons.net/sites/default/files/favorite-icon-47070.png'];
		//this is added for infinite scroll
		$scope.series_reserves = [
							"http://cpassets-a.akamaihd.net/images/comic/original/126_lrg-en.gif",
							"http://nerdist.com/wp-content/uploads/2014/12/BongoSimpsons-1.jpg",
							"http://www.jinxthemonkey.com/comics/comic_img/comic04-color.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/15/1.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/15/2.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/15/3.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/15/4.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/15/5.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/15/6.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/15/7.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/15/8.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/15/9.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/15/10.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/15/11.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/15/12.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/15/13.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/15/14.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/15/15.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/15/16.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/15/17.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/15/18.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/15/19.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/15/20.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/15/21.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/15/22.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/15/23.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/15/24.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/15/25.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/16/1.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/16/2.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/16/3.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/16/4.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/16/5.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/16/6.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/16/7.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/16/8.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/16/9.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/16/10.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/16/11.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/16/12.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/16/13.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/16/14.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/16/15.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/16/16.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/16/17.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/16/18.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/16/19.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/16/20.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/16/21.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/16/22.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/16/23.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/16/24.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/16/25.jpg",
		                   "http://www.readcomics.net/images/manga/the-bunker/16/26.jpg",
		                   ];
		$scope.favorites_reserved= [
		                              'http://www.simchatyisrael.org/wp-content/uploads/2015/08/follow-me.jpg',
		                              "http://www.readcomics.net/images/manga/deadpool-2016/1/1.jpg",
		                            "http://www.readcomics.net/images/manga/deadpool-2016/1/2.jpg",
		                            "http://www.readcomics.net/images/manga/deadpool-2016/1/3.jpg",
		                            "http://www.readcomics.net/images/manga/deadpool-2016/1/4.jpg",
		                            "http://www.readcomics.net/images/manga/deadpool-2016/1/5.jpg",
		                            "http://www.readcomics.net/images/manga/deadpool-2016/1/6.jpg",
		                            "http://www.readcomics.net/images/manga/deadpool-2016/1/7.jpg",
		                            "http://www.readcomics.net/images/manga/deadpool-2016/1/8.jpg",
		                            "http://www.readcomics.net/images/manga/deadpool-2016/1/9.jpg",
		                            "http://www.readcomics.net/images/manga/deadpool-2016/1/10.jpg",
		                            "http://www.readcomics.net/images/manga/deadpool-2016/1/11.jpg",
		                            
		                           ];
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
		
		//display tabs base on content
		$scope.tabs = [];
		if($scope.series.length>0){
			$scope.tabs.push({
				slug: 'series',
		        title: "Series",
		        content: $scope.series
			});
		}
		if($scope.favorites.length>0){
			$scope.tabs.push({
				slug: 'fav',
		        title: "Favorites",
		        content: $scope.favorites
			});
		}
		$scope.series_loadMore = function() {
			//pushes images to the array. load more
			if ($scope.series_reserves.length > 0){
				$scope.series.push($scope.series_reserves.shift());
			}
			if ($scope.favorites_reserved.length > 0){
				$scope.favorites.push($scope.favorites_reserved.shift());
			}
		};
}]);
})();


