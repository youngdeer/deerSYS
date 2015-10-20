/**
 * Created by luyang on 2015/10/14.
 */
var mongodb = require('./db');
var moment = require('moment');

function Account(username,number,type,time,id){
    if(id){
        this.id = id;
    }
    this.name = username;
    this.number = number;
    this.type = type;
    if(time){
        this.time = time;
    }else{
        this.time = moment().format('YYYY-MM-DD');
    }
}

module.exports = Account;

Account.prototype.save = function save(callback){
    var account = {
        user: this.name,
        number: this.number,
        type: this.type,
        time: this.time,
    }

    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('accounts',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.ensureIndex('user');
            collection.insert(account,{safe:true},function(err,account){
                    mongodb.close();
                    return callback(err,account);
            });
        });
    });
}

Account.get = function get(username,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('accounts',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            var query = {};
            if(username){
                query.user = username;
            }
            collection.find(query).sort({time:-1}).toArray(function(err,docs){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                var accounts = [];
                docs.forEach(function(doc,index){
                    var account = new Account(doc.user,doc.number,doc.type,doc.time,doc._id);
                    accounts.push(account);
                });
                callback(null,accounts);
            });
        });
    });
}


Account.delete = function del(id,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('accounts',function(err,collection){
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