// based on http://clintberry.com/2013/angular-js-websocket-service/

function identity(a){ return a; }

app.factory('scaladoc', ['$q', '$rootScope', '$location', function($q, $rootScope, $location) {
 
    return {
        query: function(term){
            var rurl, defer = $q.defer();

            if($location.host() === "codebrew.io") {
                rurl = "https://codebrew.io/scalex";
            } else {
                rurl = "http://api.scalex.org/";
            }
 
            $.ajax({
                url: rurl,
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