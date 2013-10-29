app.controller('header', function header($scope, $timeout, keyboardManager, fullscreen) {
	'use strict';

	$scope.header = true;
	$scope.user = false;
	$scope.zen = false;

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
		applyHeader(true);
	}

	$scope.onMouseLeaveHeader = function() {
		applyHeader(false);
	}

	$scope.$on(fullscreen.zen, function(_, zen){
		$scope.zen = zen;
	});
});	