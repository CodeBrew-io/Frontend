app.controller('bubble', function code($scope, $rootScope) {
	$scope.currentBubbleIndex = -1;
	$scope.show = true;

	// used as an enum for which side the bubble should be anchored.
	var anchorSide = {
		top: 'top',
		right: 'right',
		bottom: 'bottom',
		left: 'left'
	}

	// This object contains the tutorialText string for the tutorial's bubble.
	$scope.tutorialText = {
		previous: 'previous',
		skip: 'skip',
		next: 'next',
		bubbleInfoList: [
			{selector: '.code'
				, message: "You can get the anwser to a quick question by writing Scala code into this editor"
				, side: anchorSide.left
				, codeEditor: "List(1,2,3).map(_ + 2)"
			}
			,{selector: '.insight'
				, message: "The code is evaluated and displayed in the insight view"
				, side: anchorSide.right
				, codeInsight: "List(3, 4, 5)"
			}
			,{selector: '.console .handle .menu .chevron'
				, message: "The output console can be open by clicking on the bottom right icon of the screen"
				, side: anchorSide.bottom
			}
			,{selector: '.search-area'
				, message: "You can use the search bar to find Scala documentation or to look for snippet code examples"
				, side: anchorSide.top
			}
			//,{selector: '.icon', message: "You can use the icons to enter the fullscreen mode or to hide the insight view"}
		]
	};

	// contains the model of the text rendered in the bubble.
	$scope.bubbleText = '';

	// needed for the changes that occurs on it (mostly the position changes)
	$scope.bubbleJqueryElement = null; 

	// used for the CssClass of the bubble
	$scope.arrowSide = '';

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

						if (bubbleInfo.codeEditor !== undefined) {
							$rootScope.$emit('setCode', bubbleInfo.codeEditor);

						} else if (bubbleInfo.codeInsight !== undefined) {
							$rootScope.$emit('setInsight', bubbleInfo.codeInsight);
						}

						_setAbsolutePosition(element, elemOffset, bubbleInfo.side)
					}
				}
			}
		}
	}

	// for now, this function will be junk, only to test and understand where should be place stuff
	function _setAbsolutePosition(element, newOffset, sideAnchor) {
		var bubbleWidth = _getElementTotalWidth($scope.bubbleJqueryElement);
		var bubbleHeight = _getElementTotalWidth($scope.bubbleJqueryElement);

		var elementWidth = _getElementTotalWidth(element);
		var elementHeight = _getElementTotalHeight(element);

		if (sideAnchor == anchorSide.top) {
			$scope.arrowSide = 'top';
			newOffset.top = elementHeight; 

		} else if (sideAnchor == anchorSide.right) {
			$scope.arrowSide = 'right';
			newOffset.left -= bubbleWidth;
			newOffset.top = elementHeight / 2;
			
		} else if (sideAnchor == anchorSide.bottom) {
			$scope.arrowSide = '';
			newOffset.top -= elementHeight + bubbleHeight;
			
		} else if (sideAnchor == anchorSide.left) {
			$scope.arrowSide = 'left';
			newOffset.left += elementWidth;
			newOffset.top = elementHeight / 2;
		}

		// we check whether the bubble is going outside the window.
		var windowElement = $(window);
		var windowWidth = windowElement.width();
		var windowHeight = windowElement.height();

		if (newOffset.left + bubbleWidth > windowWidth) {
			newOffset.left = windowWidth - bubbleWidth - 10; // window's padding
		
		} 

		if (newOffset.top + bubbleHeight > windowHeight) {
			newOffset.top = windowHeight - bubbleHeight;
		}

		$scope.bubbleJqueryElement.offset(newOffset);
	}

	// this function will get the total width of an element returned by jQuery
	function _getElementTotalWidth(element) {
		if (element !== null && element !== undefined) {
			return element.width() 
					+ parseInt(element.css('padding-left'), 10)
					+ parseInt(element.css('padding-right'), 10)
					+ parseInt(element.css('margin-left'), 10)
					+ parseInt(element.css('margin-right'), 10);
		}
		return 0;
	}

	// this function will get the total height of an element returned by jQuery
	function _getElementTotalHeight(element) {
		if (element !== null && element !== undefined) {
			return element.height()
					+ parseInt(element.css('padding-top'), 10)
					+ parseInt(element.css('padding-bottom'), 10)
					+ parseInt(element.css('margin-top'), 10)
					+ parseInt(element.css('margin-bottom'), 10);
		}
		return 0;
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
});