app.config(function($routeProvider, $locationProvider){
	$routeProvider.when('/Search', {
		templateUrl: '/views/search.html',
		controller: 'search'
	})

	$locationProvider.html5Mode(false);
    $locationProvider.hashPrefix("");
});

// apply route on initialisation
app.run(function($route){
	$route.reload();
});


// app.run(function($route, $scope, user){
// 	user.watch(function(u){
// 		if(user.loggedIn()){
// 			this.previousUser = u.codeBrewUser.username;
// 			$route.routes["/" + this.previousUser] = {

// 			};
// 		} else if(angular.isDefined(this.previousUser)) {
// 			delete $route.routes["/" + this.previousUser];
// 		}
// 	});
// });