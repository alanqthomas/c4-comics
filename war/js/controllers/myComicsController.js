"use strict";

(function() {

angular.module('c4').controller('myComicsCtrl', ['$scope', '$http', 'GData', 'GApi', '$state',
                                      function(	 $scope,    $http,   GData,   GApi,   $state){

    if(GData.getUser() == null){
      $state.go('home');
    }

    $scope.noSeries = false;

    $scope.getSeries= function(){
      $scope.list = [];
      $scope.series = true;
      $scope.heading = "My Series";
      GApi.execute("c4userendpoint", "getC4User", {"id": GData.getUser().id}).then(
        function(res){
          if(!res.userSeries){
            $scope.noSeries = true;
            return;
          }
          var series = res.userSeries;
          for(var i = 0; i < series.length; i++){
            GApi.execute("seriesendpoint", "getSeries", {"id": series[i]}).then(
              function(res){
                res.rating = Math.floor(parseFloat(res.rating) * 100) / 100;
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
          res.rating = Math.floor(parseFloat(res.rating) * 100) / 100;
          $scope.list.push(res);
        },
        function(res){
          $state.go('error');
        }
      );
    }
  };

  function createSeries(authorId){
    return {
      authorId: authorId,
      description: "Write a description here!"
    }
  }

  $scope.newSeries = function(){
    var param = createSeries(GData.getUser().id);
    GApi.execute("seriesendpoint","insertSeries", param).then(
      function(resp){
        GApi.execute("c4userendpoint", "adduserseries", {"userId" : GData.getUser().id,"seriesId" : resp.id}).then(
          function(resp1){
            $scope.goToSeries(resp.id);
          },
          function(resp1){
            console.log("SEVERE ERROR: Series not associated with user.");
            console.log(resp);
          }
        );
      }, function(resp){
        console.log("Failed to create new series.");
        console.log(resp);
      }
    );
  };

  $scope.hoverIn = function(){
    this.hoverEdit = true;
  };

  $scope.hoverOut = function(){
    this.hoverEdit = false;
  }

  $scope.goToSeries = function(id){
    $state.go('series',{'id': id});
  };

  $scope.goToComic = function(id){
    $state.go('comic', {'id': id});
  };

  $scope.goToEditComic = function(id){
    $state.go('editComic', {'id': id});
  }

}]);


})();
