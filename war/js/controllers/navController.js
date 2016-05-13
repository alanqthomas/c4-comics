"use strict";

(function() {
angular.module('c4').controller('navCtrl', ['$scope', '$http', '$state', '$window', 'GAuth','GApi', 'GData', '$cookies', 'searchScope',
function($scope, $http, $state, $window, GAuth,    GApi,   GData,   $cookies,   searchScope){
	//init
	var toggle = false;
	$scope.notifications = [];
	$scope.search = searchScope.data;
	$scope.showNotification = false;

	// Check sign in
	if($cookies.get('userId')){
		GData.setUserId($cookies.get('userId'));
		GAuth.checkAuth().then(
			function(){
				doLogin();
			},
			function(){
				console.log('ERROR: Cookie exists, but no login data available');
				$cookies.remove('userId');
				$state.go('error');
			}
		);
	}
	//local functions
	function createUser(id, email, picture){
		return {
			userID: id,
			email:email,
			username:email,
			biography:"Write a biography here!",
			profileImageURL:picture
		}
	}
	function doLogin(){
		$cookies.put('userId', GData.getUser().id);
		GApi.execute("c4userendpoint", "getC4User", {'id' : GData.getUser().id}).then(
			function(resp){
				$scope.notifications=resp.notifications;
				$scope.profilePic=resp.profileImageURL;
				$scope.signedIn=true;
				$state.go($state.current, {}, {'reload': true});
			},
			function(resp){
				console.log("No user information found in db.");
				var u = GData.getUser();
				var insertParam = createUser(u.id, u.email, u.picture);
				GApi.execute("c4userendpoint","insertC4User", insertParam).then(
					function(resp){
						console.log("User inserted into db.");
						$scope.profilePic=u.picture;
						$scope.signedIn=true;
					}, function(resp){
						console.log("Error insering user into db.");
					}
				);
			}
		);
	}
	//visible functions
	$scope.toggleNotification = function(){
		$scope.showNotification = !$scope.showNotification;
	}

	$scope.deleteNotification = function(notif){
		GApi.execute("c4userendpoint", "deleteNotification", {'id': notif.id}).then(
			function(resp){
				$scope.notifications.splice($scope.notifications.indexOf(notif), 1);
			},
			function(resp){
				console.log("deleteNotification Failed");
			}
		);
	}
	$scope.goNotification = function(notif){
		$scope.deleteNotification(notif);
		$state.go(notif.type, {id : notif.id});
	}
	$scope.doAuth = function(){
		GAuth.checkAuth().then(
			function(){
				doLogin(GData.getUser().id);
			},
			function(){
				GAuth.login().then(function(){
					doLogin(GData.getUser().id);
				});
			}
		);
	};
	$scope.signOut = function(){
		GAuth.logout().then(function(){
			$cookies.remove('userId');
			$scope.notifications=[];
			$scope.signedIn=false;
			$window.location.reload();
		});
	};
	$scope.navSearch = function(){    
		$state.go('search');
	};
	$scope.navProfile = function(){
		$state.go('profile',{"id": GData.getUser().id});
	};
	$scope.toggleSideNav = function(){
		if(!toggle){
			$("#side-nav").css("width", "150px");
			toggle = true;
		} else {
			$("#side-nav").css("width", "0px");
			toggle = false;
		}
	};
	



}]);

})();
