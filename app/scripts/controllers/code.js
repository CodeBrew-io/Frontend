app.controller('code', function code($scope, $rootScope, $timeout, scalaEval, fullscreen, snippets, user, throttle, errormessage) {
	'use strict';
	$scope.code = "1+1";
	var compilationInfo = [];
	var cmLeft, cmRight = null;
	$scope.mySnippets = [];

	$scope.$watch('user.get',function(){
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
		var cur = cm.getCursor();
		var lines = $scope.code.split("\n");
		var pos = cur.ch;
		for (i = 0; i < cur.line; i++){
			pos += lines[i].length + 1;
		}
		$scope.editorSending.canShowInsight = false;
		scalaEval.autocomplete($scope.code, pos).then(function(data){
			$scope.editorSending.canShowInsight = true;

			CodeMirror.showHint(cm, function(cm, options){
				var i;
				var curFrom = cm.getCursor();
				var curTo = cm.getCursor();
				var currentLine = $scope.code.split("\n")[curFrom.line];

				function delimiter(c){
					return c == ' ' || c == '.'
				}

				for (i = curFrom.ch-1; i >= 0 && !delimiter(currentLine[i]); i--){
					curFrom.ch = i;
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
					compilationInfo = data.CompilationInfo;
					$scope.editorSending.canShowInsight = true;
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

	$scope.publish = function(){
		snippets.save({"code": $scope.code}).$promise.then(function(data){
			$scope.mySnippets = $scope.mySnippets.concat({
				"id": data.id,
				"code": $scope.code
			});
		})
	}

	$scope.hasSnippets = function(){
		return $scope.mySnippets.length > 0;
	}

	$scope.viewingMySnippets = false;
	$scope.toogleMySnippets = function(){
		$scope.viewingMySnippets = !$scope.viewingMySnippets;
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
	
 	/* Make the squiggly line in the code editor for error message */    
    function SetErrorSquigglyLines(lineNumber, positionInit, rangeCharacters) {
		errormessage.waitingCodeMirror().then(function(codeMirror) {
			var markedText = codeMirror.markText({line: lineNumber, ch: positionInit}, {line: lineNumber, ch: rangeCharacters + positionInit });
			markedText.className = "error";
		});
  	}
});