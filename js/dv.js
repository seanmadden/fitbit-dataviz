/**
 * Created by Sean on 3/29/2014.
 */

angular.module('dataviz', ['fitbitService', 'ngRoute'])
    .config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider
                .when('/',
                {
                    templateUrl: 'default.html'
                }
            )
                .when('/dataviz',
                {
                    controller: 'dvController',
                    templateUrl: 'dataviz.html'
                }
            )
        }
    ])
    .controller('dvController', function dvController($scope, fitbitUsers, fitbitUserInfo) {
        var users = fitbitUsers.getResource().query();
        $scope.userList = [];

        $scope.getUserInfo = function (userID) {
            var userInfo = fitbitUserInfo.getResource().get({userid: userID});
            userInfo.$promise.then(function (data) {
                $scope.userInfo = data;
            });
        };

        users.$promise.then(function (data) {
            $scope.userList = data;
        });
    });