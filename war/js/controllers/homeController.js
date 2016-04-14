"use strict";
	
(function() {

angular.module('c4').controller('homeCtrl', ['$scope', '$http', 'GApi', 'authService', '$state', '$stateParams',
                                  function(	  $scope,   $http,   GApi,   authService,  $state, $stateParams){	
		$scope.msg = "Scores";
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
			if($scope.recent_comics_reserve.length>0){
				$scope.recent_comics.push($scope.recent_comics_reserve.shift());
			}
		};
		$scope.tabs = [{
			slug: "top",
			title: "Top",
			content:$scope.top_comics,
			load_m: $scope.top_load_more,
			def_text:"No Top Comics Yet"
		},{
			slug: "popular",
			title: "Popular",
			content: $scope.popular_comics,
			load_m: $scope.popular_load_more,
			def_text:"No Popular Comics Yet"
		},{
		    slug: 'hot',
		    title: "Hot",
		    content: $scope.hot_comics,
		    load_m: $scope.hot_load_more,
		    def_text: "No Hot Comics Yet"
		},{
		    slug: 'newest',
		    title: "Recent",
		    content: $scope.recent_comics,
		    load_m: $scope.newest_load_more,
		    def_text: "No Recent Comics Yet"
		}];
		//query for homepage. 
		GApi.execute( "homeendpoint","getHomepage").then(
			function(resp){	
				//they are all comics, not series
				//rating
				$scope.top_comics_id = resp.topComicsId;
				//most viewed
				$scope.popular_comics_id = resp.popularComicsId;
				//viewed over time
				$scope.hot_comics_id = resp.hotComicsId;
				//newest
				$scope.recent_comics = resp.recentComicsId;
			}, function(resp){
				$scope.top_comics_id = null;
				$scope.popular_comics_id = null;
				$scope.hot_comics_id = null;
				$scope.recent_comics = null;
			}
		);
		//query for each category of comics
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
		}
		
		//Generating Placeholder
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
			}
			else{
				$state.go('comic',{"id": param_id});
			}
		}
		
		/*
		$scope.order = function(predicate){
			$scope.predicate = predicate;
		};		
		
		// List Users
		GApi.execute("userendpoint", "listUser").then(function(res){
			$scope.users = res.items;
			angular.forEach($scope.users, function(user){
				user.score = parseInt(user.score);
			});
		});		
		
		// Insert User
		$scope.insertUser = function(){
			$scope.form.id = null;
			GApi.execute("userendpoint", "insertUser", $scope.form).then(function(res){
				console.log(res);
				$scope.users.add(res);
			});
		};		
		
		// Get User
		$scope.getUser = function(id){
			GApi.execute("userendpoint", "getUser", {'id': id}).then(function(res){
				console.log(res);
			});
		};
		
		// Update User
		$scope.updateUser = function(){
			GApi.execute("userendpoint", "updateUser", $scope.form).then(function(res){
				console.log(res);
			});
		};
		
		// Remove User
		$scope.removeUser = function(id){
			console.log("id: ", id);
			GApi.execute("userendpoint", "removeUser", {'id': id}).then(function(res){
				console.log(res);
				$scope.users.remove(function(n){
					return n['id'] == id;
				});
			});
		};
		*/
}]);


})();