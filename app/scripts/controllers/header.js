app.controller('header', function header($scope, $timeout, keyboardManager, fullscreen) {
	'use strict';
	
	var onHeader = false;
	$scope.header = true;
	$scope.userDropDownShow = false;
	$scope.zen = false;

	$scope.onUserClick = function() {
		$scope.userDropDownShow = !$scope.userDropDownShow;
	}

	function applyHeader(){
		if(onHeader || !$scope.zen) {
			$scope.header = true;
		} else {
			$scope.header = false;
		}
	}

	$scope.onMouseEnterHeader = function() {
		onHeader = true;
		applyHeader();
	}

	$scope.onMouseLeaveHeader = function() {
		onHeader = false;
		applyHeader();
	}
	
	function applyZenMode(){
		if ($scope.zen) {
			fullscreen.requestFullScreen(null);
			$scope.header = false;
		} else {
			fullscreen.cancelFullScreen();
			$scope.header = true;
		}
	}

	keyboardManager.bind('f11',function(){
		$scope.zen = !$scope.zen;
		applyZenMode();
	});
	keyboardManager.bind('esc',function(){
		$scope.zen = false;
		applyZenMode();
	});
});	