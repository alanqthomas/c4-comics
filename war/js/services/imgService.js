"use strict";
(function(){

	angular.module('c4').factory('imgService', ['$q',
	                                    function($q){
		return {

			getURL: function(type, id){
				var url = "https://storage.googleapis.com/c4-comics.appspot.com/" +
				type + "-" + id;
				return url;
			},
			getUploadURL: function(type, id){
				var url = "https://www.googleapis.com/upload/storage/v1/b/c4-comics.appspot.com/o?uploadType=media&name=" +
				type + "-" + id;
				return url;
			}

		}

}]);
})();
