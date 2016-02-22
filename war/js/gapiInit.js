"use strict";

function init(){
 var apisToLoad = 1; // must match number of calls to gapi.client.load()  
    var gCallback = function() {  
        if (--apisToLoad == 0) {  
            //Manual bootstraping of the application  
            var $injector = angular.bootstrap(document, ['c4']);  
            console.log('Angular bootstrap complete');  
        };  
    };  
    gapi.client.load('userendpoint', 'v1', gCallback, '//' + window.location.host + '/_ah/api');
}