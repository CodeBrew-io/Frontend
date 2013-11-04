app.factory('user', function($http, $resource, $location) {
	return $resource('/user',{},{
		"info": { method: 'GET', url: '/user' }
	})
});