"use strict";



(function() {


//angular.module('c4', ['ngAnimate', 'ui.bootstrap']);
angular.module('c4').controller('profileCtrl', ['$scope', '$http', 'GApi', 'GAuth', 'GData', '$stateParams',
                                    function(	 $scope,   $http,  GApi, 	GAuth, 	GData,	 $stateParams){	
	
		$scope.tabs = [{
	        slug: 'dashboard',
	        title: "Dashboard",
	        content: "Your Dashboard"
	      }, {
	        slug: 'room-1',
	        title: "Room 1",
	        content: "Dynamic content 1"
	      }, {
	        slug: 'room-2',
	        title: "Room 2",
	        content: "Dynamic content 2"
	      }];
			$scope.msg = "Hello, profile";
			$("#fav-cont").hide();
			$("#follow-cont").hide();
		
		
		$scope.profile_id = $stateParams.id;
		$scope.name = "Profile Name";
		$scope.comics;
		$scope.fav;
		$scope.bio = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quae cum essent dicta, finem fecimus et ambulandi et disputandi. Quod quidem iam fit etiam in Academia. Quam nemo umquam voluptatem appellavit, appellat Qui autem esse poteris, nisi te amor ipse ceperit? Quaerimus enim finem bonorum. Duo Reges: constructio interrete. Erit enim instructus ad mortem contemnendam, ad exilium, ad ipsum etiam dolorem. Quae contraria sunt his, malane? Hoc sic expositum dissimile est superiori. Semper enim ex eo, quod maximas partes continet latissimeque funditur, tota res appellatur. Rhetorice igitur, inquam, nos mavis quam dialectice disputare? Ab his oratores, ab his imperatores ac rerum publicarum principes extiterunt.";
		
		
		$scope.getUser=function(){
			var resultReq={
				"id":$scope.profile_id
			}
			GApi.execute("C4UserEndpoint","getC4User",resultReq).then(
				function(resp){	
					//dont know how to actually get 
					$scope.name=resp.items.username;
					$scope.comics=resp.items.userSeries;
					$scope.fav=resp.items.favorites;
					$scope.bio=resp.items.biography;
				}, function(resp){
					console.log("error no name");
					$scope.name="Profile Name";
				}
			);
			$scope.$apply;
		}
		
		
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


