"use strict";

(function() {

angular.module('c4').controller('comicCtrl', ['$scope', '$http', 'GApi', '$state', '$stateParams', 'imgService', 'IMG_PREFIXES',
                                    function(	 $scope,   $http,   GApi,   $state,   $stateParams,   imgService,   IMG_PREFIXES){

		var BASE = "https://storage.googleapis.com/c4-comics.appspot.com/";

    var id;
    if($stateParams.id){
      id = $stateParams.id;
    } else{
      $state.go('home');
    }

    $scope.pages = [];

    GApi.execute("comicendpoint", "getComic", {"id": id}).then(
      function(res){
        for(var i = 0; i < res.pages.length; i++){
          //$scope.pages.push("" + BASE + "page-" + res.pages[i])
          $scope.pages.push(imgService.getURL(IMG_PREFIXES.PAGE, res.pages[i]));
        }
      },
      function(res){
        console.log("ERROR. Page not found.", res);
        $state.go('home');
      }
    );

}]);


})();
