app.config(function($routeProvider) {
    $routeProvider
        .when("/data/", {
            templateUrl : "tpl/firstPage.html",
            controller : "FirstPageController",
            resolve: {
                data: function ($q, $http, $route) {
                    $('#loadNotification').show();
                    var deferred = $q.defer();
                    $http({ method: 'GET', url: "http://localhost:8080/organizations" })
                        .then(function (response) {
                            deferred.resolve(response.data);
                        });
                    return deferred.promise;
                }
            }
        })
});

app.controller('FirstPageController', function($scope, $http, $route, $routeParams, $location, $filter, $timeout, data) {
    $('#loadNotification').hide();
    $scope.organizations = data.organizations;
    $scope.updatedOrganization = function () {
       

        var params = {
            "organization": $scope.selectedOrganization
        }

        $http({ method: 'GET', url: "http://localhost:8080/barchart", params: params })
            .then(function (response) {

                var imageTwitter = (response.data.imageTwitter == null) ? 0 : response.data.imageTwitter;
                var carouselTwitter = (response.data.carouselTwitter == null) ? 0 : response.data.carouselTwitter;
                var videoTwitter = (response.data.videoTwitter == null) ? 0 : response.data.videoTwitter;
                var imageInstagram = (response.data.imageInstagram == null) ? 0 : response.data.imageInstagram;
                var carouselInstagram = (response.data.carouselInstagram == null) ? 0 : response.data.carouselInstagram;
                var videoInstagram = (response.data.videoInstagram == null) ? 0 : response.data.videoInstagram;

                $scope.barData = [[imageTwitter, carouselTwitter, videoTwitter],
                [imageInstagram, carouselInstagram, videoInstagram]];
                $scope.labels = ["image","carousel","video"];
                $scope.series = ["Twitter", "Instagram"];
                console.log($scope.selectedOrganization);
                console.log($scope.barData);
            });


    }
});
