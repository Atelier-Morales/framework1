"use strict";
/*
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

uid=fgundlac,ou=july,ou=2013,ou=paris,ou=people,dc=42,dc=fr*/

var passport     = require('passport');
var LdapStrategy = require('passport-ldapauth');

var getLDAPConfiguration = function(req, callback) {
  // Fetching things from database or whatever
    console.log(req);
  process.nextTick(function() {
    var opts = {
      server: {
        url: 'ldaps://ldap.42.fr',
        bindDn: 'uid=fmorales,dc=42,dc=fr',
        searchFilter: '(uid=fmorales)'
      }
    };
 
    callback(null, opts);
  });
};
 
passport.use(new LdapStrategy(getLDAPConfiguration, function(user, done) {
    console.log(user);
    console.log("fuck");
    return done(null, user);
  }
));

passport.authenticate('ldapauth', {session: false}), function(req, res) {
    console.log(res);
  res.send({status: 'ok'});
};