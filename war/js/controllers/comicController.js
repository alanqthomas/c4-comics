"use strict";

(function() {

angular.module('c4').controller('comicCtrl', ['$scope', '$http', 'GApi', '$stateParams',
                                    function(	 $scope,   $http,   GApi,   $stateParams){

		$scope.msg = "Hello, profile";


    var id = $stateParams.id;

    GApi.execute("pageendpoint", "getPage", {"id": id}).then(
      function(res){
        console.log("Found: ", res);
      },
      function(res){
        console.log("ERROR. Page not found.", res);
      }
    );

}]);


})();
