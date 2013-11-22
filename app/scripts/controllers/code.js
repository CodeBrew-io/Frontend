app.controller('code', function code($scope, $rootScope, $timeout, scalaEval, fullscreen, snippets, user, throttle) {
	'use strict';
	$scope.code = "1+1";
	var compilationInfo = [];
	var cmLeft, cmRight = null;
	$scope.mySnippets = [];
	$scope.errorWidgetLines = [];
	$scope.errorMarkedTexts = [];

	$scope.$watch('user.loggedIn()',function(){
		$scope.mySnippets = snippets.queryUser();
	})

	$rootScope.$on('selectedCode', function(event, code){
		if(code){
			$scope.code = [$scope.code, code].join('\n\n').trim();
		}
	});

	$scope.loggedIn = user.loggedIn;

	$scope.fullscreen = function(){
		fullscreen.apply(true);
	}

	// for the pending of the insight
	$scope.editorSending = {
		canShowInsight: true,
		numberOfChanges: 0
	};

	CodeMirror.commands.autocomplete = function(cm) {
		var i;
		$scope.editorSending.canShowInsight = false;
		scalaEval.autocomplete($scope.code, cm.getDoc().indexFromPos(cm.getCursor())).then(function(data){
			$scope.editorSending.canShowInsight = true;

			CodeMirror.showHint(cm, function(cm, options){
				var i;
				var curFrom = cm.getCursor();
				var curTo = cm.getCursor();
				var currentLine = $scope.code.split("\n")[curFrom.line];

				function delimiter(c){
					return  /^[a-zA-Z0-9\_]$/.test(c);
				}

				for (i = curFrom.ch-1; i >= 0 && delimiter(currentLine[i]); i--){
					curFrom.ch = i;
				}
				for (i = curTo.ch; i < currentLine.length && delimiter(currentLine[i]); i++){
					curTo.ch = i+1;
				}

				var term = currentLine.substr(curFrom.ch, curTo.ch - curFrom.ch);

				var completions = data.completions.filter(function(c){
					return c.name.toLowerCase().indexOf(term.toLowerCase()) != -1;
				}).map(function(c){ return {
					text: c.name,
					completion: c,
					alignWithWord: true,
					render: function(el, _, _1){
						$(el).text(c.signature);
					},
				}});
				return {from: curFrom, to: curTo, list: completions};
			});
		})
	};

	$scope.optionsCode = {
		extraKeys: {"Ctrl-Space": "autocomplete"},
		fixedGutter: false,
		lineNumbers: true,
		mode: 'text/x-scala',
		theme: 'solarized light',
		smartIndent: false,
		autofocus: true,
		autoCloseBrackets: true,
		onChange: function(cm) {
			$scope.editorSending.canShowInsight = false;

			throttle.event(function() {
				scalaEval.insight($scope.code).then(function(data){
					$scope.insight = data.insight;
					$scope.editorSending.canShowInsight = true;

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

	var viewingMySnippets = false;
	$scope.viewingMySnippets = function(){
		return user.loggedIn() && viewingMySnippets;
	}
	$scope.toogleMySnippets = function(){
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