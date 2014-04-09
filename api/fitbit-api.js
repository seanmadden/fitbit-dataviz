/**
 * Created by Sean on 4/1/2014.
 */

var OAuth = require('oauth');
var passport = require('passport');
var env = require('../env.json');
var mongoose = require("mongoose");
var User = mongoose.model('User');

var consumerKey = env.dev.consumerKey,
    consumerSecret = env.dev.consumerSecret;

//set up oauth
var oauth = new OAuth.OAuth(
    'https://api.fitbit.com/oauth/request_token',
    'https://api.fitbit.com/oauth/access_token',
    consumerKey,
    consumerSecret,
    '1.0',
    null,
    'HMAC-SHA1'
);


function apiCall(api, userId, callback) {
    User.findOne({ 'encodedId': userId },
        function(err, user) {
            if (err) {
                console.error("error finding user", err)
                return;
            }

            oauth.get('https://api.fitbit.com/1/user/2D3YGV/activities/date/2014-01-01.json',
                user.accessToken,
                user.accessSecret,
                function(e, data, req) {
                    console.log(data);
                }
            );
        });

}