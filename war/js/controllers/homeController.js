"use strict";
	
(function() {

angular.module('c4').controller('homeCtrl', ['$scope', '$http', 'GApi', 'authService',
                                  function(	  $scope,   $http,   GApi,   authService){	
		$scope.msg = "Scores";
		$scope.predicate = 'name';
		
		

		$scope.tabs = [{
		    slug: 'trending',
		    title: "Trending/Hot",
		    content: "TRENDS/HOT"
		}, {
		    slug: 'newest',
		    title: "Recent",
		    content: "newest this week"
		},{
			slug: "top",
			title: "Top",
			content: "Top stuff here"
		}];

		
		
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