app.filter('snippetCode',function(){
	return function(inputs){
		var filtered = [];
    	angular.forEach(inputs, function(input) {
    		filtered.push(input.snippet["code.origin"]);
    	});
		return filtered;
	}
});