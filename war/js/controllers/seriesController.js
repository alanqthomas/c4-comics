"use strict";

//any news made page needs to add to the grunt.js file
(function() {

angular.module('c4').controller('seriesCtrl', ['$scope', '$http', 'GApi', '$state', '$stateParams', 'imgService', 'IMG_PREFIXES', "GAuth", "GData",
                                    function(	 $scope, $http,   GApi,   $state,   $stateParams, 	imgService,    IMG_PREFIXES,   GAuth,   GData ){
		//TODO EDIT Name, description
		//init
		//DO NOT MOVE THINGS IN INIT
		$scope.loadMore = function() {
			if($scope.comics_reserve.length >0 ){
				$scope.comics.push($scope.comics_reserve.shift());
			}
		}
		$scope.getFirstPageURL = function(id){
			return imgService.getURL(IMG_PREFIXES.PAGE, id);
		}
		$scope.series_id=$stateParams.id;
		//aggregate comics
		$scope.comics=[];
		$scope.comics_reserve=[];
		$scope.author_name="Author Name Not Found";
		$scope.series = {
				authorId: null,
				title: "No Title Found",
				description: "No Summary Found",
				comics: [],
				rating: null,
				bgImageURL: null
		};
		$scope.editTitle = false;
		$scope.editDescription = false;
		//END init
		//EDIT SERIES FUNCTIONS
		
		$scope.saveSettings= function(){
			$scope.newSeries= {
				id: $scope.series_id,
				title: $scope.series.title,
				description: $scope.series.description
			};
			GApi.execute("seriesendpoint", "updateSeries", $scope.newSeries).then(
				function(resp){
					$scope.updateSeries();
				},
				function(resp){
					
				}
			);
		};
		$scope.toggle= function(toToggle){
			if(toToggle == "editTitle"){
				if($scope.editTitle == true){
					$scope.saveSettings();
				}
				$scope.editTitle = !($scope.editTitle);
			}
			if(toToggle == "editDescription"){
				if($scope.editDescription == true){
					$scope.saveSettings();
				}
				$scope.editDescription = !($scope.editDescription);
			}
		}
		$scope.updateSeries = function(){
			GApi.execute("seriesendpoint", "getSeries",{"id":$scope.series_id}).then(
				function(resp){	
					$scope.series.title= resp.title;
					$scope.series.description= resp.description;
				}, function(resp){
				}
			);
		};
		//END EDIT FUNCTIONS
		
		//execute using (endpoint, method for endpoint, parameter for method)
		GApi.execute("seriesendpoint", "getSeries", {"id":$scope.series_id}).then(
			function(resp){
				$scope.series = resp;
				//query for author name
				GApi.execute( "c4userendpoint","getC4User", {"id":$scope.series.authorId}).then(
					function(resp1){
						$scope.author_name = resp1.username;
					},
					function(resp1){	
					}
				);
				//query for comics
				if($scope.series.comics == null || $scope.series.comics.length == 0){
					console.log("no comics");
				} else{
					//query for comics_ids 
					for(var i = 0; i < $scope.series.comics.length; i ++){
						GApi.execute("comicendpoint","getComic", {"id":$scope.series.comics[i]}).then(
							function(resp2){
								$scope.comics_reserve.push({
									id:resp2.id,
									//get the first page for image
									page: resp2.pages,
									title:resp2.title,
									type:"comics"
								});
								//put one in the comics
								if($scope.comics_reserve.length > 0){
									$scope.comics.push($scope.comics_reserve.shift());
								}
							},
							function(resp2){
								console.log("no comics found for " + $scope.series.comics[i]);
							}
						);
					}
				}
				$scope.user_id = 0;
				//check if user is logged in and subbed
				$scope.update_sub = function() {GAuth.checkAuth().then(
						function(){
							$scope.logged_in = true;
							$scope.user_id = GData.getUser().id;
							if($scope.series.authorId == $scope.user_id){
								//console.log("Comic Author ID: " + $scope.series.authorId);
								//console.log("User ID: " + $scope.user_id);
								$scope.is_owner = true;
							}
							GApi.execute("seriesendpoint", "getSeries", {"id":$scope.series_id}).then(
								function(resp){
									$scope.series = resp;
									if($scope.series.subscribers == null){
										$scope.subbed = false;
									}
									else {
										if($scope.series.subscribers.indexOf($scope.user_id.toString()) >= 0){
											$scope.subbed = true;
										}
										else{
											$scope.subbed = false;
										} 
									}
								},
								function(resp){	
								}
							);
						},
						function(){
							$scope.logged_in = false;
							$scope.user_id = null;
						}
					);
					$scope.is_owner = false;
				};
				$scope.update_sub();
				
			},function(resp){
			}
		);
		
		/* attempted ngStyle, they dont work
		$scope.bg_img="background:#ffffff url('https://www.planwallpaper.com/static/images/6790904-free-background-wallpaper.jpg') no-repeat center center;";
		$scope.bg_img="{'background-color':'red'}";
		*/
		$scope.goToAuthor=function(){
			if($scope.series.authorId==null){
				$state.go('error');
			}
			else{
				$state.go('profile',{"id": $scope.series.authorId});
			}
		}
		$scope.goToComics = function(id){
			if(id == null){
				$state.go("error");
			}
			else{
				$state.go("comic", {"id": id});
			}
		}
		$scope.goToEditComics = function(id){
			if(id == null){
				$state.go("error");
			}
			else{
				$state.go("editComic", {"id": id});
			}
		}
		
		//subscribing and unsubscribing
		$scope.subscribe = function(){
			GApi.execute("c4userendpoint", "addsubscription", {"userId": $scope.user_id, "seriesId": $scope.series_id}).then(
				function(resp){
					$scope.update_sub();
					//$scope.subbed = true;
				},
				function(resp){
					
				}
			);
		};
		$scope.unsubscribe = function(){
			GApi.execute("c4userendpoint", "deletesubscription", {"userId": $scope.user_id, "seriesId": $scope.series_id}).then(
				function(resp){
					$scope.update_sub();
					//$scope.subbed = false;
				},
				function(resp){
					
				}
			);
		};
		$scope.newComics = function(){
			if($scope.is_owner){
				//console.log("seriesID: " + $scope.series_id);
				GApi.execute("comicendpoint","insertComic", {"authorId":$scope.user_id, "description":"New comics description", "seriesId": $scope.series_id}).then(
					function(resp){
						//add the new comic
						GApi.execute("seriesendpoint", "addseriescomic", {"seriesId" : $scope.series_id,"comicId" : resp.id}).then(
							function(resp1){
								$scope.goToEditComics(resp.id);
							},
							function(resp1){
								console.log("SEVERE ERROR: Series not associated with user.")
							}
						);
					}, function(resp){
						console.log("Failed to create new series.");
						console.log(resp);
					}
				);
			} else {
				console.log("Not logged in as owner, cannot add new comic.");
			}
		}
		
		
		
}]);
})();
