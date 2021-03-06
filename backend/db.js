"use strict";

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT = 10;

var db_url = 'mongodb://localhost/fuckingshit';

mongoose.connect(db_url, function (err, res) {
    if (err) {
        console.log("connection refused to " + db_url);
        console.log(err);
    } else
        console.log("connection successful to " + db_url);
});

var Schema = mongoose.Schema;

// User schema
var User = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    is_admin: {
        type: Boolean,
        default: false
    },
    created: {
        type: Date,
        default: Date.now
    },
    lang: {
        type: String,
        required: true,
        default: "en"
    },
    projects: [
        {
            name: {
                type: String,
                required: true
            },
            status: {
                type: String,
                default: "ongoing"
            },
            credits: {
                type: Number,
                default: 0
            },
            deadline: {
                type: Date,
                required: true
            }
        }
    ],
    activities: [
        {
            name: {
                type: String,
                required: true
            },
            parentModule: {
                type: String,
                required: true
            },
            status: {
                type: String,
                default: "ongoing"
            },
            grade: {
                type: Number,
                default: 0
            },
            deadline: {
                type: Date,
                required: true
            },
            peerCorrections: {
                type: Number
            },
            neededCorrections: {
                type: Number
            },
            groupSize: {
                type: Number,
                required: true,
                default: 1
            },
            submitted: {
                type: String
            },
            users: [
                {
                    name: {
                        type: String,
                         required: true
                    }
                }
            ],
            correctors: [
                {
                    name: {
                        type: String,
                        required: true
                    },
                    completed: {
                        type: Boolean,
                        default: false
                    },
                    grade: {
                        type: Number
                    },
                    date: {
                        type: Date
                    }
                }
            ]
        }
    ],
    corrections: [
        {
            project: {
                type: String,
                required: true
            },
            module: {
                type: String,
                required: true
            },
            user: {
                type: String,
                required: true
            },
            completed: {
                type: Boolean,
                default: false
            },
            grade: {
                type: Number,
                default: 0
            },
            feedback: {
                type: String
            }
        }
    ],
    ldap: {
        type: Boolean,
        default: false
    },
    logAs: {
        type: Boolean,
        default: false
    }
});

// Project schema
var Projects = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    start: {
        type: Date,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    registration_start: {
        type: Date,
        required: true
    },
    registration_end: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true,
        unique: true
    },
    credits: {
        type: Number,
        required: true,
        unique: true
    },
    max_size: {
        type: Number,
        required: true,
    },
    activities: [
        {
            name: {
                type: String,
                unique: true
            },
            start: {
                type: Date
            },
            deadline: {
                type: Date
            },
            registration_start: {
                type: Date
            },
            registration_end: {
                type: Date
            },
            description: {
                type: String,
                unique: true
            },
            subject: {
                type: String,
                unique: true
            },
            group_size: {
                type: Number
            },
            max_size: {
                type: Number
            },
            nb_peers: {
                type: Number
            },
            automatic_group: {
                type: Boolean,
                default: false
            },
            activity_type: {
                type: String,
            },
            bareme: {
                type: String,
                default: ""
            },
            eLearning: {
                type: String
            }
        }
    ]
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
            name: {
                type: String,
                required: true,
                unique: true
            },
            id: {
                type: Number,
                required: true,
                unique: true
            },
            subCategories: [
                {
                    name: {
                        type: String,
                        required: true,
                        unique: true
                    },
                    id: {
                        type: Number,
                        required: true,
                        unique: true
                    }
                }
            ]
        }
    ],
    threads: [
        {
            title: {
                type: String,
                required: true,
                unique: true
            },
            id: {
                type: Number,
                required: true,
                unique: true
            },
            created: {
                type: Date,
                default: Date.now
            },
            creator: {
                type: String,
                required: true
            },
            category: [
                {
                    name: {
                        type: String,
                        required: true,
                        unique: true
                    }
                }
            ],
            body: {
                type: String,
                required: true
            },
            bodyComments: [
                {
                    author: {
                        type: String,
                        required: true
                    },
                    created: {
                        type: Date,
                        default: Date.now
                    },
                    replyBody: {
                        type: String,
                        required: true
                    },
                }
            ],
            comments: [
                {
                    author: {
                        type: String,
                        required: true
                    },
                    id: {
                        type: Number,
                        required: true,
                        unique: true
                    },
                    created: {
                        type: Date,
                        default: Date.now
                    },
                    commentBody: {
                        type: String,
                        required: true
                    },
                    replies: [
                        {
                            author: {
                                type: String,
                                required: true
                            },
                            created: {
                                type: Date,
                                default: Date.now
                            },
                            replyBody: {
                                type: String,
                                required: true
                            },
                        }
                    ]
                }
            ]
        }
    ]
});

// Tickets Schema
var Tickets = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        unique: true
    },
    assignTo: {
        type: String,
        required: true,
        default: "unassigned"
    },
    category: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    body: {
        type: String,
        required: true
    },
    replies: [
        {
            author: {
                type: String,
                required: true
            },
            body: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    status: {
        type: String,
        default: "open"
    }
});

//Tickets categories
var ticketCategories = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    }
});

// Bcrypt middleware on UserSchema
User.pre('save', function (next) {
    var user = this;

    if (!user.isModified('password'))
        return next();

    bcrypt.genSalt(SALT, function (err, salt) {
        if (err)
            return next(err);

        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err)
                return next(err);
            user.password = hash;
            next();
        });
    });
});

//Password verification
User.methods.comparePassword = function (password, cb) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        if (err)
            return cb(err);
        cb(isMatch);
    });
};

//Define Models
var userModel = mongoose.model('User', User);
var projectModel = mongoose.model('Projects', Projects);
var forumModel = mongoose.model('Forum', Forum);
var ticketModel = mongoose.model('Tickets', Tickets);
var ticketCategoriesModel = mongoose.model('ticketCategories', ticketCategories);

// Export Models
exports.userModel = userModel;
exports.projectModel = projectModel;
exports.forumModel = forumModel;
exports.ticketModel = ticketModel;
exports.ticketCategoriesModel = ticketCategoriesModel;
