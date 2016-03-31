'use strict';
// Source: war/js/app.js
(function() {

var app = angular.module('c4', ['ui.router', 'ngCookies' ,'angular-google-gapi', 'ui.bootstrap', 'infinite-scroll']);

// Initialize angular-google-gapi
app.run(['GAuth', 'GData', 'GApi', '$rootScope', '$window', '$state', 'authService',
 function(GAuth,   GData,   GApi,   $rootScope,   $window,   $state,   authService){
				
		var CLIENT = '432508624556-h5pq1n44nmg5p21r55mubj54cnuptojv.apps.googleusercontent.com';
		var BASE = '//' + window.location.host + '/_ah/api';
		
		GApi.load('userendpoint', 'v1', BASE).then(function(res){
			console.log("userendpoint: ", res);
		});
		
		GAuth.setClient(CLIENT);
		GAuth.setScope("https://www.googleapis.com/auth/userinfo.email");
		
		
		// UI-Router state authorization
		$rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
			var loggedIn = false;
			authService.checkAuth().then(
				function(res){
					loggedIn = res;
				}			
			);
			
			if(toState.authenticate && !loggedIn){
				$state.transitionTo("home");
				event.preventDefault();
			}
		});
		
		
}]);

})();
// Source: war/js/config.js
(function() {

var app = angular.module('c4');


app.config(function($stateProvider, $urlRouterProvider) {
	//$urlRouterProvider.otherwise("/home");

	$stateProvider
		.state('home', {
			url: "/home",
			templateUrl: "views/home.html",
			authenticate: false
		})
		.state('profile', {
			url: "/profile",
			templateUrl: "views/profile.html",
			authenticate: false
		})
		.state('comic', {
			url: "/comic",
			templateUrl: "views/comic.html",
			authenticate: false
		})
		.state('series', {
			url: "/series",
			templateUrl: "views/series.html",
			authenticate: false
		})
		.state('editComic', {
			url: "/editComic",
			templateUrl: "views/editComic.html",
			authenticate: false
		})
		.state('draw', {
			url: "/draw",
			templateUrl: "views/draw.html",
			authenticate: false
		})
		.state('manage-comics', {
			url: "/manage-comics",
			templateUrl: "views/manage-comics.html",
			authenticate: false
		})
		.state('manage-subscriptions', {
			url: "/manage-subscriptions",
			templateUrl: "views/manage-subscriptions.html",
			authenticate: false
		})
		.state('new-comic', {
			url: "/new-comic",
			templateUrl: "views/new-comic.html",
			authenticate: false
		})
		.state('subscription', {
			url: "/subscription",
			templateUrl: "views/subscription.html",
			authenticate: false
		})
		
});

})();

