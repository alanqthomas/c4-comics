"use strict";

(function() {
	
	angular.module('tictactoe').controller('gameCtrl', ['$scope', '$http', '$rootScope', '$cookies', 
	                                             function($scope,   $http,   $rootScope,   $cookies){

		
		// Score persistence initialization
		console.log("Score: ", $cookies.get("userScore"));
		var x = parseInt($cookies.get("userId"));
		x = parseInt(x/100000);
		$scope.update = {};
		$scope.update.id = x;
		$scope.update.email = $cookies.get("userEmail");
		$scope.update.name = $cookies.get("userName");
		$scope.update.score = $cookies.get("userScore");
		
		console.log($scope.update);
		
		
		// Initialization
		var b = new Board();
		var player = 'X';
		var cpu = 'O';
		var playerStart = true;	
		$scope.winner = null;		
		$scope.playerTurn = playerStart;
		$scope.msg = "Your turn";
		playerStart = false;
		
		$scope.setMessage = function(message){
			$scope.gameMsg = message;
		};
		
		$scope.cellText = function(row, col) {
			var value = b.cell(row, col);
			return value ? value : '';
		};
		
		$scope.cellClick = function(row, col) {
			if($scope.winner != null){
				$scope.setMessage("Game is over. Start another to play");
				return;
			}
			if(!$scope.playerTurn){
				$scope.setMessage("Not your turn");
				return;
			}			
			if(b.cell(row, col) != null){
				$scope.setMessage("Pick an empty spot");
				return;
			}
			
			b.setCell(row, col, player);			
			$scope.winner = b.checkWin();
			
			$scope.playerTurn = false;
			
			if($scope.winner != null){
				endGame();
				return;
			}
			
			cpuTurn();			
		};	
		
		var cpuTurn = function(){
			while(true){
				var rrow = Math.floor(Math.random() * 3);
				var rcol = Math.floor(Math.random() * 3);
				if(b.cell(rrow, rcol) == null){
					b.setCell(rrow, rcol, cpu);
					break;
				}
			}
			
			$scope.winner = b.checkWin();
			if($scope.winner != null){
				endGame();
				return;
			}
			
			$scope.playerTurn = true;
		};
		
		var endGame = function() {
			if($scope.winner == 'X'){
				$scope.msg = "You win!";
				updateScore();
			}
			if($scope.winner == 'O'){
				$scope.msg = "Computer wins";
			}
			if($scope.winner == 'T'){
				$scope.msg = "Draw!";
			}
		};
		
		$scope.reset = function(){		
			$scope.winner = null;
			$scope.msg = "Your turn";
			b = new Board();		
			
			$scope.playerTurn = playerStart;
			
			if(!$scope.playerTurn){
				cpuTurn();
			}			
			playerStart = !playerStart;
		};	
		
		var updateScore = function(){
			var x = parseInt($cookies.get("userScore"));
			x += 1;
			$cookies.put("userScore", x);
			$scope.update.score = x;
			
			gapi.client.userendpoint.updateUser($scope.update).execute(
				function(res){
					if(!res.code){
						console.log(res);
					} else {
						console.log("Error: ", res.code);
					}
				}
			);
		};
		
	}]);
	
	function Board () {
		this.board = [null, null, null,
		              null, null, null,
		              null, null, null];
		
		this.cell = function(row, col){
			var ret = this.board[row * 3 + col];
			return ret;
		}
		
		this.setCell = function (row, col, value) {
			this.board[row * 3 + col] = value;
		}
		
		this.checkWin = function(){
			for(var i = 0; i < 3; i++){
				
				if(this.cell(i, 0) && this.cell(i, 0) == this.cell(i, 1) && this.cell(i,1) == this.cell(i, 2)){
					console.log("1");
					return this.cell(i, 0);
				}
				
				if(this.cell(0, i) && this.cell(0, i) == this.cell(1, i) && this.cell(1,i) == this.cell(2, i)){
					console.log("2");
					return this.cell(0, i);					
				}
				
				if(this.cell(0, 0) && this.cell(0, 0) == this.cell(1, 1) && this.cell(1,1) == this.cell(2, 2)){
					console.log("4");
					return this.cell(0, 0);					
				}
				
				if(this.cell(0, 2) && this.cell(0, 2) == this.cell(1, 1) && this.cell(1,1) == this.cell(2, 0)){
					console.log("4");
					return this.cell(0, 2);					
				}
			}
			
			for(var i = 0; i < 9; i++){
				if(this.board[i] == null){
					return;
				}
			}
			
			return 'T';
		}
	}
	
})();