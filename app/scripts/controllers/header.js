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
});	