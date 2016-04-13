/**
 * Created by luyang on 2016/4/13.
 */

var mongodb = require('./db');
var Promise = require("bluebird");
Promise.promisifyAll(mongodb);

function UseType(username,useType,id){
    if(id){
        this.id = id;
    }
    this.username = username;
    this.useType = useType;
}

module.exports = UseType;

UseType.prototype.save = function save(callback){
    var useType = {
        username : this.username,
        useType : this.useType,
    }

    var getCollection = function(db){
        Promise.promisifyAll(db);
        return db.collectionAsync('useType');
    }

    var collectionInsert = function(collection){
        collection.ensureIndex('username');
        Promise.promisifyAll(collection);
        return collection.insertAsync(useType,{safe:true});
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


UseType.get = function get(username,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }

        db.collection("useType",function(err,collection){
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

                var typeList = [];
                docs.forEach(function(doc,index){
                    var useType = new UseType(doc.username,doc.useType,doc._id);
                    typeList.push(useType);
                });
                callback(null,typeList);
            });
        })

    });
}
