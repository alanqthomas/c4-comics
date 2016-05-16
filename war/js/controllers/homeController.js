"use strict";

(function() {

angular.module('c4').controller('homeCtrl', ['$scope', '$http', 'GApi', 'authService', '$state', '$stateParams', 'imgService', 'IMG_PREFIXES',
                                  function(	  $scope,   $http,   GApi,   authService,  $state, $stateParams, imgService, IMG_PREFIXES){
		$scope.predicate = 'name';

		//list of comics to populate page
		$scope.top_comics = [];
		$scope.top_comics_reserve = [];
		$scope.popular_comics = [];
		$scope.popular_comics_reserve = [];
		$scope.hot_comics = [];
		$scope.hot_comics_reserve = [];
		$scope.recent_comics = [];
		$scope.recent_comics_reserve = [];
		$scope.defaultPageURL = imgService.getURL(IMG_PREFIXES.PAGE, '123456');

		$scope.top_load_more = function(){
			if($scope.top_comics_reserve.length>0){
				$scope.top_comics.push($scope.top_comics_reserve.shift());
			}
		};
		$scope.popular_load_more = function(){
			if($scope.popular_comics_reserve.length>0){
				$scope.popular_comics.push($scope.popular_comics_reserve.shift());
			}
		};
		$scope.hot_load_more = function(){
			if($scope.hot_comics_reserve.length>0){
				$scope.hot_comics.push($scope.hot_comics_reserve.shift());
			}
		};
		$scope.recent_load_more = function(){
			console.log("reached");
			if($scope.recent_comics_reserve.length>0){
				$scope.recent_comics.push($scope.recent_comics_reserve.shift());
			}
		};
		$scope.tabs = [{
			slug: "top",
			title: "Top",
			content:$scope.top_comics,
			load_m: $scope.top_load_more,
			def_text:"Loading..."
		},{
			slug: "popular",
			title: "Popular",
			content: $scope.popular_comics,
			load_m: $scope.popular_load_more,
			def_text:"Loading..."
		},{
		    slug: 'hot',
		    title: "Hot",
		    content: $scope.hot_comics,
		    load_m: $scope.hot_load_more,
		    def_text: "Loading..."
		},{
		    slug: 'newest',
		    title: "Recent",
		    content: $scope.recent_comics,
		    load_m: $scope.newest_load_more,
		    def_text: "Loading..."
		}];
		//query for homepage.

		$scope.getComics = function(){

			GApi.execute( "homepageendpoint","getComics").then(
				function(resp){
					$scope.homepage = resp;
					//add top comics
					if($scope.homepage.topComics!= null && $scope.homepage.topComics.length >0){
						$scope.tabs[0].def_text = "";
						//$scope.top_comics.push($scope.homepage.topComics.shift());
						for(var i = $scope.homepage.topComics.length; i >0; i--){
							$scope.top_comics.push($scope.homepage.topComics.shift());
						}
					}

					//add popular comics
					if($scope.homepage.popularComics!= null && $scope.homepage.popularComics.length>0){
						$scope.tabs[1].def_text = "";
						//$scope.popluar_comics.push($scope.homepage.popularComics.shift());
						for(var i = $scope.homepage.popularComics.length; i > 0; i --){
							$scope.popular_comics.push($scope.homepage.popularComics.shift());
						}
					}

					//add the hotcomics
					if($scope.homepage.hotComics != null && $scope.homepage.hotComics.length>0){
						$scope.tabs[2].def_text = "";
						//$scope.hot_comics.push($scope.homepage.hotComics.shift());
						for(var i = $scope.homepage.hotComics.length; i > 0; i --){
							$scope.hot_comics.push($scope.homepage.hotComics.shift());
						}
					}

					//add recent comics
					if($scope.homepage.recentComics != null && $scope.homepage.recentComics.length > 0){
						$scope.tabs[3].def_text = "";
						//$scope.recent_comics.push($scope.homepage.recentComics.shift());
						for(var i = $scope.homepage.recentComics.length; i > 0 ; i --){
							$scope.recent_comics.push($scope.homepage.recentComics.shift());
						}
					}
				}, function(resp){
					$scope.top_comics_id = null;
					$scope.popular_comics_id = null;
					$scope.hot_comics_id = null;
					$scope.recent_comics = null;
				}
			);
		}

		$scope.getURL = function(id){
			return imgService.getURL(IMG_PREFIXES.PAGE, id);
		};

		//query for each category of comics
		$scope.getComics();

		/*
		//TOP
		if($scope.top_comics_id != null){
			for(var i = 0; i < $scope.top_comics_id.length; i ++){
				GApi.execute("comicendpoint", "getComic", {"id":$scope.comics_id[i]}).then(
					function(){
						$scope.top_comics.reserve.push({
							id:resp.id,
							//use the create url
							title:resp.title
						});
					},
					function(){
						console.log("No comic found for " +$scope.top_comics_id[i]);
					}
				);
			}
			if($scope.top_comics_reseve.length>0){

				$scope.top_comics.push($scope.top_comics_reserve.shift());
			}
		}
		//POPULAR
		if($scope.popular_comics_id != null){
			for(var i = 0; i < $scope.popular_comics_id.length; i ++){
				GApi.execute("comicendpoint", "getComic", {"id":$scope.comics_id[i]}).then(
					function(){
						$scope.popular_comics.reserve.push({
							id:resp.id,
							//use the create url
							title:resp.title
						});
					},
					function(){
						console.log("No comic found for " +$scope.popular_comics_id[i]);
					}
				);
			}
			if($scope.popular_comics_reseve.length>0){

				$scope.popular_comics.push($scope.popular_comics_reserve.shift());
			}
		}
		//HOT
		if($scope.hot_comics_id != null){
			for(var i = 0; i < $scope.hot_comics_id.length; i ++){
				GApi.execute("comicendpoint", "getComic", {"id":$scope.comics_id[i]}).then(
					function(){
						$scope.hot_comics.reserve.push({
							id:resp.id,
							//use the create url
							title:resp.title
						});
					},
					function(){
						console.log("No comic found for " +$scope.hot_comics_id[i]);
					}
				);
			}
			if($scope.hot_comics_reseve.length>0){

				$scope.hot_comics.push($scope.hot_comics_reserve.shift());
			}
		}
		//RECENT
		if($scope.recent_comics_id != null){
			for(var i = 0; i < $scope.recent_comics_id.length; i ++){
				GApi.execute("comicendpoint", "getComic", {"id":$scope.comics_id[i]}).then(
					function(){
						$scope.recent_comics.reserve.push({
							id:resp.id,
							//use the create url
							title:resp.title
						});
					},
					function(){
						console.log("No comic found for " +$scope.recent_comics_id[i]);
					}
				);
			}
			if($scope.recent_comics_reseve.length>0){

				$scope.recent_comics.push($scope.recent_comics_reserve.shift());
			}
		}*/


		//Generating Placeholder
		/*
		if($scope.top_comics.length == 0){

			$scope.top_comics.push({
				src:"http://www.readcomics.net/images/manga/adventure-time/1/1.jpg",
				id:1,
				title: "adventure time"
			});
			$scope.top_comics_reserve.push({
				src:"http://www.readcomics.net/images/manga/adventure-time/1/2.jpg",
				id:2,
				title: "adventure time"

			});
			$scope.top_comics_reserve.push({
				src:"http://www.readcomics.net/images/manga/adventure-time/1/3.jpg",
				id:3,
				title: "adventure time"
			});
			$scope.top_comics_reserve.push({
				src:"http://www.readcomics.net/images/manga/spider-man-2016/1/1.jpg",
				id:4,
				title: "spider man"
			});
			$scope.top_comics_reserve.push({
				src:"http://www.readcomics.net/images/manga/spider-man-2016/2/1.jpg",
				id:5,
				title: "spider man"
			});
			$scope.top_comics_reserve.push({
				src:"http://www.readcomics.net/images/manga/spider-man-2016/3/1.jpg",
				id:6,
				title: "spider man"
			});
			$scope.top_comics_reserve.push({
				src:"http://www.readcomics.net/images/manga/hellboy/1/1.jpg",
				id:7,
				title: "hellboy"
			});
			$scope.top_comics_reserve.push({
				src:"http://www.readcomics.net/images/manga/simpsons-comics/1/1.jpg",
				id:8,
				title: "simpsons"

			});
			$scope.top_comics_reserve.push({
				src:"http://www.readcomics.net/images/manga/suicide-squad-most-wanted-deadshot-and-katana-2016/1/1.jpg",
				id:9,
				title: "suicide squad"
			});
		}
		if($scope.hot_comics.length==0){
			$scope.hot_comics.push({
				src:"http://www.readcomics.net/images/manga/wonder-woman/1/1.jpg",
				id:10,
				title: "wonder woman"
			});
			$scope.hot_comics_reserve.push({
				src:"http://www.readcomics.net/images/manga/wonder-woman/2/1.jpg",
				id:11,
				title: "wonder woman"
			});
			$scope.hot_comics_reserve.push({
				src:"http://www.readcomics.net/images/manga/wonder-woman/3/1.jpg",
				id:12,
				title: "wonder woman"
			});

		}
		*/

		if($scope.top_comics.length > 0 ){
			$scope.tabs[0].def_text='';
		}
		if($scope.popular_comics.length>0){
			$scope.tabs[1].def_text='';
		}
		if($scope.hot_comics.length>0){
			$scope.tabs[2].def_text='';
		}
		if($scope.recent_comics.length>0){
			$scope.tabs[3].def_text='';
		}

		$scope.go_to_comic=function(param_id){
			if(param_id==null){
				$state.go('error');
			}	else {
				$state.go('comic',{"id": param_id});
			}
		};

}]);


})();
