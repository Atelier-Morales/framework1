"use strict";

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt');
var SALT = 10;

var db_url = 'mongodb://localhost/fuckingshit';

mongoose.connect(db_url, function(err, res) {
    if (err) {
        console.log("connection refused to "+db_url);
        console.log(err);
    }
    else
        console.log("connection successful to "+db_url);
});

var Schema = mongoose.Schema;

// User schema
var User = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email:    { type: String, required: true },
    is_admin: { type: Boolean, default: false },
    created: { type: Date, default: Date.now }
});

// Bcrypt middleware on UserSchema
User.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) 
      return next();

  bcrypt.genSalt(SALT, function(err, salt) {
    if (err) 
        return next(err);

    bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) 
            return next(err);
        user.password = hash;
        next();
    });
  });
});

//Password verification
User.methods.comparePassword = function(password, cb) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) 
            return cb(err);
        cb(isMatch);
    });
};


//Define Models
var userModel = mongoose.model('User', User);

// Export Models
exports.userModel = userModel;