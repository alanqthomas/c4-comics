"use strict";

(function(){
	angular.module('userModule', []).service('userService', [function() {
		
		this.listUsers = function($scope){
			gapi.client.userendpoint.listUser().execute(
				function(res){
					if(!res.code){
						console.log(res);
						$scope.leaderboard = res.items;
						$scope.$apply();
					}
				}
			);
		};
		
	}]);	
})()