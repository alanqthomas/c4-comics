"use strict";

(function() {

angular.module('c4').controller('comicCtrl', ['$scope', '$http', 'GApi', '$state', '$stateParams', 'imgService', 'IMG_PREFIXES',
                                    function(	 $scope,   $http,   GApi,   $state,   $stateParams,   imgService,   IMG_PREFIXES){

	var BASE = "https://storage.googleapis.com/c4-comics.appspot.com/";

    var id;
    if($stateParams.id){
      id = $stateParams.id;
    } else{
      $state.go('error');
    }

    $scope.pages = [];
    //$scope.comics = [];
    GApi.execute("comicendpoint", "getComic", {"id": id}).then(
      function(resp){
    	  //supporting displaying multiple comics.
    	  /*$scope.comics.push({
			title : resp.title,
			comments : resp.comments,
			pages : []
			});
			for(var i = 0; i < resp.pages.length; i++){
				$scope.comics[$scope.comics.length -1].pages.push(
				{
					id: resp.pages[i],
					url: imgService.getURL(IMG_PREFIXES.PAGE, resp.pages[i])
				});
			}
		*/
        for(var i = 0; i < resp.pages.length; i++){
          //$scope.pages.push("" + BASE + "page-" + res.pages[i])
          $scope.pages.push(imgService.getURL(IMG_PREFIXES.PAGE, resp.pages[i]));
        }
      },
      function(resp){
        console.log("ERROR. Page not found.", res);
        $state.go('error');
      }
    );

}]);


})();
