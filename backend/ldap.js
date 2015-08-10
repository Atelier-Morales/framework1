"use strict";

var ldap = require('ldapjs-hotfix');
var client = ldap.createClient({
    url: 'ldaps://ldap.42.fr'
});

var months = ['july', 'august', 'september'];
var years  = [2013, 2014, 2015];

function testldap(req, res) {
    for (var i = 0; i < years.length; ++i) {
        for (var j = 0; j < months.length; ++j) {
            client.bind('cn=Fernan MORALES', secret, function(err) {
                if (!err) {
                    console.log('SUCCESS : fmorales ');
                }
                else
                    console.log(err);
            });
        }
    }
}

testldap('fmorales');
 