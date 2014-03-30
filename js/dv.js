/**
 * Created by Sean on 3/29/2014.
 */

angular.module('dataviz', ['fitbitService', 'ngRoute'])
	.config(['$routeProvider',
		function($routeProvider) {
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
	.controller('dvController', function dvController($scope) {
	});
