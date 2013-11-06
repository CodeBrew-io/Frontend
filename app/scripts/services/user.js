app.factory('user', function($http, $resource, $location) {
	var rest = $resource('/user',{},{
		"info": { method: 'GET', url: '/user' }
	})
	var user = rest.info();

	return {
		loggedIn: function(){
			return undefined !== user.name;
		},
		get: function(){
			return user;
		}
	}
});