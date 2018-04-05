app.config(function($routeProvider) {
    $routeProvider
        .when("/secondpage/", {
            templateUrl : "tpl/secondPage.html",
            controller : "SecondPageController",
            resolve: {
                data: function ($q, $http, $route) {
                    return;
                }
            }
        })
});

app.controller('SecondPageController', function($scope, $http, $route, $routeParams, $location, $filter, $timeout, data) {

    //Add your controller code here.

});
