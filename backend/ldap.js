"use strict";

var ldap = require('ldapjs-hotfix');


var month = ['july', 'august', 'september'];

var year = ['2013', '2014'];



function testldap(req, res) {
    var client = ldap.createClient({
        url: 'ldaps://ldap.42.fr:636'
    });
    
    client.bind(req,, function(err) {
        if (err) {
            console.log(req);
            console.log(err);
            client.unbind();
            return (0);
        }
        else {
            client.search('uid=fmorales,ou=paris,ou=people,dc=42,dc=fr', {
				scope: 'sub',
				attributes: ['uidNumber', 'uid', 'givenName', 'sn', 'mobile', 'alias'],
				timeLimit: 600
			}, function (err, data) {
				var entries = {};
                console.log('SUCCESS : fmorales');
				data.on('searchEntry', function (entry) {
					var match = entry.object.dn.match(/uid=[a-z\-]{3,8},ou=(july|august|september),ou=([0-9]{4})/);
					if (match) {
						console.log('entry: ' + JSON.stringify(entry.object));
						var month = match[1];
						var year = match[2];
						if (!entries[year])
							entries[year] = {};
						if (!entries[year][month])
							entries[year][month] = [];
						entries[year][month].push(entry.object);
					}
				});
				data.on('searchReference', function (referral) {
					console.log('referral: ' + referral.uris.join());
				});
				data.on('error', function (err) {
					console.error('error: ' + err.message);
					client.unbind();
					res.status(400).send({error: err.message});
				});
				data.on('end', function (result) {
					console.log('status: ' + result.status);
					client.unbind();
                    return (1);
				});
			});
        }
    });
}
//var dn = 'uid=fmorales,ou=july,ou=2013,ou=paris,ou=people,dc=42,dc=fr';
var result = {};
result.i = 0;
result.j;

while (resulti < year.length) {
    j = 0;
    while (j < month.length) {
        setTimeout(testldap(i, j), 0);
        j++;
    }
    ++i;
}

//for (var i = 0; i < year.length; i++) {
//    for (var j = 0; j < month.length; j++) {
//        var dn = 'uid=fmorales,ou='+month[j]+',ou='+year[i]+',ou=paris,ou=people,dc=42,dc=fr';
//        setTimeout(testldap(dn), 0);
//    }
//}

/*
exports.list = function (req, res) {

	// do not initialize this var in global scope or it won't work anymore
	var client = ldap.createClient({
		url: 'ldaps://ldap.42.fr:636'
	});

	var dn = 'uid=' + config.ldap.login + ',ou=' + config.ldap.month + ',ou=' + config.ldap.year + ',ou=paris,ou=people,dc=42,dc=fr';

	// Bind LDAP
	client.bind(dn, config.ldap.password, function (err) {
		if (err)
			return res.send({error: err.message});
		else {
			client.search('ou=paris,ou=people,dc=42,dc=fr', {
				scope: 'sub',
				attributes: ['uidNumber', 'uid', 'givenName', 'sn', 'mobile', 'alias'],
				timeLimit: 600
			}, function (err, data) {
				var entries = {};

				data.on('searchEntry', function (entry) {
					var match = entry.object.dn.match(/uid=[a-z\-]{3,8},ou=(july|august|september),ou=([0-9]{4})/);
					if (match) {
						console.log('entry: ' + JSON.stringify(entry.object));
						var month = match[1];
						var year = match[2];
						if (!entries[year])
							entries[year] = {};
						if (!entries[year][month])
							entries[year][month] = [];
						entries[year][month].push(entry.object);
					}
				});
				data.on('searchReference', function (referral) {
					console.log('referral: ' + referral.uris.join());
				});
				data.on('error', function (err) {
					console.error('error: ' + err.message);
					client.unbind();
					res.status(400).send({error: err.message});
				});
				data.on('end', function (result) {
					console.log('status: ' + result.status);
					client.unbind();
					res.send(entries);
				});
			});
		}
	});

};*/