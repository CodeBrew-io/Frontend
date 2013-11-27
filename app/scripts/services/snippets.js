app.factory('snippets', function($q, $resource, $timeout /* location, localStorage */) {
	var rest = $resource('/snippets/',{},{
		"queryUser": { method: 'GET', url: '/snippets/queryUser', isArray: true },
		"find": { method: 'GET', url: '/snippets/u/:username/:id' },
		"query": { method: 'GET', isArray: true },
		"save": { method: 'POST' },
		"delete" : { method : 'DELETE' }
	});

	return {
		"saveLocal": function(code){
			window.localStorage["code"] = code;
		},
		"current": function(){
			if("/" !== window.location.pathname) {
				// url is /:username/:snippetId
				var info = window.location.pathname.split("/").slice(1,3);
				return rest.find({ username: info[0], id: info[1] }).$promise;
			} else {
				// also async
				var defer = $q.defer();
				$timeout(function(){
					defer.resolve({
						code: window.localStorage["code"]
					});
				});
				return defer.promise;
			}
		},
		"queryUser": rest.queryUser,
		"find": rest.find,
		"query": rest.query,
		"save": rest.save,
		"delete": rest.delete
	}
});