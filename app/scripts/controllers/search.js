app.controller('search',function(user, $scope){
	// var viewingMySnippets = false;
	$scope.mySnippets = [];

	$scope.hasSnippets = function(){
		return $scope.mySnippets.length > 0;
	}

	$scope.viewingMySnippets = function(){
		return user.loggedIn() && viewingMySnippets;
	}
	$scope.toogleMySnippets = function(){
		// login if need be
		$scope.viewingOthersSnippets = false;
		user.doAfterLogin(function(user){
			$scope.mySnippets = snippets.queryUser();
			viewingMySnippets = !viewingMySnippets;
			$timeout(function(){ cm.refresh(); })
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

	// others snippets
	$scope.viewingOthersSnippets = false;
	$scope.toogleOthersSnippets = function(){
		$scope.viewingOthersSnippets = !$scope.viewingOthersSnippets;
		$scope.viewingMySnippets = false;
	}
	$scope.snippets = [];
	$scope.search = function(term){
		return [
			{user: "masgui", id: 123, code: "1+1"}
		]
	};
	$scope.select = function(code){
		$scope.code = code;
	}

	user.watch(function(u){
		if(user.loggedIn()){
			
		}
	});
});