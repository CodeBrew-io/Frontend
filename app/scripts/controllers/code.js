app.controller('code', function code(
	$scope, $rootScope, $timeout, $location,
	scalaEval, insightRenderer, errorsRenderer,
	snippets, user, throttle, keyboardManager, LANGUAGE) {

	'use strict';

	var cm = null,
		code,
		configEditing = false;;

	$scope.code = "";
	$scope.loggedIn = user.loggedIn;
	$scope.user = user.get;
	$scope.fetching = scalaEval.fetching;
	$scope.loggedIn = user.loggedIn;
	$scope.login = user.login;
	$scope.getThemeShort = snippets.getThemeShort;
	$scope.isLigth = snippets.isLigth;

	$scope.teammates = [
		{name: 'Jean-Remi Desjardins', linkedin: 'http://ca.linkedin.com/in/jedesah', github: 'https://github.com/jedesah', twitter: 'https://twitter.com/jrdesjardins'},
		{name: 'Eric Comte Marois', linkedin: 'http://ca.linkedin.com/pub/éric-comte-marois/59/799/444', github: 'https://github.com/manbear', twitter: ''},
		{name: 'Guillaume Masse', linkedin: 'http://ca.linkedin.com/in/masseguillaume', github: 'https://github.com/MasseGuillaume', twitter: 'https://twitter.com/MasseGuillaume'},
		{name: 'Raouf Merouche', linkedin: 'http://ca.linkedin.com/in/merouche/', github: 'https://github.com/shmed', twitter: 'https://twitter.com/elshmed'},		
		{name: 'Patrick Losier', linkedin: 'http://ca.linkedin.com/in/patricklosier', github: 'https://github.com/patlos', twitter: ''}
	];

	if(angular.isDefined(window.localStorage['codemirror'])) {
		$scope.cmOptions = JSON.parse(window.localStorage['codemirror']);
		console.log($scope.cmOptions);
	} else {
		$scope.cmOptions = {
			"to config codemirror see": "http://codemirror.net/doc/manual.html#config",
			extraKeys: {"Ctrl-Space": "autocomplete"},
			fixedGutter: true,
			coverGutterNextToScrollbar: true,
			lineNumbers: true,
			theme: 'solarized dark',
			themes: ["solarized dark", "solarized light", "monokai", "ambiance", "eclipse", "mdn-like"],
			smartIndent: false,
			autoCloseBrackets: true,
			styleActiveLine: true,
			keyMap: "sublime",
			highlightSelectionMatches: { showToken: false }
		};
	}

	$scope.showAbout = false;
	$scope.toogleAbout = function(){
		$scope.showAbout = !$scope.showAbout;
	};

	function setMode(edit){
		if(edit) {
			code = $scope.code;
			insightRenderer.clear();
			errorsRenderer.clear();
			$timeout(function(){
				$scope.cmOptions.mode = 'application/json';
				$scope.code = JSON.stringify($scope.cmOptions, null, '\t');
			});
		} else {
			$scope.cmOptions.onLoad = function(cm_) { 
				cm = cm_;
				cm.focus();
			}
			$timeout(function(){
				$scope.code = code;
				$scope.cmOptions.mode = 'text/x-' + LANGUAGE;
				window.localStorage['codemirror'] = JSON.stringify($scope.cmOptions);
			});
		}
	}
	setMode(false);

	$scope.toogleEdit = function(){
		configEditing = !configEditing;
		setMode(configEditing);
	};

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

	$scope.$watch('code', function(){
		if(configEditing) {
			$scope.cmOptions = JSON.parse($scope.code);	
		} else {
			snippets.saveLocal($scope.code);
			insightRenderer.clear();
			errorsRenderer.clear();
			
			throttle.event(function() {
				if(!configEditing) {
					scalaEval.insight($scope.code).then(function(data){
						var code = $scope.code.split("\n");
						insightRenderer.render(cm, $scope.cmOptions.mode, code, data.insight);
						errorsRenderer.render(cm, data, code);
					});
				}
			});
		}
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