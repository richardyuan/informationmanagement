app.config(function($routeProvider) {
    $routeProvider
        .when("/timeline/", {
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
    $scope.months = ["Januari","Februari","Maart","April","Mei","Juni","Juli","Augustus","September","Oktober","November","December"];

    $scope.options = {
        elements: {
            line: {
                fill: false
            }
        }
    }
    $scope.colors = [{
            pointBackgroundColor: 'rgba(0, 0, 0, 1)'
        }]
    

    $scope.getMonth = function(month){
        switch (month) {
            case "Januari":
                $scope.monthNumber = 01;
                break;
            case "Februari":
                $scope.monthNumber = 02;
                break;
            case "Maart":
                $scope.monthNumber = 03;
                break;
            case "April":
                $scope.monthNumber = 04;
                break;
            case "Mei":
                $scope.monthNumber = 05;
                break;
            case "Juni":
                $scope.monthNumber = 06;
                break;
            case "Juli":
                $scope.monthNumber = 07;
                break;
            case "Augustus":
                $scope.monthNumber = 08;
                break;
            case "September":
                $scope.monthNumber = 09;
                break;
            case "Oktober":
                $scope.monthNumber = 10;
                break;
            case "November":
                $scope.monthNumber = 11;
                break;
            case "December":
                $scope.monthNumber = 12;
                break;
        }
    }

    $scope.updatedMonth = function () {
        $scope.getMonth($scope.selectedMonth);
 
        var params = {
            "month": $scope.monthNumber
        }
        $http({ method: 'GET', url: "http://localhost:8080/timeline", params: params })
            .then(function (response) {
                var twitterCommentArray = response.data.twitterComments;

                $scope.twitterCommentData = [];
                $scope.twitterCommentLabels = [];
                for (var i = 0; i < twitterCommentArray.length; i++) {
                    $scope.twitterCommentLabels.push(Object.keys(twitterCommentArray[i])[0]);
                    $scope.twitterCommentData.push(Object.values(twitterCommentArray[i])[0]);
                }

                var twitterLikesArray = response.data.twitterLikes;

                $scope.twitterLikesData = [];
                $scope.twitterLikesLabels = [];
                for (var i = 0; i < twitterLikesArray.length; i++) {
                    $scope.twitterLikesLabels.push(Object.keys(twitterLikesArray[i])[0]);
                    $scope.twitterLikesData.push(Object.values(twitterLikesArray[i])[0]);
                }

                var instagramCommentArray = response.data.instagramComments;

                $scope.instagramCommentData = [];
                $scope.instagramCommentLabels = [];
                for (var i = 0; i < instagramCommentArray.length; i++) {
                    $scope.instagramCommentLabels.push(Object.keys(instagramCommentArray[i])[0]);
                    $scope.instagramCommentData.push(Object.values(instagramCommentArray[i])[0]);
                }

                var instagramLikesArray = response.data.instagramLikes;

                $scope.instagramLikesData = [];
                $scope.instagramLikesLabels = [];
                for (var i = 0; i < instagramLikesArray.length; i++) {
                    $scope.instagramLikesLabels.push(Object.keys(instagramLikesArray[i])[0]);
                    $scope.instagramLikesData.push(Object.values(instagramLikesArray[i])[0]);
                }
            });
    }
});
