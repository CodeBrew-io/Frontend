app.controller('code', function code($scope, $rootScope, $timeout, scalaEval, fullscreen, snippets, user, throttle) {
	'use strict';
	$scope.code = "List(1,2,3)";
	var compilationInfo = [];
	var cmLeft, cmRight = null;

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
				var completions = data.completions.map(function(c){ return {
					text: c.name,
					completion: c,
					render: function(el, _, _1){
						$(el).text(c.signature);
					},
				}});
				return {from: cur, to: cur, list: completions};
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
		snippets.save({code: $scope.code});
	}
});