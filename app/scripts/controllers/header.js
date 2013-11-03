app.controller('header', function header($scope) {
	'use strict';

	$scope.user = null;
	$scope.init = function(){
		$scope.user = user;
	}

	$scope.loggedIn = function(){
		return null !== $scope.user;
	}

	$scope.profileOpen = false;
	$scope.outProfile = function(){
		$scope.profileOpen = false;
	}
	$scope.toogleProfile = function(){
		$scope.profileOpen = !$scope.profileOpen;
	}
});	