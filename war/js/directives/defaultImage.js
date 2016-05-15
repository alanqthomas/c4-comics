"use strict";

(function() {

angular.module('c4').directive('defaultImg', function(){
  return {
    link: function(scope, element, attrs){
      element.bind('error', function(){
        if(attrs.src != attrs.defaultImg){
          attrs.$set('src', attrs.defaultImg);
        }
      });
    }
  }
});

})();
