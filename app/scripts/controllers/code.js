app.controller('code', function code($scope, $rootScope, $timeout, scalaEval, snippets, user, throttle, keyboardManager) {
	'use strict';

	var insightWidget = [];
	var errorWidgetLines = [];
	var errorMarkedTexts = [];

	var viewingMySnippets = false;
	var cm = null;

	$scope.code = "";
	$scope.mySnippets = [];
	$scope.loggedIn = user.loggedIn;
	$scope.fetching = scalaEval.fetching;

	snippets.current().then(function(data){
		$scope.code = data.code;
	});

	$scope.saveMySnippetCss = function() {
		var saveIconCss = $scope.isSaving ? ' fa-check saving' : ' fa-floppy-o';
		if(angular.isDefined($scope.code) && $scope.code !== "") {
			if($scope.code.length == 0 || errorWidgetLines.length > 0) {
				saveIconCss += ' disable';	
			}
		} else {
			saveIconCss += ' disable';
		}

		return saveIconCss;
	}

	$scope.logOut = function(){
		user.logout();
	};

	$scope.getThemeShort = snippets.getThemeShort;
	$scope.toogleTheme = function(){
		cm.refresh();
		snippets.toogleTheme();
	}
	$scope.isLigth = snippets.isLigth;

	$scope.optionsCode = {
		extraKeys: {"Ctrl-Space": "autocomplete"},
		fixedGutter: false,
		lineNumbers: true,
		mode: 'text/x-scala',
		theme: snippets.getTheme(),
		smartIndent: false,
		autofocus: true,
		autoCloseBrackets: true,
		styleActiveLine: true,
		keyMap: "sublime",
		highlightSelectionMatches: { showToken: false },
		onLoad: function(cm_) { cm = cm_; }
	};

	$scope.$watch('code', function(){
		snippets.saveLocal($scope.code);
		
		// clear line errors
		errorWidgetLines.forEach(function (value){
  			cm.removeLineClass(value);
	  	});
	  	errorWidgetLines = [];

		errorMarkedTexts.forEach(function (value){
  			value.clear();
  		});
  		errorMarkedTexts = [];

		throttle.event(function() {
			scalaEval.insight($scope.code).then(function(data){
				// clear insight
				insightWidget.forEach(function(w){ 
					w.clear();
				});
				insightWidget = [];

				var code = $scope.code.split("\n");
				insightWidget = data.insight.map(function(value){
					if(value.type == "CODE") {
						// scala code output
						var currentLine = code[value.line - 1];
						var pre = document.createElement("pre");
						pre.className = "cm-s-solarized insight";
						pre.attributes["ng-class"] = "cm-s-{snippets.getThemeShort()}";
				      	CodeMirror.runMode(value.result, $scope.optionsCode.mode, pre);
						cm.addWidget({line: (value.line - 1), ch: currentLine.length}, pre, false, "over");
						return {
							clear: function(){ pre.parentElement.removeChild(pre); }
						}
					} else if (value.type == "JSON") {
						var result = JSON.parse(value.result);
						var data = result.data;
						var width = 200;
						var height = 200;

						var xf = function(v){ return v[0] };
						var yf = function(v){ return v[1] };

						var minX = d3.min(data, xf);
						var minY = d3.min(data, yf);
						var maxX = d3.max(data, xf);
						var maxY = d3.max(data, yf);

						var scaleX = d3.scale.linear().
							domain([minX, maxX]).
							range([0, width])

						var scaleY = d3.scale.linear().
							domain([minY, maxY]).
							range([height, 0])

						var line = d3.svg.line().
                        	x(function(v){ return scaleX(xf(v)); }).
                        	y(function(v){ return scaleY(yf(v)); })

                        var node = document.createElement("svg");
						var svg =  d3.select(node).append("svg").
                                    attr("width", width).
                                    attr("height", height);

						var plot = svg.append("path").
                            attr("d", line(result.data)).
                            attr("stroke", "blue").
                            attr("stroke-width", 2).
                            attr("fill", "none");

						return cm.addLineWidget(value.line - 1, node);
					}
				});

				["errors", "warnings", "infos"].forEach(function(severity){
					if (data[severity]){
						data[severity].forEach(function(value) {	
							errorWidgetLines.push(addErrorWidgetLines(severity, value));							
							errorMarkedTexts.push(addErrorSquigglyLines(severity, value));
						});
					}
				});

				/* Make the squiggly line in the code editor for error message */    
			    function addErrorSquigglyLines(severity, value) {
			    	var cur = cm.getDoc().posFromIndex(value.position);
			    	var currentLine = code[cur.line];
			    	return cm.markText(
			    		{line: cur.line, ch: cur.ch}, 
			    		{line: cur.line, ch: currentLine.length},
			    		{className: severity}
			    	);
			  	}

			  	function addErrorWidgetLines(severity, value){
			  		var msg = document.createElement("div");
			  		var cur = cm.getDoc().posFromIndex(value.position);
			      	var icon = msg.appendChild(document.createElement("i"));
			      	icon.className = "fa ";
			      	if(severity == "errors") {
						icon.className += "fa-times-circle";
			      	} else if(severity == "warnings") {
						icon.className += "fa-exclamation-triangle";
			      	} else if(severity == "infos") {
						icon.className += "fa-info-circle";
			      	}
			      	msg.appendChild(document.createTextNode(value.message));
			      	msg.className = "error-message";

					return cm.addLineWidget(cur.line, msg);
			  	}
			});
		});
	});

	$rootScope.$on('selectedCode', function(event, code){
		if(code){
			$scope.code = [$scope.code, code].join('\n\n').trim();
		}
	});

	$rootScope.$on('setCode', function(event, code){
		$scope.code = code;
	});

	$scope.save = function(){
		// We want to be able to save a snippet only if it's not empty.
		if ($scope.code.length > 0) {
			if($scope.isSaving) return;

			user.doAfterLogin(function(user){
				$scope.isSaving = true;
				snippets.save({"code": $scope.code}).$promise.then(function(data){
					$scope.mySnippets = $scope.mySnippets.concat({
						"id": data.id,
						"code": $scope.code,
						"user": user.codeBrewUser.userName
					});
					$timeout(function() { $scope.isSaving = false; }, 1000);
				});
			});
		}
	}

	$scope.hasSnippets = function(){
		return $scope.mySnippets.length > 0;
	}

	$scope.viewingMySnippets = function(){
		return user.loggedIn() && viewingMySnippets;
	}
	$scope.toogleMySnippets = function(){
		// login if need be
		user.doAfterLogin(function(user){
			$scope.mySnippets = snippets.queryUser();
			viewingMySnippets = !viewingMySnippets;
		});
	}

	$scope.insertSnippet = function(snippet){
		$scope.code += ($scope.code.length > 0 ? '\n' : '') + snippet.code;
	};

	$scope.deleteSnippet = function(snippet){
		if(window.confirm("Delete snippet?")) {
			snippets.delete({id: snippet.id});
			$scope.mySnippets = $scope.mySnippets.filter(function(s){
				return s != snippet;
			});
		}
	};

	$scope.login = user.login;

	snippets.hack(function(t){
		$timeout(function() {
			cm.setOption("theme", t);
		});
	});

	$scope.showingSideMenu = false;
	$scope.toogleSideMenu = function(){
		$scope.showingSideMenu = !$scope.showingSideMenu;
	}

	// adding the keyboard's shortcuts
	//________________________________________

	// saving
	keyboardManager.bind('ctrl+s', function(e) {
		if ($scope.loggedIn() == true) {
			$scope.save();
		} else {
			$scope.login();
		}
	}, {'stop':true});

	// toggle my snippets
	keyboardManager.bind('ctrl+o', function(e) {
		if ($scope.loggedIn() == true) {
			$scope.toogleMySnippets();
		} else {
			$scope.login();
		}
	}, {'stop':true});

	// inverse color
	keyboardManager.bind('ctrl+i', function(e) {
		$scope.toogleTheme();
	});
});