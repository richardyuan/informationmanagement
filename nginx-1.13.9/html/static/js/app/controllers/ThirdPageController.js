app.config(function($routeProvider) {
    $routeProvider
        .when("/thirdpage/", {
            templateUrl : "tpl/thirdPage.html",
            controller : "ThirdPageController",
            resolve: {
                data: function ($q, $http, $route) {
                    return;
                }
            }
        })
});

app.controller('ThirdPageController', function($scope, $http, $route, $routeParams, $location, $filter, $timeout, data) {

    //Add your controller code here.

});
