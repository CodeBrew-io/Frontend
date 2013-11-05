// based on http://clintberry.com/2013/angular-js-websocket-service/

function identity(a){ return a; }

app.factory('scaladoc', ['$q', '$rootScope', function($q, $rootScope) {
 
    return {
        query: function(term){
            var defer = $q.defer();
 
            $.ajax({
                url: "http://api.scalex.org/",
                data: {
                    q: term,
                    callback: "identity",
                    page: 1,
                    per_page: 4
                },
                dataType: "jsonp",
                jsonp: false,
                jsonpCallback: "identity",
                cache: true,
                success: function (data) {
                    if (data.error) console.log(data.error)
                    else {
                        $rootScope.$apply(defer.resolve(data.results));
                    }
                }
            });
 
            return defer.promise;
        }
    }
}]);