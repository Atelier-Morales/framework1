"use strict";

var ldap = require('ldapjs-hotfix');

exports.fetchUsersLdap = function (req, res) {
    var dn = 'uid=fmorales,ou=july,ou=2013,ou=paris,ou=people,dc=42,dc=fr';

    var client = ldap.createClient({
        url: 'ldaps://ldap.42.fr:636'
    });

    client.bind(dn, 'INSERTPASSHERE', function (err) {
        if (err) {
            console.log("failed connection to LDAP");
            return res.send(401);
        } else {
            client.search('ou=paris,ou=people,dc=42,dc=fr', {
                scope: 'sub',
                attributes: ['uidNumber', 'uid', 'givenName', 'sn', 'mobile', 'alias'],
                timeLimit: 600
            }, function (err, data) {
                var students = [];
                var entries = {};

                data.on('searchEntry', function (entry) {
                    var match = entry.object.dn.match('uid');
                    if (match) {
                        students.push(entry.object);
                    }

                });
                data.on('end', function (result) {
                    console.log('status: ' + result.status);
                    return res.send(students);
                });
            });
        }
    });
}
