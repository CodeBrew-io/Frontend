app.controller('bubble', function code($scope, $rootScope) {
	$scope.currentBubbleIndex = -1;
	$scope.show = (window.localStorage["bubble"] == 'true' || !angular.isDefined(window.localStorage["bubble"]));

	// used as an enum for which side the bubble should be anchored.
	var anchorSide = {
		top: 'top',
		right: 'right',
		bottom: 'bottom',
		left: 'left',
		center: 'center'
	}

	// This object contains the tutorialText string for the tutorial's bubble.
	$scope.tutorialText = {
		previous: 'previous',
		skip: 'skip',
		next: 'next',
		bubbleInfoList: [
			{selector: '.code'
				, message: "At the left, we've got a code editor so we can write some cool Scala stuff!"
				, side: anchorSide.center
				, codeEditor: "List(1,2,3).map(_ + 2)\nprintln(\"Hello, World!\")"
				, halfHeight: true
			}
			,{selector: '.insight'
				, message: "At the right, the code is evaluated and displayed in the insight view."
				, side: anchorSide.center
				, halfHeight: true
			}
			,{selector: '.console .handle .menu .chevron'
				, message: "The output console can be toggled by clicking on the bottom right icon of the screen.\nIt can also be cleared if the eraser is clicked."
				, side: anchorSide.bottom
			}
			,{selector: '.search-area'
				, message: "You can use the search bar to find Scala documentation or to look for snippet of code example written by you or other members."
				, side: anchorSide.top
			}
			,{selector: '.fullscreen'
				, message: "You can toggle the view in fullscreen."
				, side: anchorSide.right
				, leftOffset: 75
				, active: true
			}
			,{selector: '.toggleInsight'
				, message: "You can hide the insight view at the right."
				, side: anchorSide.right
				, leftOffset: 75
				, active: true
			}
			,{selector: '.saveSnippet'
				, message: "You can save your cool scala code."
				, side: anchorSide.right
				, leftOffset: 75
				, active: true
			}
			,{selector: '.toggleMySnippets'
				, message: "After saving your snippets, you can manage them by clicking this icon."
				, side: anchorSide.right
				, leftOffset: 75
				, active: true
			}
			,{selector: '.clearCode'
				, message: "You can clear all the code in the editor at the left."
				, side: anchorSide.right
				, leftOffset: 75
				, active: true
			}
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
		if(!$scope.show) return;
		
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

						}

						_setAbsolutePosition(element, elemOffset, bubbleInfo);
					}
				}
			}
		}
	}

	function _setAbsolutePosition(element, newOffset, bubbleInfo) {
		var bubbleWidth = _getElementTotalWidth($scope.bubbleJqueryElement);
		var bubbleHeight = _getElementTotalHeight($scope.bubbleJqueryElement) - 25; // because the margin-bottom is too much

		var elementWidth = _getElementTotalWidth(element);
		var elementHeight = _getElementTotalHeight(element);

		var sideAnchor = bubbleInfo.side;

		if (sideAnchor == anchorSide.top) {
			$scope.arrowSide = 'top';
			newOffset.top = elementHeight; 

		} else if (sideAnchor == anchorSide.right) {
			$scope.arrowSide = 'right';
			newOffset.left -= bubbleWidth;

			if (bubbleInfo.halfHeight == true) {
				newOffset.top = elementHeight / 2;
			
			} else {
				newOffset.top -= elementHeight / 2;
			}

			if (bubbleInfo.leftOffset != undefined && bubbleInfo.leftOffset !== null) {
				newOffset.left -= bubbleInfo.leftOffset;
			}
			
		} else if (sideAnchor == anchorSide.bottom) {
			$scope.arrowSide = '';
			newOffset.top -= elementHeight + bubbleHeight;
			
		} else if (sideAnchor == anchorSide.left) {
			$scope.arrowSide = 'left';
			newOffset.left += elementWidth;

			if (bubbleInfo.halfHeight == true) {
				newOffset.top = elementHeight / 2;
			}
		}

		// we check whether the bubble is going outside the window.
		var windowElement = $(window);
		var windowWidth = windowElement.width();

		if (newOffset.left + bubbleWidth > windowWidth) {
			newOffset.left = windowWidth - bubbleWidth - 10; // window's padding
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

	// When we resize the screen, the bubble should follow its element.
	$(window).resize(function() {
		_setBubbleData($scope.currentBubbleIndex);
	});

	$scope.bubbleInit = function() {
		$scope.currentBubbleIndex = 0;
		_setBubbleData(0);
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
		window.localStorage["bubble"] = false;
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