app.controller('header', function header($scope, user) {
	'use strict';

	$scope.user = null;
	$scope.init = function(){
		$scope.user = user.info();
	}

	$scope.loggedIn = function(){
		return undefined !== $scope.user.name;
	}

	$scope.profileOpen = false;
	$scope.outProfile = function(){
		$scope.profileOpen = false;
	}
	$scope.toogleProfile = function(){
		$scope.profileOpen = !$scope.profileOpen;
	}
});	