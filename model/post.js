var mongodb = require('./db');
var moment = require('moment');

function Post(username, post, time, id){
	this.user = username;
	this.post = post;
	if(time){
		this.time = time;
	}else{
		this.time = moment().format('YYYY-MM-DD');
	}

	if(id){
		this.id = id;
	}
}

module.exports = Post;

Post.prototype.save = function save(callback){
	var post = {
		user: this.user,
		post: this.post,
		time: this.time,
	};

	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}
		db.collection('posts', function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.ensureIndex('user');
			collection.insert(post, {safe: true}, function(err, post){
				mongodb.close();
				callback(err, post);
			});
		});
	});
};

Post.get = function get(username, callback){
	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}
		db.collection('posts', function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			var query = {};
			if(username){
				query.user = username;
			}
			collection.find(query).sort({time: -1}).toArray(function(err, docs){
				mongodb.close();
				if(err){
					callback(err, null);
				}
				var posts = [];
				docs.forEach(function(doc, index){
					var post = new Post(doc.user, doc.post, doc.time, doc._id);
					posts.push(post);
				});
				callback(null,posts);
			});
		});
	});
};

Post.delete = function del(id,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('posts',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			var query = {};
			var ObjectID = require('mongodb').ObjectID;
			if(id){
				query._id = ObjectID(id);
			}
			collection.remove(query,{safe:true},function(err){
				mongodb.close();
				return callback(err);
			});
		});
	});
}