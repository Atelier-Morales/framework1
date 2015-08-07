"use strict";

var ldap = require('ldapjs-hotfix');
var client = ldap.createClient({
    url: 'ldaps://ldap.42.fr'
});

client.bind('uid=fmorales,ou=july,ou=2013,ou=paris,ou=people,dc=42,dc=fr', function(err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log('success');
});
 