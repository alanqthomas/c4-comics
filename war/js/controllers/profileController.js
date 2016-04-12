"use strict";



(function() {


//angular.module('c4', ['ngAnimate', 'ui.bootstrap']);
angular.module('c4').controller('profileCtrl', ['$scope', '$http', 'GApi', 'GAuth', 'GData', '$stateParams',
                                    function(	 $scope,   $http,  GApi, 	GAuth, 	GData,	 $stateParams){	
	
	
	

		$scope.series = ['http://media.salon.com/2014/10/archie_comics.jpg',
		                 "http://cpassets-a.akamaihd.net/images/comic/original/126_lrg-en.gif",
		                 "http://nerdist.com/wp-content/uploads/2014/12/BongoSimpsons-1.jpg",
		                 "http://www.jinxthemonkey.com/comics/comic_img/comic04-color.jpg"
		                 ];
	
		$scope.favorites = ['http://downloadicons.net/sites/default/files/favorite-icon-47070.png',
		                    'http://www.simchatyisrael.org/wp-content/uploads/2015/08/follow-me.jpg',
		                    
		                    ];
		
		
		
		$scope.tabs = [{
	        slug: 'series',
	        title: "Series",
	        content: $scope.series
	      }, {
	        slug: 'fav',
	        title: "Favorites",
	        content: $scope.favorites
	      }];
		
		
		
		
		
		//init
		$scope.profile_id = $stateParams.id;
		$scope.name = "Profile Name";
		$scope.comics;
		$scope.fav;
		$scope.bio = "Write a biography here!",
		//fetch our db user info.
		GApi.execute( "c4userendpoint","getC4User", {"id":$scope.profile_id} ).then(
			function(resp){	
				console.log(resp);
				$scope.name=resp.username;
				$scope.comics=resp.userSeries;
				$scope.fav=resp.favorites;
				$scope.bio=resp.biography;
				console.log("user found with url ID");
			}, function(resp){
				console.log("error no user found for url ID");
				$scope.name="Not Found";
			}
		);
		$scope.$apply;
		//set display boolean
		$scope.editVisible = ($scope.profile_id == $scope.userId);
		
		
		
		
		
		
		
		/*
		since its only get user, i dont need extra methods
		
		$scope.getComics=function(){
			//this is the parameter object
			var resultReq={
				"id":$scope.profile_id
			};
			//execute using (endpoint, method for endpoint, parameter for method)
			//then do (if true) $scope.value = resp.items (get the result)
			//(if false) print error
			GApi.execute("C4UserEndpoint", "getC4User", resultReq).then(
				function(resp){
					//there is only getC4User, not sure how to generate comics from there
					$scope.comics=resp.items;
				},function(resp){
					console.log("error no result");
				}
			);
		}
		
		
		$scope.getFavorites=function(){
			var resultReq={
				"id":$scope.profile_id
			};
			GApi.execute("C4UserEndpoint","getC4User",resultReg).then(
				function(resp){
					//this is the user object, not sure how to generate the favorites from the C4User
					$scope.fav=resp.items;
				},function(resp){
					console.log("error no favs");
				}
			);
		}
		
		
		$scope.getBio=function(){
			var resultReq={
				"id":$scope.profile_id
			};
			GApi.execute("C4UserEndpoint","getBio", resultReq).then(
				function(resp){
					$scope.bio=resp.items;
				},function(resp){
					console.log("errors no bio");
				}
			);
		}
		*/
		
		/*
		old tabs js
		$('#series').click(function(){
		
			if($('#srs-cont').is(':visible'))
			{
				$('#srs-cont').hide();
				$('#series').css('color','black');
			}
			else 
			{
				$('#srs-cont').show();
				$('#series').css('color','red');
				//hide others
				if($('#fav-cont').is(':visible'))
				{
					$('#fav-cont').hide();
					$('#fav').css('color','black');
				}
				if($('#follow-cont').is(':visible'))
				{
					$('#follow-cont').hide();
					$('#follow').css('color','black');
				}
			}
		});

		$('#fav').click(function(){
			if($('#fav-cont').is(':visible'))
			{
				$('#fav-cont').hide();
				$('#fav').css('color','black');
			}
			else
			{
				$('#fav-cont').show();
				$('#fav').css('color','red');
				//hide others
				if($('#srs-cont').is(':visible'))
				{
					$('#srs-cont').hide();
					$('#series').css('color','black');
				}
				if($('#follow-cont').is(':visible'))
				{
					$('#follow-cont').hide();
					$('#follow').css('color','black');
				}
			}
		});
	
		$('#follow').click(function(){
			if($('#follow-cont').is(':visible'))
			{
				$('#follow-cont').hide();
				$('#follow').css('color','black');
			}
			else
			{
				$('#follow-cont').show();
				$('#follow').css('color','red');
				//hide others
				if($('#srs-cont').is(':visible'))
				{
					$('#srs-cont').hide();
					$('#series').css('color','black');
				}
				if($('#fav-cont').is(':visible'))
				{
					$('#fav-cont').hide();
					$('#fav').css('color','black');
				}
			}
		});
		
		*/
}]);
})();


