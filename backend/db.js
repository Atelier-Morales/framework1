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
    created: { type: Date, default: Date.now },
    projects: [
        {
            name: { type: String, required: true },
            status: { type: String, default: "ongoing" },
            grade: { type: Number, default: 0},
            deadline: { type: Date, required: true }
        }
    ]
});

// Project schema
var Projects = new Schema({
    name: { type: String, required: true, unique: true },
    deadline: { type: Date, required: true },
    description: { type: String, required: true, unique: true }
});

//Forum schema
/*

localhost/forum/:id/threads
>> list all threads from category id

localhost/forum/thread/:id/messages
>> list all messages from thread id

localhost/forum/:id/:id/threads
>> list all threads from subcategory id 

*/

var Forum = new Schema({
    categories: [
        {
            name: { type: String, required: true, unique: true },
            id: { type: Number, required: true, unique: true },
            subCategories: [
                {
                    name : { type: String, required: true, unique: true },
                    id: { type: Number, required: true, unique: true }
                }
            ]
        }
    ],
    threads: [
        {
            title: { type: String, required: true, unique: true },
            id: { type: Number,  required: true, unique: true },
            created: { type: Date, default: Date.now },
            creator: { type: String, required: true},
            creatorId: { type: String, required: true },
            category: [
                { 
                    name: { type: String, required: true, unique: true }
                }
            ],
            tag: [
                { name: { type: String, unique: true } }
            ],
            body: { type: String, required: true },
            comments: [
                {
                    author: { type: String, required: true },
                    authorId: { type: String, required: true},
                    created: { type: Date, default: Date.now },
                    commentBody: { type: String, required: true },
                    replies: [
                        {
                            author : { type: String, required: true },
                            authorId: { type: String, required: true },
                            created: { type: Date, default: Date.now },
                            replyBody: { type: String, required: true },
                        }
                    ]
                }
            ]
        }
    ]
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
var projectModel = mongoose.model('Projects', Projects);
var forumModel = mongoose.model('Forum', Forum);

// Export Models
exports.userModel = userModel;
exports.projectModel = projectModel;
exports.forumModel = forumModel;