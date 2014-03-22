app.factory('user', function($resource, $rootScope, $window, $q) {
	var rest = $resource('/user',{}, {
		"logout": { method: 'GET', url: '/logout'}
	});
	var user = rest.get();
	var afterLogin = null;

	function popup(url, title, w, h) {
		w = w | 620;
		h = h | 680;
		var left = (screen.width/2)-(w/2);
		var top = (screen.height/2)-(h/2);
		return window.open(url, title, 'toolbar=0, location=0, titlebar=0, directories=0, status=0, menubar=0, scrollbars=1, resizable=1, width='+w+', height='+h+', top='+top+', left='+left);
	}

	function login(){
		if(!angular.isDefined(user.codeBrewUser)) { 
			popup('/login', 'login');
		}
	}

	return {
		doAfterLogin: function(f){
			user.$promise.then(function(){
				if(angular.isDefined(user.codeBrewUser)) {
					return f(user);
				}

				if(angular.isDefined(user.secureSocialUser)) {
					popup('/user/signIn', 'signIn');
				} else {
					login();
				}
				afterLogin = f;
			})
		},
		get: function(){ 
			return user;
		},
		login: login,
		loggedIn: function(){
			return angular.isDefined(user.codeBrewUser);
		},
		logout: function(){
			rest.logout();
			user = {};
		},
		reset: function(){
			rest.get().$promise.then(function(u){
				user = u;
				if(afterLogin) {
					afterLogin(u);
					afterLogin = null;
				}
			});
		},
		saved: function(u){
			user = u;
			if(afterLogin) {
				afterLogin(u);
				afterLogin = null;
			}
		},
		watch: function(f){
			$rootScope.$watch('user', f);
		}
	};
});