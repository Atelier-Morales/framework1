"use strict";

var nodemailer = require('nodemailer');

exports.sendEmail = function(req, res) {
    var sender = req.body.sender    || '';
    var subject = req.body.subject  || '';
    var text = req.body.text        || '';
    
    if (text == '' || sender == '' || subject == '')
        return res.send(401);
    
    var transporter = nodemailer.createTransport();
    transporter.sendMail({
        from: sender,
        to: 'fernan@keymetrics.io',
        subject: subject,
        text: text
    }, function (err, info) {
        if (err) {
            console.log(err);
            return res.sendStatus(401);
        }
        console.log(info+" email sent");
        return res.sendStatus(200);
    });
}