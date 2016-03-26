'use strict';
// Source: war/js/app.js
(function() {

var app = angular.module('c4', ['ui.router', 'ngCookies' ,'angular-google-gapi']);

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
	$urlRouterProvider.otherwise("/home");

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
		.state('browse', {
			url: "/browse",
			templateUrl: "views/browse.html",
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
		.state('subscriptions', {
			url: "/subscriptions",
			templateUrl: "views/subscriptions.html",
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

angular.module('c4').controller('profileCtrl', ['$scope', '$http',
                                    function(	 $scope,   $http){	
	
		$scope.msg = "Hello, profile";
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