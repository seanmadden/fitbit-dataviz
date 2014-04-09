/**
 * Created by Sean on 3/28/2014.
 */

angular.module("fitbitService", ['ngResource'])
	.factory('fitbitUsers', function($resource) {
		var fitbitUsers = $resource("/api/internal/users");

		fitbitUsers.prototype.getResource = function() {
			return fitbitUsers;
		};

		return new fitbitUsers;
	})
	.factory('fitbitUserInfo', function($resource) {
		var fitbitUserInfo = $resource("/api/fitbit/user/:userid");

		fitbitUserInfo.prototype.getResource = function() {
			return fitbitUserInfo;
		};

		return new fitbitUserInfo;
	}
);
