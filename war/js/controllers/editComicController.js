"use strict";

(function() {

angular.module('c4').controller('editComicCtrl', ['$scope', '$http', 'Upload', 'GApi', 'imgService', 'IMG_PREFIXES',
                                       function(	 $scope,   $http,   Upload,   GApi,   imgService,   IMG_PREFIXES){

      var id = '12345678';
      $scope.upload = function(){
        $http({
          method: 'POST',
          url: imgService.getUploadURL(IMG_PREFIXES.PAGE, id),
          headers:{
            'Content-Type': $scope.file.type
          },
          data: $scope.file
        });
        console.log($scope.file);
      };

}]);


})();
