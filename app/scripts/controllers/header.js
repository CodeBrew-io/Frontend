app.controller('header', function header($scope, $timeout, keyboardManager, fullscreen) {
	'use strict';

	$scope.header = true;
	$scope.user = false;
	$scope.zen = fullscreen.zen;

	$scope.onUserClick = function() {
		$scope.user = !$scope.user;
	}

	function applyHeader(onHeader){
		if(onHeader || !$scope.zen) {
			$scope.header = true;
		} else {
			$scope.header = false;
		}
	}

	$scope.onMouseEnterHeader = function() {
		// applyHeader(true);
		$scope.header = true;
	}

	$scope.onMouseLeaveHeader = function() {
		// applyHeader(false);
		$scope.header = false;
	}

	$scope.$on(fullscreen.event, function(_, zen){
		$scope.zen = zen;
	});
});	