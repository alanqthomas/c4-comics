"use strict";

(function(){
	angular.module('c4').factory('apiService', function($q){
		return {
			init:function() {
				var ROOT = '//' + window.location.host + '/_ah/api';
				var uedefer = $q.defer();
				var oauthloaddefer = $q.defer();
				var oauthdefer = $q.defer();
				
				gapi.client.load('userendpoint', 'v1', function(){
					uedefer.resolve(gapi);
				}, ROOT);
				gapi.client.load('oauth2', 'v2', function(){
					oauthloaddefer.resolve(gapi);
				});
				var chain=$q.all([uedefer.promise, oauthloaddefer.promise]);
				return chain;
			},
			doCall: function(callback){
				var p =$q.defer();
				gapi.auth.authorize({
					client_id: '432508624556-h5pq1n44nmg5p21r55mubj54cnuptojv.apps.googleusercontent.com',
					scope: 'https://www.googleapis.com/auth/userinfo.email',
					immediate: true
				}, function(){
					var request = gapi.client.oauth2.userinfo.get().execute(function(res){
						if(!res.code){
							p.resolve(gapi);
						} else {
							p.reject(gapi);
						}
					});
				});
				
				return p.promise;
			},
			signin:function(callback){
				gapi.auth.authorize({
					client_id: '432508624556-h5pq1n44nmg5p21r55mubj54cnuptojv.apps.googleusercontent.com',
					scope: 'https://www.googleapis.com/auth/userinfo.email',
					immediate: true
				}, callback);
			}
		}
	});
})();