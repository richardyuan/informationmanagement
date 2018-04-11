app.config(function($routeProvider) {
    $routeProvider
        .when("/totalLikes/", {
            templateUrl : "tpl/bubblePage.html",
            controller : "BubblePageController",
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
app.controller('BubblePageController', function($q, $scope, $http, $route, $routeParams, $location, $filter, $timeout, data) {
    $scope.organizations = data.organizations;

    $scope.options = {
        legend: {display: true},
        tooltips: {enabled: false},
        hover: {mode: null},
        scales: {
            display: false,
            xAxes: [{
                scalabel: {
                    display: true
                }
            }],
            yAxes: [{
                scalabel: {
                    display: true
                }
            }]
        }
    };

    $scope.series = [];
    $scope.barDataTwitter = [];
    for (var i = 0; i < data.organizations.length; i++) {
        $scope.series.push(data.organizations[i]);
        $scope.barDataTwitter.push([{
            organization: data.organizations[i],
            x: randomScalingFactor(),
            y: randomScalingFactor(),
            r: randomRadius()
        }]);
    }

    function randomScalingFactor() {
        return (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * 100);
    }

    function randomRadius() {
        return Math.abs(randomScalingFactor()) / 4;
    }

    $('#loadNotification').hide();
});
