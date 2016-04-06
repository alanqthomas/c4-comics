"use strict";

(function() {
angular.module('c4').controller('navCtrl', ['$scope', '$http', '$state',	'GAuth','GApi', 'GData',
                                  function(	 $scope,   $http,	$state,		 GAuth,	 GApi,   GData){
//replace with a check to see if someone is signed in?
	$scope.username = "No user";
	var doLogin = function(){
		$scope.signMsg = "Sign Out";
		$scope.username = GData.getUser().name;
		$scope.userId = GData.getUser().id;
		GApi.execute("c4userendpoint","getC4User",{id:GData.getUser().id}).then(
			function(resp){
				console.log("User information retrieved from db.");
				$scope.userName=resp.username;
				$scope.notifications=resp.notifications;
				$scope.profilePic=resp.profileImageURL;
				$scope.hideProfilePic=false;
				//$scope.userSettings=resp.userSettings;
			}, 
			function(resp){
				console.log("No user information found in db.");
				var u = GData.getUser();
				var insertParam = createUser(u.id, u.email, u.picture);
				GApi.execute("c4userendpoint","insertC4User", insertParam).then(
					function(resp){
						console.log("User inserted into db.");
						$scope.userName=u.email;
						$scope.profilePic=u.picture;
						$scope.hideProfilePic=false;
						//$scope.userSettings=;
					}, function(resp){
						console.log("Error insering user into db.");
					}
				);
			}
		);
	}
	$scope.doAuth = function(){
		if($scope.signMsg == "Sign In"){
			GAuth.checkAuth().then(
				function(){
					doLogin();
				},
				function(){
					GAuth.login().then(function(){
						doLogin();
					});
				}
			);
		} else {
			GAuth.logout().then(function(){
				$scope.userId = null;
				$scope.signMsg = "Sign In";
				$scope.username = "No user";
				//$scope.notifications=null;
				$scope.hideProfilePic=true;
				//$scope.userSettings=null;
			});
		}
	};

	GAuth.checkAuth().then(
		function(){
			$scope.signMsg = "Sign Out";
		},
		function(){
			$scope.signMsg = "Sign In";
		}
	);

	$scope.navSearch = function(){
		//this makes an error, unclear why.
		$state.go('search',{"list": $scope.searchTerms});
	}
	$scope.navProfile = function(){
		//this makes an error, unclear why.
		$state.go('profile',{"id": $scope.userId});
	}
}]);

})();
