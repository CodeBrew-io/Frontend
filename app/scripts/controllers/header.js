(function() { /* Insight toggling */
		
	})();

	(function() { /* This part of the code is for the User's behavior in the header of the site */
		$scope.userDropDownShow = false;
		$scope.onUserClick = function() {
			$scope.userDropDownShow = !$scope.userDropDownShow;
		}
	})();

	(function() { /* The showing of the Modal */
		$scope.modalShow = true;
		$scope.showSettingsModal = function() {
			$scope.modalShow = !$scope.modalShow;
		}
	})();

	(function() { /* The Header's behavior of when the site is in ZenMode or not. */
		$scope.isHeaderShowing = true;
		$scope.onMouseEnterHeader = function() {
			$scope.isHeaderShowing = true;
		}

		$scope.onMouseLeaveHeader = function() {
			if ($scope.isZenMode && $scope.isHeaderShowing) {
				$scope.isHeaderShowing = false;
			}
		}
	})();

	(function() { /* For the fullscreen (Zen Mode) */
		$scope.isZenMode = false;
		$scope.onZenMode = function() {
			$scope.isZenMode = !$scope.isZenMode;

			$scope.code = 'isZenMode: ' + $scope.isZenMode;
			$scope.code += '\nisFullScreen: ' + $scope.FullScreen.isFullScreen();

			if ($scope.isZenMode) {
				$scope.FullScreen.requestFullScreen(null);

				// we hide the header and the insight;
				$scope.isHeaderShowing = false;
				$scope.insightShow = false;
			} else {
				$scope.FullScreen.cancelFullScreen();

				// we show the header and the insight;
				$scope.isHeaderShowing = true;
				$scope.insightShow = true;
			}
		}

		function toggleFullScreenEvent(e, scope) {
			var code = (e.keyCode ? e.keyCode : e.which);
			if (code == 122, 27) {
				scope.onZenMode();
			}
		}

		// keyboardManager.bind('meta+shift+p',open);
		// keyboardManager.bind('ctrl+shift+p',open);

		// $scope.FullScreen = 

	})();


	(function() { /* The pace of the keyboard before sending data to the server */
		$scope.isEditorPending = false;
		$scope.editorPendingPromise = null;

		function sendDataToServer() {
			$scope.isEditorPending = false;
			$scope.editorPendingPromise = null;
		}

		$scope.onEditorCodeChange = function() {
			if ($scope.isEditorPending && $scope.editorPendingPromise != null) {
				$timeout.cancel($scope.editorPendingPromise);
				$scope.editorPendingPromise = $timeout(sendDataToServer, 2000);
			} else {
				$scope.isEditorPending = true;
				$scope.editorPendingPromise = $timeout(sendDataToServer, 2000);
			}
			$scope.insightCode = "";
		}
	})();

	(function() { /* Make the squiggly line in the code editor for error message */    

	})();