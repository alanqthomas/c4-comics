"use strict";

(function() {

angular.module('c4').controller('navCtrl', ['$scope', '$http',
                                    function(	 $scope,   $http){
	//this is the cookie, but since we're only storing id, I'm assuming its an int.
	var userCookie = $cookies.get('C4User');
	//but in case it isn't, heres where I would convert it.
	$scope.userId = userCookie;
	//need to add google auth stuff.
	if(userCookie = null){
		$cookies.put('C4User', 00000);//replace with google.getUserID, whatever.
		//more google auth stuff here.
	}
	if ($scope.userID != null){
		var userInfo = userendpoint.getUser($scope.userId);
	}
	$scope.profilePicURL = getServingURL(userInfo.getProfilePic())
}]);


})();
