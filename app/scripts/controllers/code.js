app.controller('code', function code(
	$scope, $rootScope, $timeout, $location,
	scalaEval, insightRenderer, errorsRenderer,
	snippets, user, throttle, keyboardManager, LANGUAGE) {

	'use strict';

	var cm = null;

	$scope.code = "";
	$scope.loggedIn = user.loggedIn;
	$scope.user = user.get;
	$scope.fetching = scalaEval.fetching;
	$scope.loggedIn = user.loggedIn;
	$scope.login = user.login;
	$scope.getThemeShort = snippets.getThemeShort;
	$scope.isLigth = snippets.isLigth;

	snippets.current().then(function(data){
		$scope.code = data.code;
	});

	$scope.saveCss = function() {
		var saveIconCss = $scope.isSaving ? ' fa-check saving' : ' fa-floppy-o';
		if(angular.isDefined($scope.code) && $scope.code !== "") {
			if($scope.code.length == 0) {
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


	$scope.toogleTheme = function(){
		cm.refresh();
		snippets.toogleTheme();
	}
	

	$scope.optionsCode = {
		extraKeys: {"Ctrl-Space": "autocomplete"},
		fixedGutter: true,
		coverGutterNextToScrollbar: true,
		lineNumbers: true,
		mode: 'text/x-' + LANGUAGE,
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
		insightRenderer.clear();
		errorsRenderer.clear();
		throttle.event(function() {
			scalaEval.insight($scope.code).then(function(data){
				var code = $scope.code.split("\n");
				insightRenderer.render(cm, $scope.optionsCode.mode, code, data.insight);
				errorsRenderer.render(cm, data, code);
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
		if ($scope.code.length > 0) {
			if($scope.isSaving) return;

			user.doAfterLogin(function(user){
				$scope.isSaving = true;
				snippets.save({"code": $scope.code}).$promise.then(function(snippet){
					// TODO: Append
					//$scope.mySnippets = $scope.mySnippets.concat(snippet);
					
					$timeout(function() { $scope.isSaving = false; }, 1000);
				});
			});
		}
	}

	snippets.hack(function(t){
		$timeout(function() {
			cm.setOption("theme", t);
		});
	});

	$scope.showingSideMenu = false;
	$scope.toogleSideMenu = function(){
		$scope.showingSideMenu = !$scope.showingSideMenu;
	}

	// Save
	keyboardManager.bind('ctrl+s', function(e) {
		if ($scope.loggedIn() == true) {
			$scope.save();
		} else {
			$scope.login();
		}
	}, {'stop':true});

	// Search
	keyboardManager.bind('ctrl+o', function(e) {
		if ($scope.loggedIn() == true) {
			$location.url("/Search");
		} else {
			$scope.login();
		}
	}, {'stop':true});

	// Inverse colors
	keyboardManager.bind('ctrl+i', function(e) {
		$scope.toogleTheme();
	});
});