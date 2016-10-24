/**
 * Created by youngdeer on 2016/10/21.
 */
var mongodb = require('../db');
var moment = require('moment');
var Promise = require("bluebird");
Promise.promisifyAll(mongodb);

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
        this.status = 'issue';
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


QuestionMonitor.get = function get(username,callback){
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
                    var questionMonitor = new QuestionMonitor(doc.username,doc.module,doc.simpleDesc,doc.priority,doc.startTime,doc.dealTime,doc.mark,doc.description,doc.status,doc._id);
                    questionMonitors.push(questionMonitor);
                });
                callback(null,questionMonitors);
            });
        });
    });
}