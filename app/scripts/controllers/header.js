app.controller('header', function header($scope, $rootScope, user, snippets, scaladoc, throttle) {
	'use strict';

	$scope.user = user.get;

	$scope.loggedIn = user.loggedIn;

	$scope.logOut = function(){
		user.logout();
	};

	$scope.profileOpen = false;
	$scope.closeProfile = function(){
		$scope.profileOpen = false;
	};
	$scope.toogleProfile = function(){
		$scope.profileOpen = !$scope.profileOpen;
	};

	$scope.codemirrorOptions = {
		mode: 'text/x-scala',
		theme: snippets.getTheme(),
		readOnly: 'true'
	};
	$scope.docs = [];
	$scope.snippets = [];
	$scope.all = [];

	$scope.getThemeShort = snippets.getThemeShort;

	$scope.search = function(term){
		if(term == '') {
			$scope.docs = [];
			$scope.snippets = [];
			$scope.all = [];
		} else {
			throttle.event(function(){
				snippets.query({terms: term}, function(data){
					$scope.snippets = data;
					scaladoc.query($scope.term).then(function(data){
						$scope.docs = data.results;
						$scope.all = $scope.snippets.concat($scope.docs);
					});
				});
			}, 150, 300);
		}
	};

	$scope.hasDocs = function(){
		return $scope.docs.length > 0;
	};

	$scope.hasSnippets = function(){
		return $scope.snippets.length > 0;
	};

	$scope.select = function(code){
		$scope.term = "";

		if(code && typeof code !== "object"){
			$rootScope.$emit('selectedCode', code);
		}
	};

	$scope.showingContentPage = false;
	$scope.toogleContentPage = function() {
		$scope.showingContentPage = !$scope.showingContentPage;
	}

	$scope.teammates = [
		{name: 'Jean-Remi Desjardins', linkedin: 'http://ca.linkedin.com/in/jedesah', github: 'https://github.com/jedesah', twitter: 'https://twitter.com/jrdesjardins'},
		{name: 'Eric Comte Marois', linkedin: 'http://ca.linkedin.com/pub/éric-comte-marois/59/799/444', github: 'https://github.com/manbear', twitter: ''},
		{name: 'Guillaume Masse', linkedin: 'http://ca.linkedin.com/in/masseguillaume', github: 'https://github.com/MasseGuillaume', twitter: 'https://twitter.com/MasseGuillaume'},
		{name: 'Raouf Merouche', linkedin: 'http://ca.linkedin.com/in/merouche/', github: 'https://github.com/shmed', twitter: 'https://twitter.com/elshmed'},		
		{name: 'Patrick Losier', linkedin: 'http://ca.linkedin.com/in/patricklosier', github: 'https://github.com/patlos', twitter: ''}
	];
});	