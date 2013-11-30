app.controller('signIn', function code($scope, $timeout, user){
	$scope.showSignIn = false;
	$scope.takedUsername = false;

	function present(field){
		return angular.isDefined(field) && field.length > 0
	}

	function defined(field){
		return angular.isDefined(field) && field !== null;
	}

	$scope.cancel = function(){
		$scope.showSignIn = false;
		user.logout();
	}

	$scope.save = function(){
		var u = {};
		if($scope.signIn.$valid){
			u.userName = $scope.userName;
			if(present($scope.email)) {
				u.email = $scope.email;
			}
			user.save(u).$promise.then(function(){
				$scope.showSignIn = false;
			});
		}
	}

	$scope.$watch('user.get()',function(){
		var u = user.get();
		if(angular.isDefined(u.secureSocialUser)){		
			// use email as starting username
			if(defined(u.secureSocialUser.email)){
				$scope.userName = u.secureSocialUser.email.split("@")[0];
				$scope.email = u.secureSocialUser.email;
			}

			// validate if username exists
			$scope.$watch('userName', function(){
				if(present($scope.userName)){
					user.exists($scope.userName).$promise.then(function(d){
						var exists = d.result;
						if(exists) {
							$scope.signIn.userName.$valid = false;
							$scope.signIn.userName.$error.taken = true;
						} else {
							$scope.signIn.userName.$error.taken = false;
						}
					});
				} else {
					$scope.signIn.userName.$error.taken = false;
				}
			});
		} else {
			$scope.showSignIn = false;
		}
	});
});