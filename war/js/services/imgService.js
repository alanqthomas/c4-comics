"use strict";
(function(){

	angular.module('c4').factory('imgService', ['$q',
	                                    function($q){

		var BASE = "https://storage.googleapis.com/c4-comics.appspot.com/";

		return {
			getURL: function(type, id){
				var url = BASE + type + "-" + id;
				return url;
			},

			getURLDecache: function(type, id){
				var url = BASE +	type + "-" + id + "?" + Date.now();
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
