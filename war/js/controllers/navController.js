"use strict";

(function() {
angular.module('c4').controller('navCtrl', ['$scope', '$http', '$state', '$window', 'GAuth','GApi', 'GData',
                                  function(	 $scope,   $http,	$state,   $window,   GAuth,	 GApi,   GData){

	$scope.notifications=[];
	var toggle = false;
	//replace with a check to see if someone is signed in?
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
				$scope.signedIn=true;
        $state.go($state.current, {}, {'reload': true});
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
						$scope.signedIn=true;
						//$scope.userSettings=;
					}, function(resp){
						console.log("Error insering user into db.");
					}
				);
			}
		);
	}

	$scope.doAuth = function(){
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
	};

  $scope.signOut = function(){
    GAuth.logout().then(function(){
      $scope.userId = null;
      $scope.signMsg = "Sign In";
      $scope.username = null;
      $scope.notifications=[];
      $scope.signedIn=false;
      $window.location.reload();
      //$scope.userSettings=null;
    });
  }

  /*
	GAuth.checkAuth().then(
		function(){
			$scope.signMsg = "Sign Out";
		},
		function(){
			$scope.signMsg = "Sign In";
		}
	);
  */

	$scope.navSearch = function(){
		$state.go('search',{"list": $scope.searchTerms});
	};

	$scope.navProfile = function(){
		$state.go('profile',{"id": $scope.userId});
	};

	$scope.notificationsBool = ($scope.notifications.length > 0);

  function createUser(id, email, picture){
		return {
			userID: id,
			email:email,
			username:email,
			biography:"Write a biography here!",
			profileImageURL:picture
		}
	}

  $scope.toggleSideNav = function(){
    if(!toggle){
      $("#side-nav").css("width", "150px");
      toggle = true;
    } else {
      $("#side-nav").css("width", "0px");
      toggle = false;
    }
  }

}]);

})();
