app.factory('snippets', function($resource) {
	return $resource('/snippets',{},{
		"queryUser": { method: 'GET', url: '/queryUser' },
		"query": { method: 'GET', isArray: true },
		"": { method: 'POST' }
	})
});