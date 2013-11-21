app.factory('user', function($resource) {
	var rest = $resource('/user',{},{
		"exists": { method: 'GET', url: '/user/exists/:user', isArray: false }
	})
	var user = rest.get();

	return {
		get: user,
		exists: function(userName){
			return rest.exists({user: userName});
		},
		save: rest.save
	};
});