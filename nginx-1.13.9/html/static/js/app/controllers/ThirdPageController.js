app.config(function($routeProvider) {
    $routeProvider
        .when("/boxplots/", {
            templateUrl : "tpl/thirdPage.html",
            controller : "ThirdPageController",
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

app.controller('ThirdPageController', function($scope, $http, $route, $routeParams, $location, $filter, $timeout, data) {
    $('#loadNotification').hide();
    $scope.organizations = data.organizations;
    $scope.updatedOrganization = function () {
        $('#loadNotification').show();
        var params = {
            "organization": $scope.selectedOrganization
        }
        $http({ method: 'GET', url: "http://localhost:8080/boxplotlikes", params: params })
            .then(function (response) {

                var imageInstagramComments = (response.data.ImageCommentsListInstagram == null) ? 0 : response.data.ImageCommentsListInstagram;
                var carouselInstagramComments = (response.data.CarouselCommentsListInstagram == null) ? 0 : response.data.CarouselCommentsListInstagram;
                var videoInstagramComments = (response.data.VideoCommentsListInstagram == null) ? 0 : response.data.VideoCommentsListInstagram;
                var imageInstagramLikes = (response.data.ImageLikesListInstagram == null) ? 0 : response.data.ImageLikesListInstagram;
                var carouselInstagram = (response.data.CarouselLikesListInstagram == null) ? 0 : response.data.CarouselLikesListInstagram;
                var videoInstagram = (response.data.VideoLikesListInstagram == null) ? 0 : response.data.VideoLikesListInstagram;

                var imageInstaLikes = {
                    x : imageInstagramLikes,
                    type : 'box',
                    name : 'Image'
                };

                var carouselInstaLikes = {
                    x : carouselInstagram,
                    type : 'box',
                    name : 'Carousel'
                }

                var videoInstaLikes = {
                    x : videoInstagram,
                    type: 'box',
                    name: 'Video'
                }

                var imageInstaComments = {
                    x : imageInstagramComments,
                    type : 'box',
                    name : 'Image'
                };

                var carouselInstaComments = {
                    x : carouselInstagramComments,
                    type : 'box',
                    name : 'Carousel'
                }

                var videoInstaComments = {
                    x : videoInstagramComments,
                    type: 'box',
                    name: 'Video'
                }

                var layout = {
                    title: 'Horizontal Box Plot'
                };

                var instaDataLikes = [imageInstaLikes, videoInstaLikes, carouselInstaLikes]
                console.log(instaDataLikes)
                var instaDataComments = [imageInstaComments, videoInstaComments, carouselInstaComments]
                console.log(instaDataComments)
                Plotly.newPlot('BoxplotInstaLikes', instaDataLikes, layout)
                Plotly.newPlot('BoxplotInstaComments', instaDataComments, layout)
            });
    }
});
