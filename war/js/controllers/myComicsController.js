"use strict";

(function() {

angular.module('c4').controller('myComicsCtrl', ['$scope', '$http', 'GData', 'GApi', '$state',
                                      function(	 $scope,    $http,   GData,   GApi,   $state){

    
    if(GData.getUser() == null){
      $state.go('home');
    }

    $scope.getSeries= function(){
      $scope.list = [];
      $scope.series = true;
      $scope.heading = "My Series";
      GApi.execute("c4userendpoint", "getC4User", {"id": GData.getUser().id}).then(
        function(res){
          var series = res.userSeries;
          for(var i = 0; i < series.length; i++){
            GApi.execute("seriesendpoint", "getSeries", {"id": series[i]}).then(
              function(res){
                $scope.list.push(res);
              },
              function(res){
                $state.go('error');
              }
            )
          }
        },
        function(res){
          $state.go('error');
        }
      );
  };
  $scope.getSeries();

  $scope.getComics = function(comics, title){
    $scope.list = [];
    $scope.heading = title;
    $scope.series = false;
    for(var i = 0; i < comics.length; i++){
      GApi.execute("comicendpoint", "getComic", {"id": comics[i]}).then(
        function(res){
          console.log(res);
          $scope.list.push(res);
        },
        function(res){
          $state.go('error');
        }
      );
    }
  };

  $scope.goToSeries = function(id){
    $state.go('series',{'id': id});
  };

  $scope.goToComic = function(id){
    $state.go('comic', {'id': id});
  };

}]);


})();