// Source: war/js/controllers/homeController.js
(function() {

angular.module('c4').controller('homeCtrl', ['$scope', '$http', 'GApi', 'authService',
                                  function(	  $scope,   $http,   GApi,   authService){	
		$scope.msg = "Scores";
		$scope.predicate = 'name';
		
		
		
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
		
}]);


})();
// Source: war/js/controllers/profileController.js
(function() {


//angular.module('c4', ['ngAnimate', 'ui.bootstrap']);
angular.module('c4').controller('profileCtrl', ['$scope', '$http', 'GApi', 'GAuth',
                                    function(	 $scope,   $http,  GApi, GAuth){	
	
		$scope.tabs = [{
	        slug: 'dashboard',
	        title: "Dashboard",
	        content: "Your Dashboard"
	      }, {
	        slug: 'room-1',
	        title: "Room 1",
	        content: "Dynamic content 1"
	      }, {
	        slug: 'room-2',
	        title: "Room 2",
	        content: "Dynamic content 2"
	      }];
			$scope.msg = "Hello, profile";
			$("#fav-cont").hide();
			$("#follow-cont").hide();
		
		
		//false = show, true = hide
		
		$scope.getComics=function(){
			//this is the parameter object
			var resultReq={
				"author":$scope.name
			};
			//execute using (endpoint, method for endpoint, parameter for method)
			//then do (if true) $scope.value = resp.items (get the result)
			//(if false) print error
			GApi.execute("UserEndpoint", "getComics", resultReq).then(
				function(resp){
					$scope.comics=resp.items;
				},function(resp){
					console.log("error no result");
				}
			);
		}
		
		$scope.getFavorites=function(){
			var resultReq={
				"user":$scope.name
			};
			GApi.execute("UserEndpoint","getFavorites",resultReg).then(
				function(resp){
					$scope.fav=resp.items;
				},function(resp){
					console.log("error no favs");
				}
			);
		}
		
		$scope.getBio=function(){
			var resultReq={
				"user":$scope.name
			};
			GApi.execute("UserEndpoints","getBio", resultReq).then(
				function(resp){
					$scope.bio=resp.items;
				},function(resp){
					console.log("errors no bio");
				}
			);
		}
		
		function alertMe(){
			alert("alerted");
		}
	
		
		/*
		$('#series').click(function(){
		
			if($('#srs-cont').is(':visible'))
			{
				$('#srs-cont').hide();
				$('#series').css('color','black');
			}
			else 
			{
				$('#srs-cont').show();
				$('#series').css('color','red');
				//hide others
				if($('#fav-cont').is(':visible'))
				{
					$('#fav-cont').hide();
					$('#fav').css('color','black');
				}
				if($('#follow-cont').is(':visible'))
				{
					$('#follow-cont').hide();
					$('#follow').css('color','black');
				}
			}
		});

		$('#fav').click(function(){
			if($('#fav-cont').is(':visible'))
			{
				$('#fav-cont').hide();
				$('#fav').css('color','black');
			}
			else
			{
				$('#fav-cont').show();
				$('#fav').css('color','red');
				//hide others
				if($('#srs-cont').is(':visible'))
				{
					$('#srs-cont').hide();
					$('#series').css('color','black');
				}
				if($('#follow-cont').is(':visible'))
				{
					$('#follow-cont').hide();
					$('#follow').css('color','black');
				}
			}
		});
	
		$('#follow').click(function(){
			if($('#follow-cont').is(':visible'))
			{
				$('#follow-cont').hide();
				$('#follow').css('color','black');
			}
			else
			{
				$('#follow-cont').show();
				$('#follow').css('color','red');
				//hide others
				if($('#srs-cont').is(':visible'))
				{
					$('#srs-cont').hide();
					$('#series').css('color','black');
				}
				if($('#fav-cont').is(':visible'))
				{
					$('#fav-cont').hide();
					$('#fav').css('color','black');
				}
			}
		});
		
		*/
}]);
})();



// Source: war/js/controllers/comicController.js
(function() {

angular.module('c4').controller('comicCtrl', ['$scope', '$http',
                                    function(	 $scope,   $http){

		$scope.msg = "Hello, profile";
}]);


})();

// Source: war/js/controllers/drawController.js
(function() {

angular.module('c4').controller('drawCtrl', ['$scope', '$http',
                                    function(	 $scope,   $http){

		$scope.msg = "Hello, profile";
}]);


})();

// Source: war/js/controllers/manageComicsController.js
(function() {

angular.module('c4').controller('manageComicsCtrl', ['$scope', '$http',
                                    function(	 $scope,   $http){

		$scope.msg = "Hello, profile";
}]);


})();

// Source: war/js/controllers/editComicController.js
(function() {

angular.module('c4').controller('editComicCtrl', ['$scope', '$http',
                                    function(	 $scope,   $http){

		$scope.msg = "Hello, profile";
}]);


})();

// Source: war/js/controllers/manageSubscriptionsController.js
(function() {

angular.module('c4').controller('manageSubscriptionsCtrl', ['$scope', '$http',
                                    function(	 $scope,   $http){

		$scope.msg = "Hello, profile";
}]);


})();

// Source: war/js/controllers/newComicController.js
(function() {

angular.module('c4').controller('newComicCtrl', ['$scope', '$http',
                                    function(	 $scope,   $http){

		$scope.msg = "Hello, profile";
}]);


})();

// Source: war/js/controllers/subscriptionController.js
(function() {

angular.module('c4').controller('subscriptionCtrl', ['$scope', '$http',
                                    function(	 $scope,   $http){

		$scope.msg = "Hello, profile";
}]);


})();

