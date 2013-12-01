app.factory('user', function($resource, $window) {
	var rest = $resource('/user',{},{
		"exists": { method: 'GET', url: '/user/exists/:user', isArray: false },
		"logout": { method: 'GET', url: '/logout'}
	})
	var user = rest.get();
	var popup = null;

	function login(){
		if(!angular.isDefined(user.codeBrewUser)) {
			function popupwindow(url, title, w, h) {
			  var left = (screen.width/2)-(w/2);
			  var top = (screen.height/2)-(h/2);
			  return window.open(url, title, 'toolbar=0, location=0, titlebar=0, directories=0, status=0, menubar=0, scrollbars=1, resizable=1, width='+w+', height='+h+', top='+top+', left='+left);
			} 
			popupwindow('/login', 'oauth', 1024, $window.innerHeight);
		}
	}

	return {
		afterSignIn: function(f){
			
		},
		get: function(){ 
			return user;
		},
		reset: function(u){
			popup.close();
			user = rest.get();
		},
		login: login,
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