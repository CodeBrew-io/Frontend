app.factory('snippets', function($resource) {
	return $resource('/snippets/',{},{
		"queryUser": { method: 'GET', url: '/snippets/queryUser', isArray: true },
		"query": { method: 'GET', isArray: true },
		"save": { method: 'POST' },
		"delete" : {
			method : 'DELETE'
		}

	})
});