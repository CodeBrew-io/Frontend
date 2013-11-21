app.factory('user', function($resource) {
	var rest = $resource('/user',{},{
		"exists": { method: 'GET', url: '/user/exists/:user', isArray: false },
		"logout": { method: 'GET', url: '/logout'}
	})
	var user = rest.get();

	return {
		get: function(){ 
			return user;
		},
		loggedIn: function(){
			return angular.isDefined(user.codeBrewUser);
		},
		logout: function(){
			rest.logout();
			user = {};
		},
		exists: function(userName){
			return rest.exists({user: userName});
		},
		save: function(u){
			var p = rest.save(u);
			user = p;
			return p;
		}
	};
});