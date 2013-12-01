app.controller('bubble', function code($scope) {
	$scope.currentBubbleIndex = -1;
	$scope.show = true;

	// This object contains the tutorialText string for the tutorial's bubble.
	$scope.tutorialText = {
		previous: 'previous',
		skip: 'skip',
		next: 'next',
		bubbleInfoList: [
			{selector: '.code', message: "You can get the anwser to a quick question by writing Scala code into this editor"}
			,{selector: '.insight', message: "The code is evaluated and displayed in the insight view"}
			,{selector: '.console', message: "The output console can be open by clicking on the bottom right icon of the screen"}
			,{selector: '.search-area', message: "You can use the search bar to find Scala documentation or to look for snippet code examples"}
			//,{selector: '.icon', message: "You can use the icons to enter the fullscreen mode or to hide the insight view"}
		]
	};

	// contains the model of the text rendered in the bubble.
	$scope.bubbleText = '';

	// needed for the changes that occurs on it (mostly the position changes)
	$scope.bubbleJqueryElement = null; 

	// FOR TESTS
	$scope.bubbleLeft = '';
	$scope.bubbleTop = '';

	// will get the informations needed for the bubble
	function _setBubbleData(index) {
		_ensureBubbleElement();

		var bubbleInfoList = $scope.tutorialText.bubbleInfoList;
		var maxSize = bubbleInfoList.length;

		if (index > -1 && index < maxSize) {
			var bubbleInfo = bubbleInfoList[index];

			// gets the target element's position
			var element = $(bubbleInfo.selector);
			if (element !== null && element !== undefined) {
				//bubbleData.position = element.offset();
				var elemOffset = element.offset();

				if (elemOffset !== null && elemOffset !== undefined) {

					// assign the new changes on the bubble's model
					if ($scope.bubbleJqueryElement !== null 
						&& $scope.bubbleJqueryElement !== undefined) 
					{
						$scope.bubbleText = bubbleInfo.message;
						$scope.bubbleJqueryElement.offset(elemOffset);

						$scope.bubbleLeft = elemOffset.left;
						$scope.bubbleTop = elemOffset.top;
					}
				}
			}
		}
	}

	// Will ensure that the Bubble's element has been fetched by jQuery.
	function _ensureBubbleElement() {
		if ($scope.bubbleJqueryElement === null || $scope.bubbleJqueryElement === undefined) {
			$scope.bubbleJqueryElement = $('.bubble');
		}
	}

	// set the previous bubble as current index
	$scope.previous = function() {
		if ($scope.currentBubbleIndex > 0) {
			$scope.currentBubbleIndex -= 1;
			_setBubbleData($scope.currentBubbleIndex);
		}
	};

	// set the current bubble index at -1, that way there is no way that any bubble is visible
	$scope.skip = function() {
		$scope.currentBubbleIndex = -1;
		$scope.show = false;
	};

	// set the next bubble as current index
	$scope.next = function() {
		if ($scope.currentBubbleIndex < $scope.tutorialText.bubbleInfoList.length -1) {
			$scope.currentBubbleIndex += 1;
			_setBubbleData($scope.currentBubbleIndex);

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
		if ($scope.currentBubbleIndex == $scope.tutorialText.bubbleInfoList.length -1 ) {
			return "disabled";	
		}
	};

	/*
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
	};*/

	/*/ assign the first tutorial bubble
	$(document).ready(function() {
		_setBubbleData(0);
	});*/
});