/**
 * Created by luyang on 2015/10/14.
 */
var mongodb = require('./db');
var moment = require('moment');
var Promise = require("bluebird");
Promise.promisifyAll(mongodb);

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

    var getCollection = function(db){
        Promise.promisifyAll(db);
        return db.collectionAsync('accounts');
    }

    var collectionInsert = function(collection){
        collection.ensureIndex('user');
        Promise.promisifyAll(collection);
        return collection.insertAsync(account,{safe:true});
    }

    var saveSuccess = function(){
        mongodb.close();
        return callback();
    }

    var saveFail = function(err){
        mongodb.close();
        return callback(err);
    }

    mongodb.openAsync()
        .then(getCollection)
        .then(collectionInsert)
        .then(saveSuccess)
        .catch(saveFail);
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
                var totalCost = 0;
                docs.forEach(function(doc,index){
                    totalCost += parseFloat(doc.number);
                    var account = new Account(doc.user,doc.number,doc.type,doc.time,doc._id);
                    accounts.push(account);
                });
                callback(null,accounts,totalCost);
            });
        });
    });
}

Account.search = function search(username,number,type,time,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('accounts',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            var query = {}
            query.user = username;
            if(number != ''){
                query.number = number;
            }
            if(type != ''){
                query.type = type;
            }
            if(time != ''){
                query.time = time;
            }
            collection.find(query).sort({time:-1}).toArray(function(err,docs){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                var accounts = [];
                var totalCost = 0;
                docs.forEach(function(doc,index){
                    totalCost += parseFloat(doc.number);
                    var account = new Account(doc.user,doc.number,doc.type,doc.time,doc._id);
                    accounts.push(account);
                });
                callback(null,accounts,totalCost);
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