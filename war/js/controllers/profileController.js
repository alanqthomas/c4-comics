"use strict";



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


