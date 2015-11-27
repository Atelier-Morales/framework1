/*
 *  OAuth wrapper for 42 API
 *  by Fernan Morales : fmorales@student.42.fr
 *
 */

"use strict";

var db = require('./db');
var request = require('request');
var UID = "70f4723a3e4a8d6a9c57a9ef01c30aa57dcc09237711e6f08edb97320709d55c";
var SECRET = "09c55b37aa09ffbc15b651b7f193c16438ebb9e0f7a9d42170a8a8ebbb421148";

var URL = "https://api.intra.42.fr/oauth/token";

// OAuth1.0 - simple server-side flow (for 42 API)
exports.createAPIToken = function (next) {
    request.post({
        url: URL,
        body: "grant_type=client_credentials&client_id=" + UID + "&client_secret=" + SECRET
    }, function (e, response, body) {
        if (e)
            next(new Error("Cannot create token"));
        console.log(body);
        var token = body.substr(17, 64);
        console.log("API token = " + token);
        next(null, token);
    });
}

//
//var token = jwt.sign(
//                { id: user._id }, 
//                'shhhhh', 
//                { expiresInMinutes: TOKEN_EXPIRATION }
//            );
//            
//			return res.json({ 
//                token: token
//            });
//
//var expireToken = function(token) {
//	if (token != null) {
//		redisClient.set(token, { is_expired: true });
//    	redisClient.expire(token, 1);
//	}
//};