app.controller('code', function code(
	$scope, $rootScope, $timeout, $location,
	scalaEval, insightRenderer, errorsRenderer, snippets, user, throttle, keyboardManager) {

	'use strict';

	var cm = null;

	$scope.code = "";
	
	$scope.loggedIn = user.loggedIn;
	$scope.fetching = scalaEval.fetching;

	$scope.user = user.get;

	$scope.loggedIn = user.loggedIn;

	snippets.current().then(function(data){
		$scope.code = data.code;
	});

	$scope.saveMySnippetCss = function() {
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

	$scope.getThemeShort = snippets.getThemeShort;
	$scope.toogleTheme = function(){
		cm.refresh();
		snippets.toogleTheme();
	}
	$scope.isLigth = snippets.isLigth;

	$scope.optionsCode = {
		extraKeys: {"Ctrl-Space": "autocomplete"},
		fixedGutter: true,
		coverGutterNextToScrollbar: true,
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
			$location.url("/Search");
		} else {
			$scope.login();
		}
	}, {'stop':true});

	// inverse color
	keyboardManager.bind('ctrl+i', function(e) {
		$scope.toogleTheme();
	});
});