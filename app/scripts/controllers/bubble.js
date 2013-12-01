app.controller('bubble', function code($scope) {
	$scope.currentBubbleIndex = 0;
	$scope.show = false;

	// set the previous bubble as current index
	$scope.previous = function() {
		if ($scope.currentBubbleIndex > 0) {
			$scope.currentBubbleIndex -= 1;
		}
	};

	// set the current bubble index at -1, that way there is no way that any bubble is visible
	$scope.skip = function() {
		$scope.currentBubbleIndex = -1;
		$scope.show = false;
	};

	// set the next bubble as current index
	$scope.next = function() {
		if ($scope.currentBubbleIndex < $scope.tutorialText.messages.length -1) {
			$scope.currentBubbleIndex += 1;
		} else {
			$scope.show = false;
		}
	};

	$scope.head = function() {
		if ($scope.currentBubbleIndex == 0) {
			return "disabled";
		}
	};

	$scope.last = function() {
		if ($scope.currentBubbleIndex == $scope.tutorialText.messages.length -1 ) {
			return "disabled";	
		}
	};


	$scope.getBubbleClass = function() {
		var resultClassStr = "triangle-border ";
		if ($scope.currentBubbleIndex == 0) {
			resultClassStr += "left centered";

		} else if ($scope.currentBubbleIndex == 1) {
			resultClassStr += "right centered";

		} else if ($scope.currentBubbleIndex > 1 && $scope.currentBubbleIndex < 5) {
			resultClassStr += "top";

			if($scope.currentBubbleIndex == 2){
				resultClassStr += " login";
			}else if ($scope.currentBubbleIndex == 3){
				resultClassStr += " search";
			}else{
				resultClassStr += " fullscreen";
			}

		} else if ($scope.currentBubbleIndex == 5) {
			resultClassStr += "output";
		}
		return resultClassStr;
	};

	// This object contains the tutorialText string for the tutorial's bubble.
	$scope.tutorialText = {
		previous: 'previous',
		skip: 'skip',
		next: 'next',
		messages: [
			"You can get the anwser to a quick question by writing Scala code into this editor"
			,"The code is evaluated and displayed in the insight view"
			,"You can loggin here and get or save snippets of Scala code"
			,"You can use the search bar to find Scala documentation or to look for snippet code examples"
			,"You can use the icons to enter the fullscreen mode or to hide the insight view"
			,"The output console can be open by clicking on the bottom right icon of the screen"
		]
	};
});