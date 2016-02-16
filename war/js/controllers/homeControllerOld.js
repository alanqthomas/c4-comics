"use strict";
	
(function() {

angular.module('tictactoe').controller('homeCtrl', ['$scope', '$http', function($scope, $http){	
		
	$scope.list = function() {
		gapi.client.quoteendpoint.listQuote().execute(function(res){
			if(!res.code){
				$scope.quoteList = res.items;
				$scope.$apply();
			}
		});
	}
	
	$scope.insert = function() {
		gapi.client.quoteendpoint.insertQuote($scope.insert).execute(function(res){
			if(!res.code){
				console.log(res.id + ":" + res.message + " --" + res.author);
			}
		});
	}
	
	$scope.update = function() {
		gapi.client.quoteendpoint.updateQuote($scope.update).execute(function(res){
			if(!res.code){
				console.log(res.id + ":" + res.message + " --" + res.author);
			}
		});
	}
	
	$scope.delete = function() {
		gapi.client.quoteendpoint.removeQuote($scope.delete).execute(function(res){
			if(!res.code){
				console.log(res);
			}
		});
	}
	
}]);


})();