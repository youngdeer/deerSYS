/**
 * Created by youngdeer on 2016/10/21.
 */
var mongodb = require('../db');
var moment = require('moment');
var Promise = require("bluebird");
Promise.promisifyAll(mongodb);

/**
 * @param username
 * @param module
 * @param simpleDesc
 * @param priority
 * @param startTime
 * @param dealTime
 * @param mark
 * @param description
 * @param status ，状态有以下几种Issue，Open, Fixed, Closed, Published, NotProblem, ReOpen
 * @param id
 * @constructor
 */
function QuestionMonitor(username,module,simpleDesc,priority,startTime,dealTime,mark,description,status,id){
    if(id){
        this.id = id;
    }
    this.username = username;
    this.module = module;
    this.simpleDesc = simpleDesc;
    this.priority = priority;
    this.mark = mark;
    this.description = description;

    if(dealTime){
        this.dealTime = dealTime;
    }else{
        this.dealTime = moment().format('YYYY-MM-DD');
    }

    if(status){
        this.status = status;
    }else{
        this.status = 'Issue';
    }

    if(startTime){
        this.startTime = startTime;
    }else{
        this.startTime = moment().format('YYYY-MM-DD');
    }
}

module.exports = QuestionMonitor;

QuestionMonitor.prototype.save = function save(callback){
    var questionMonitor = {
        username: this.username,
        module: this.module,
        simpleDesc: this.simpleDesc,
        priority: this.priority,
        startTime: this.startTime,
        dealTime: this.dealTime,
        mark: this.mark,
        description: this.description,
        status: this.status,
    }

    var getCollection = function(db){
        Promise.promisifyAll(db);
        return db.collectionAsync('questionMonitor');
    }

    var collectionInsert = function(collection){
        collection.ensureIndex('username');
        Promise.promisifyAll(collection);
        return collection.insertAsync(questionMonitor,{safe:true});
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

QuestionMonitor.prototype.update = function save(id,callback){
    var questionMonitor = {
        username: this.username,
        module: this.module,
        simpleDesc: this.simpleDesc,
        priority: this.priority,
        startTime: this.startTime,
        dealTime: this.dealTime,
        mark: this.mark,
        description: this.description,
        status: this.status,
    }

    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }
        db.collection('questionMonitor', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            var query = {};
            var ObjectID = require('mongodb').ObjectID;
            if(id){
                query._id = ObjectID(id);
            }
            collection.update(query ,questionMonitor, {safe: true}, function(err){
                mongodb.close();
                callback(err);
            });
        });
    });
}

QuestionMonitor.updateStatus = function(id,status,callback){
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }
        db.collection('questionMonitor', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            var query = {};
            var ObjectID = require('mongodb').ObjectID;
            if(id){
                query._id = ObjectID(id);
            }
            collection.update(query ,{$set:{status:status}}, {safe: true}, function(err){
                mongodb.close();
                callback(err);
            });
        });
    });
}

QuestionMonitor.delete = function del(id,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('questionMonitor',function(err,collection){
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


QuestionMonitor.getList = function getList(username,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('questionMonitor',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            var query = {};
            if(username){
                query.username = username;
            }
            collection.find(query).sort({time:-1}).toArray(function(err,docs){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                var questionMonitors = [];
                docs.forEach(function(doc,index){
                    var questionMonitor = new QuestionMonitor(doc.username,doc.module,doc.simpleDesc,formatPriority(doc.priority),doc.startTime,doc.dealTime,doc.mark,doc.description,doc.status,doc._id);
                    questionMonitors.push(questionMonitor);
                });
                callback(null,questionMonitors);
            });
        });
    });
}

QuestionMonitor.getById = function getById(id,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('questionMonitor',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            var query = {};
            var ObjectID = require('mongodb').ObjectID;
            if(id){
                query._id = ObjectID(id);
            }
            collection.find(query).sort({time:-1}).toArray(function(err,docs){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                var questionMonitors = [];
                docs.forEach(function(doc,index){
                    var questionMonitor = new QuestionMonitor(doc.username,doc.module,doc.simpleDesc,doc.priority,doc.startTime,doc.dealTime,doc.mark,doc.description,doc.status,doc._id);
                    questionMonitors.push(questionMonitor);
                });
                callback(null,questionMonitors);
            });
        });
    });
}


function formatPriority(priority){
    var priorityName  = '';
    if(priority == '01'){
        priorityName = '一般';
    }else if(priority == '02'){
        priorityName = '重大';
    }else if(priority == '03'){
        priorityName = '紧急';
    }
    return priorityName;
}