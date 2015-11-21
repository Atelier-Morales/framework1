/*
 *  OAuth wrapper for 42 API
 *  by Fernan Morales : fmorales@student.42.fr
 *
 */

"use strict";

var db = require('./db');
var OAuth = require('oauth');
var request = require('request');
var qs = require('querystring');
var UID = "70f4723a3e4a8d6a9c57a9ef01c30aa57dcc09237711e6f08edb97320709d55c";
var SECRET = "09c55b37aa09ffbc15b651b7f193c16438ebb9e0f7a9d42170a8a8ebbb421148";
var oauth = { 
    client_id: UID, 
    client_secret: SECRET
};

var URL = "https://api.intra.42.fr/oauth/token";

// OAuth1.0 - simple server side flow (for 42 API)

request.post({
  url:     URL,
  body:    "grant_type=client_credentials&client_id="+UID+"&client_secret="+SECRET
}, function(e, response, body){
    if (e) {
        console.log(e);
        process.exit();
    }
    
    console.log(body);
    var auth_data = qs.parse(body);
    console.log(auth_data);
    var token = auth_data.access_token;
    console.log("token = "+token);
    process.exit();
});