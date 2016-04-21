"use strict";
(function(){

	angular.module('c4').factory('searchScope', ['$rootScope',
	                                     function($rootScope){

      var scope = $rootScope.$new(true);
      scope.data = {terms: ""};
      return scope;
}]);
})();
