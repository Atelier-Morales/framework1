"use strict";

var db = require('./db');

exports.fetchCategories = function(req, res) {
    db.forumModel.find({}, function(err, categories) {
        if (err) {
			console.log(err);
			return res.send(401);
		}
        if (categories[0] == undefined)
            return res.sendStatus(401);
        return res.send(categories[0].categories);       
    });
}

exports.createCategory = function(req, res) {
	var name = req.body.name || '';

	if (name == '')
        return res.sendStatus(400);
    
    db.forumModel.find({}, function(err, category) {
        if (err) {
			console.log(err);
			return res.send(401);
		}
        if (category.length === 0) {
            console.log('creating forum');
            var forum = new db.forumModel();
	        forum.categories = [];
            forum.categories.push({name: name, id: 0, thread: []});
            forum.save(function(err) {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                }
                db.forumModel.find({}, function (err, forum) {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500);
                    }
                    console.log("forum created!");
                    return res.send(forum);
                });
            });
        }
        else {
            category[0].categories.push({name: name, id: category[0].categories.length, thread: []});
            category[0].save(function(err) {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                }
                db.forumModel.find({}, function (err, forum) {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500);
                    }
                    console.log(name+" created!");
                    return res.send(forum);
                });
            });
        }
    });
}

exports.createSubCategory = function(req, res) {
    var name = req.body.name || '';
    var categoria = req.body.category || '';
    
	if (name == '' || categoria == '')
        return res.sendStatus(400);
    db.forumModel.find({}, function(err, category) {
        if (err) {
			console.log(err);
			return res.send(401);
		}
        for (var i = 0; i < category[0].categories.length; ++i) {
            if (category[0].categories[i].name === categoria) {
                category[0].categories[i].subCategories.push({
                        name: name, 
                        id: category[0].categories[i].subCategories.length
                    }
                );
                category[0].save(function(err) {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500);
                    }
                    db.forumModel.find({}, function (err, forum) {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        }   
                        console.log(name+" created!");
                        return res.send(forum);
                    });
                });
            }
        }
    });
}

exports.modifySubcategory = function(req, res) {
    var categoria = req.body.category || '';
    var subcategoria = req.body.subcategory || '';
    var newValue = req.body.newName || '';
    
    if (categoria === '' || subcategoria === '' || newValue === '')
        return res.sendStatus(400);
    db.forumModel.find({}, function(err, category) {
        if (err) {
            console.log(err);
            return res.sendStatus(401);
        }
        for (var i = 0; i < category[0].categories.length; ++i) {
            if (category[0].categories[i].name === categoria) {
                var pos = i;
                break;
            }
        }
        for (var j = 0; j < category[0].categories[pos].subCategories.length; ++j) {
            if (category[0].categories[pos].subCategories[j].name === subcategoria) {
                var subPos = j;
                break;
            }
        }
        var oldValue = category[0].categories[pos].subCategories[subPos].name;
        category[0].categories[pos].subCategories[subPos].name = newValue;
        for (var k = 0; k < category[0].threads.length; ++k) {
            if (category[0].threads[k].category[1].name === subcategoria)
                category[0].threads[k].category[1].name = newValue;
        }
        category[0].save(function(err) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            db.forumModel.find({}, function (err, forum) {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                }
                console.log(categoria+" modified");
                return res.send(forum);
            });
        });
    });
}

exports.modifyCategory = function(req, res) {
    var categoria = req.body.category || '';
    var newValue = req.body.newName || '';
    
    if (categoria === '' || newValue === '')
        return res.sendStatus(400);
    
    db.forumModel.find({}, function(err, category) {
        if (err) {
            console.log(err);
            return res.sendStatus(401);
        }
        for (var i = 0; i < category[0].categories.length; ++i) {
            if (category[0].categories[i].name === categoria) {
                category[0].categories[i].name = newValue;
                break;
            }
        }
        for (var j = 0; j < category[0].threads.length; ++j) {
            if (category[0].threads[j].category[0].name === categoria)
                category[0].threads[j].category[0].name = newValue;
        }
        category[0].save(function(err) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
            }
            db.forumModel.find({}, function(err, forum) {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                }
                console.log(categoria+' modified');
                return res.send(forum);
            });
        });
    });
}

exports.removeCategory = function(req, res) {
    var categoria = req.body.category || '';
    
    if (categoria == '')
        return res.sendStatus(400);
    
    db.forumModel.find({}, function(err, category) {
        for (var i = 0; i < category[0].categories.length; ++i) {
            if (category[0].categories[i].name === categoria) {
                var index = i;
                if (index > 0) {
                    if (category[0].categories.length === 1)
                        category[0].categories.shift();
                    else
                        category[0].categories.splice(index, 1);
                    for (var k = 0; k < category[0].threads.length; ++k) {
                        if (category[0].threads[k].category[0].name === categoria) {
                            category[0].threads.splice(k, 1);
                            k = 0;
                            console.log('test');
                        }
                    }
                    category[0].save(function(err) {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        }
                        db.forumModel.find({}, function (err, forum) {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500);
                            }
                            console.log(categoria+" deleted");
                            return res.send(forum);
                        });
                    });
                }
            }
        }
    });
}

