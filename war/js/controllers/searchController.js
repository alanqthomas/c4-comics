"use strict";

(function() {
angular.module('c4').controller(('browseCtrl', ['$scope', '$http',	'GApi',
                                    function(	$scope,   $http,	 GApi){
	$scope.results=[];
	$scope.getResults= function(){
		var resultReq = {
			"input": $scope.searchTerms
		};
		GApi.execute('searchendpoint', 'getResults', resultReq).then( 
			function(resp) {
				$scope.results=[];
				if(resp.authorResults != null){
					$scope.profileResults = resp.authorResults;
					$scope.results.push($scope.profileResults);
				}
				if($scope.seriesResults != null){
					$scope.seriesResults = resp.seriesResults;
					$scope.results.push($scope.seriesResults);
				}
				if($scope.comicResults != null){
					$scope.comicResults = resp.comicResults;
					$scope.results.push($scope.comicResults);
				}
				if($scope.tagResults != null){
					$scope.tagResults = resp.tagResults;
					$scope.results.push($scope.tagResults);
				}
			}, function(resp) {
				console.log("Search failed.");
				console.log(resp);
			}
		);
	};
	if($stateParams.list != null){
		$scope.searchTerms= $stateParams.list;
		$scope.getResults();
	}
}]);
})();
