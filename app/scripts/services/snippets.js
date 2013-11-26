app.factory('snippets', function($resource) {
	var rest = $resource('/snippets/',{},{
		"queryUser": { method: 'GET', url: '/snippets/queryUser', isArray: true },
		"find": { method: 'GET', url: '/snippets/u/:username/:id', isArray: true },
		"query": { method: 'GET', isArray: true },
		"save": { method: 'POST' },
		"delete" : { method : 'DELETE' }
	});

	return {
		current: function(){

		},
		"queryUser": rest.queryUser,
		"find": rest.find,
		"query": rest.query,
		"save": rest.save,
		"delete": rest.delete
	}
});