// Source: war/js/controllers/subscriptionsController.js
(function() {

angular.module('c4').controller('subscriptionsCtrl', ['$scope', '$http',
                                    function(	 $scope,   $http){

		$scope.msg = "Hello, profile";
}]);


})();

// Source: war/js/services/authService.js
(function(){
	angular.module('c4').factory('authService', ['GAuth', '$q',
	                                     function(GAuth,   $q){
		return {
			checkAuth:function(){
				var deferred = $q.defer();
				
				GAuth.checkAuth().then(
					function(){
						deferred.resolve(true);
					},
					function(){
						deferred.resolve(false);
					}
				);
				
				return deferred.promise;
			}
		}
	}]);
})();
// Source: war/js/controllers/seriesController.js
//any news made page needs to add to the grunt.js file
(function() {

angular.module('c4').controller('seriesCtrl', ['$scope', '$http', 'GApi', '$state',
                                    function(	 $scope, $http,   GApi,   $state ){

		//author name
		$scope.author_name="Author Name";
		//author id, default -1
		$scope.author_id=-1;
		
		$scope.summary="Default Summary: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ex velit, commodo ac dolor sed, auctor commodo nisi. Fusce quis purus enim. Fusce in lobortis magna. Vestibulum sit amet aliquam nibh. Quisque ac porta dolor, sed tincidunt neque. Nullam tristique commodo nunc at sagittis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Morbi elit est, consectetur vel dui at, placerat venenatis eros. Curabitur porta mi eu velit efficitur, id varius arcu vehicula. Sed at felis ante. Maecenas pretium erat dolor, vitae congue tellus finibus et. Aliquam ac congue arcu. Nulla elementum, tellus non lacinia lobortis, sapien ante tincidunt lectus, nec bibendum tortor risus eget tortor.";
		//this series' id
		$scope.series_id=0;
		//aggregate pages
		$scope.pages=null;
		
		//page boolean, false if no pages available, true if at least 1 page is available
		$scope.pages_bool=true;
		
		
		$scope.getAuthor=function(){
			//this is the parameter object
			var resultReq={
				"series_id":$scope.series_id
			};
			//execute using (endpoint, method for endpoint, parameter for method)
			//then do (if true) $scope.value = resp.items (get the result)
			//(if false) print error
			GApi.execute("UserEndpoint", "getAuthor", resultReq).then(
				function(resp){
					//Getting the whole Author object. Need to distinguish between id and name
					$scope.author_name=resp.items;
					$scope.author_id=resp.items;
				},function(resp){
					$scope.author_name="Default Author";
					$scope.author_id=-1;
					console.log("error no author result");
				}
			);
		}
		
		$scope.getSummary=function(){
			var resultReq={
				'series_id':$scope.series_id
			};
			GApi.execute("UserEndpoint", "getSummary", resultReq).then(
				function(resp){
					$scope.bio=resp.items;
				},function(resp){
					$scope.bio="Default Summary";
					console.log("error no summary");
				}
			)
		}
		
		//TODO, parse each individual pages
		$scope.getPages=function(){
			var resultReq={
				'series_id':$scope.series_id
			};
			GApi.execute("UserEndpoint", "getPages", resultReq).then(
				function(resp){
					$scope.pages=resp.items;
					$scope.pages_boolean = true;
				},function(resp){
					$scope.pages=null;
					$scope.pages_boolean = false;
					console.log("error no pages");
				}
			)
		}
		
		$scope.goToAuthor=function(){
			if($scope.author_id==-1){
				$state.go('home');
			}
			else{
				//Suppose to go to the state with parameters, but i dont know how to implement these
				var res={referer:"what", param2:37};
				$state.go('home',res);
			}
		}
		
		
		
		/* to my understanding how infi scroll works
		 * images is the array of all images. ng-repeat is going on those
		 * infi scroll is going to call a function to update images.
		 */
		
		
		$scope.images = [1, 2, 3, 4, 5, 6, 7, 8];
		//the infinite load function
		$scope.loadMore = function() {
			//get the last image
			var last = $scope.images[$scope.images.length - 1];
			//pushes images to the array. load more
			for(var i = 1; i <= 8; i++) {
				$scope.images.push(last + i);
			}
		};

		
		
		
		
}]);


})();
