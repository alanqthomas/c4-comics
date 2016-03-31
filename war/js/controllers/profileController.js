"use strict";
	
(function() {

angular.module('c4').controller('profileCtrl', ['$scope', '$http', 'GApi', 'GAuth',
                                    function(	 $scope,   $http,  GApi, GAuth){	
	
		$scope.msg = "Hello, profile";
		
		//modify the DOM to have a getResult method to get the results
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
					$scope.fav=resp.items;
				},function(resp){
					console.log("errors no bio");
				}
			);
		}
		
		$(document).ready(function(){
				$('#series').click(function(){
				
					$('#srs-cont').hide();
					//	$('#series').text() = '+';
					//}
					//else 
					//{
					//	$('#series-container').hide();	
					//	$('#series').text() = '-';
					//	alert("not visible reached");
					//}
				
			})
		});
		
		
		
		
		
}]);
})();


