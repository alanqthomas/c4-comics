"use strict";

(function(){
	angular.module('c4').factory('authService', ['GAuth', '$q',
	                                     function(GAuth,   $q){
		return {
			checkAuth:function(){
				var deferred = $q.defer();
				
				GAuth.checkAuth().then(
					function(){
						deferred.resolve(true);
					},
					function(){
						deferred.resolve(false);
					}
				);
				
				return deferred.promise;
			}
		}
	}]);
})();