exports.removeSubCategory = function(req, res) {
    var categoria = req.body.category || '';
    var subcategoria = req.body.subcategory || '';
    
    if (categoria == '' || subcategoria == '')
        return res.sendStatus(400);
    
    db.forumModel.find({}, function(err, category) {
        for (var i = 0; i < category[0].categories.length; ++i) {
            if (category[0].categories[i].name === categoria) {
                var index = 0;
                var pos = i;
                for (var j = 0; j < category[0].categories[pos].subCategories.length; ++j) {
                    if (category[0].categories[pos].subCategories[j].name === subcategoria)
                        index = j;
                }
                if (index >= 0) {
                    if (category[0].categories[i].subCategories.length === 1) {
                        
                        category[0].categories[i].subCategories.shift();
                    }
                    else
                        category[0].categories[i].subCategories.splice(index, 1);
                    for (var k = 0; k < category[0].threads.length; ++k) {
                        if (category[0].threads[k].category[1].name === subcategoria) {
                            category[0].threads.splice(k, 1);
                        }
                    }
                    category[0].save(function(err) {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        }
                        db.forumModel.find({}, function (err, forum) {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500);
                            }
                            console.log(subcategoria+" deleted");
                            return res.send(forum);
                        });
                    });
                }
            }
        }
    });
}

exports.createThread = function(req, res) {
    var title = req.body.name || '';
    var body = req.body.body || '';
    var category = req.body.category || '';
    var subcategory = req.body.subcategory ||  '';
    var author = req.body.author || '';
    
    if (title === '' || body === '' || author === '')
        return res.sendStatus(400);
    
    db.forumModel.find({}, function(err, result) {
        if (err) {
			console.log(err);
			return res.send(401);
		}
        result[0].threads.push({
            title: title,
            id: result[0].threads.length,
            creator: author,
            category: [
                { name: category },
                { name: subcategory }],
            body: body,
            comments: []
        });
        result[0].save(function(err) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            db.forumModel.find({}, function (err, forum) {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                }
                console.log("Thread "+title+" created\n"+forum[0].threads);
                return res.send(forum[0].threads);
            });
        });
    });
}

exports.fetchThreads = function(req, res) {
    db.forumModel.find({}, function(err, categories) {
        if (err) {
			console.log(err);
			return res.send(401);
		}
        if (categories[0] == undefined)
            return res.sendStatus(401);
        return res.send(categories[0].threads);       
    });
}

exports.postCommentBody = function(req, res) {
    var author = req.body.author || '';
    var comment = req.body.comment || '';
    var id = req.body.id || '';
    
    if (author === '' || comment === '' || id === '') {
        console.log(err);
        return res.send(400);
    }
        
    db.forumModel.find({}, function(err, result) {
        if (err) {
			console.log(err);
			return res.send(401);
		}
        if (result[0] == undefined)
            return res.sendStatus(401);
        result[0].threads[id].bodyComments.push(
            {
                author : author,
                replyBody: comment
            }
        );
        result[0].save(function(err) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            db.forumModel.find({}, function (err, forum) {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                }
                console.log("Comment posted");
                console.log(result[0].threads[id]);
                return res.sendStatus(200);
            });
        });
    });
}

exports.postReply = function(req, res) {
    var author = req.body.author || '';
    var comment = req.body.comment || '';
    var id = req.body.id || '';
    
    if (author === '' || comment === '' || id === '') {
        console.log(err);
        return res.send(400);
    }
    
    db.forumModel.find({}, function(err, result) {
        if (err) {
			console.log(err);
			return res.send(401);
		}
        if (result[0] == undefined)
            return res.sendStatus(401);
        result[0].threads[id].comments.push(
            {
                author : author,
                commentBody: comment,
                id: result[0].threads[id].comments.length,
                replies: []
            }
        );
        result[0].save(function(err) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            db.forumModel.find({}, function (err, forum) {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                }
                console.log("Reply posted");
                console.log(result[0].threads[id].comments);
                return res.sendStatus(200);
            });
        });
    });
}

exports.postReplyComment = function(req, res) {
    var author = req.body.author || '';
    var comment = req.body.comment || '';
    var postId = req.body.postId || '';
    var id = req.body.id;
    
    console.log(author+' '+comment+' '+postId+' '+id);
    if (author === '' || comment === '' || postId === '' || id === '')
        return res.sendStatus(400);
    
    db.forumModel.find({}, function(err, result) {
        if (err) {
            console.log(err);
            return res.sendStatus(401);
        }
        if (result[0] == undefined)
            return res.sendStatus(401);
        result[0].threads[postId].comments[id].replies.push(
            {
                author: author,
                replyBody: comment
            }
        );
        result[0].save(function(err) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            db.forumModel.find({}, function(err, forum) {
                if (err) {
                    console.log(err)
                    return res.sendStatus(500);
                }
                console.log('Comment to reply posted');
                return res.sendStatus(200);
            });
        });
    });
}