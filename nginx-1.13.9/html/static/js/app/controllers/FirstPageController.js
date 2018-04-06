app.config(function($routeProvider) {
    $routeProvider
        .when("/visualtype/", {
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
        $('#loadNotification').show();
        var params = {
            "organization": $scope.selectedOrganization
        }
        $http({ method: 'GET', url: "http://localhost:8080/likes", params: params })
            .then(function (response) {

                var imageTwitter = (response.data.imageTwitter == null) ? 0 : response.data.imageTwitter;
                var carouselTwitter = (response.data.carouselTwitter == null) ? 0 : response.data.carouselTwitter;
                var videoTwitter = (response.data.videoTwitter == null) ? 0 : response.data.videoTwitter;
                var imageInstagram = (response.data.imageInstagram == null) ? 0 : response.data.imageInstagram;
                var carouselInstagram = (response.data.carouselInstagram == null) ? 0 : response.data.carouselInstagram;
                var videoInstagram = (response.data.videoInstagram == null) ? 0 : response.data.videoInstagram;

                $scope.barDataInstagram = [imageInstagram, carouselInstagram, videoInstagram];
                $scope.barDataTwitter = [imageTwitter, carouselTwitter, videoTwitter];
                $scope.labels = ["image", "carousel", "video"];
                $http({ method: 'GET', url: "http://localhost:8080/comments", params: params })
                    .then(function (secondResponse) {

                        var imageTwitter = (secondResponse.data.imageTwitter == null) ? 0 : secondResponse.data.imageTwitter;
                        var carouselTwitter = (secondResponse.data.carouselTwitter == null) ? 0 : secondResponse.data.carouselTwitter;
                        var videoTwitter = (secondResponse.data.videoTwitter == null) ? 0 : secondResponse.data.videoTwitter;
                        var imageInstagram = (secondResponse.data.imageInstagram == null) ? 0 : secondResponse.data.imageInstagram;
                        var carouselInstagram = (secondResponse.data.carouselInstagram == null) ? 0 : secondResponse.data.carouselInstagram;
                        var videoInstagram = (secondResponse.data.videoInstagram == null) ? 0 : secondResponse.data.videoInstagram;

                        $scope.commentDataInstagram = [imageInstagram, carouselInstagram, videoInstagram];
                        $scope.commentDataTwitter = [imageTwitter, carouselTwitter, videoTwitter];
                        $scope.labels = ["image", "carousel", "video"];
                        $('#loadNotification').hide();
                    });
            });
    }
});
