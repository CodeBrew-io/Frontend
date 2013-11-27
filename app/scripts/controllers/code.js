app.controller('code', function code($scope, $rootScope, $timeout, scalaEval, fullscreen, snippets, user, throttle) {
	'use strict';
	var compilationInfo = [];
	var cmLeft, cmRight = null;
	var viewingMySnippets = false;

	$scope.code = "";
	$scope.errorWidgetLines = [];
	$scope.errorMarkedTexts = [];
	$scope.loggedIn = user.loggedIn;
	$scope.fetching = scalaEval.fetching;

	$rootScope.$on('selectedCode', function(event, code){
		if(code){
			$scope.code = [$scope.code, code].join('\n\n').trim();
		}
	});

	snippets.current().then(function(data){
		$scope.code = data;
	});

	$scope.fullscreen = function(){
		fullscreen.apply(true);
	}

	$scope.clear = function(){
		$scope.code = "";
	}

	$scope.optionsCode = {
		extraKeys: {"Ctrl-Space": "autocomplete"},
		fixedGutter: false,
		lineNumbers: true,
		mode: 'text/x-scala',
		theme: 'solarized light',
		smartIndent: false,
		autofocus: true,
		autoCloseBrackets: true,
		highlightSelectionMatches: {
			showToken: false,
		},
		onChange: function(cm) {
			snippets.saveLocal($scope.code);
			throttle.event(function() {
				scalaEval.insight($scope.code).then(function(data){
					$scope.insight = data.insight;

					if (data.output){
						if (!$scope.manuallyClosedConsole){
							$scope.withConsole = true;
						}
						$scope.console = data.output;
					}else{
						$scope.console = "";
					}

					ClearErrorWidgetLines();
					ClearErrorSquigglyLines();
					if (data.errors){

						data.errors.forEach(function(value) {	
							$scope.errorWidgetLines.push(AddErrorWidgetLines(value));							
							$scope.errorMarkedTexts.push(AddErrorSquigglyLines(value));
						});
					}
					/* Make the squiggly line in the code editor for error message */    
				    function AddErrorSquigglyLines(value) {
				    	var cur = cm.getDoc().posFromIndex(value.position);
						var currentLine = $scope.code.split("\n")[cur.line];
				    	var markedText = cm.markText(
				    		{line: cur.line, ch: cur.ch}, 
				    		{line: cur.line, ch: currentLine.length},
				    		{className: "error"}
				    	);
						return markedText;
						
				  	}
				  	function ClearErrorSquigglyLines(){
				  		$scope.errorMarkedTexts.forEach(function (value){
				  			value.clear();
				  		});
					    $scope.errorMarkedTexts = [];
				  	}
				  	function AddErrorWidgetLines(value){
				  		var cur = cm.getDoc().posFromIndex(value.position);
						var currentLine = $scope.code.split("\n")[cur.line];
				  		var msg = document.createElement("div");
				      	var icon = msg.appendChild(document.createElement("i"));
				      	icon.className = "fa fa-exclamation-circle lint-error-icon";
				      	msg.appendChild(document.createTextNode(value.message));
				      	msg.className = "lint-error";
						var errorLineWidget = cm.addLineWidget(cur.line, msg);
						return errorLineWidget;
				  	}
				  	function ClearErrorWidgetLines(){
				  		$scope.errorWidgetLines.forEach(function (value){
				  			cm.removeLineWidget(value);
				  		});
					    $scope.errorWidgetLines = [];
				  	}

				});
			});
		},
		onScroll: function(cm) {
			if ($scope.cmLeft === null) {
				$scope.cmLeft = cm;
			}

			var scrollLeftInfo = cm.getScrollInfo();
			if ($scope.cmRight !== null) {
				$scope.cmRight.scrollTo(null, scrollLeftInfo['top']);
			}
		},
		onLoad: function(cm) {
			$scope.cmLeft = cm;
		}
	};

	$scope.optionsInsight = {
		fixedGutter: false,
		lineNumbers: true,
		mode: 'text/x-scala',
		theme: 'solarized light',
		readOnly: 'nocursor',
		onScroll: function(cm) {
			if($scope.cmRight === null) {
				$scope.cmRight = cm;
			}
			var scrollRightInfo = cm.getScrollInfo();
			if ($scope.cmLeft !== null) {
				$scope.cmLeft.scrollTo(null, scrollRightInfo['top']);
			}
		},
		onLoad: function(cm) {
			$scope.cmRight = cm;
		}
	};

	$scope.withInsight = true;
	$scope.toogleInsight = function() {
		$timeout(function() {
			$scope.cmLeft.refresh();
			$scope.cmRight.refresh();
		});

		$scope.withInsight = !$scope.withInsight;
	}

	$scope.savingMessage = "saving...";
	$scope.isSavingEnabled = true;
	$scope.publish = function($event){
		if ($scope.isSavingEnabled) {
			$scope.isSavingEnabled = false
			snippets.save({"code": $scope.code}).$promise.then(function(data){
				$scope.mySnippets = $scope.mySnippets.concat({
					"id": data.id,
					"code": $scope.code
				});
				$timeout(function() {
					$scope.isSavingEnabled = true;
				}, 1000);
			})
		}
	}

	$scope.hasSnippets = function(){
		return $scope.mySnippets.length > 0;
	}

	$scope.viewingMySnippets = function(){
		return user.loggedIn() && viewingMySnippets;
	}
	$scope.toogleMySnippets = function(){
		if(!angular.isDefined($scope.mySnippets)) {
			$scope.mySnippets = snippets.queryUser();
		}

		viewingMySnippets = !viewingMySnippets;
	}

	$scope.insertSnippet = function(snippet){
		$scope.code = $scope.code + '\n' + snippet.code;
	};

	$scope.deleteSnippet = function(snippet){
		snippets.delete({id: snippet.id});
		$scope.mySnippets = $scope.mySnippets.filter(function(s){
			return s != snippet;
		})
	};

	$scope.withConsole = false;
	$scope.manuallyClosedConsole = false;
	$scope.toogleConsole = function() {
		$scope.withConsole = !$scope.withConsole;
		if (!$scope.withConsole){
			$scope.manuallyClosedConsole = true;
		}
		$timeout(function() {
			$scope.cmLeft.refresh();
			$scope.cmRight.refresh();
		});
	}
	$scope.consoleIsEmpty = function () {
		return !$scope.console;
	}

	$scope.clearConsole = function() {
		$scope.console = "";
		$scope.lastExecutionOutput = "";
	}
});