/**
 * Created by youngdeer on 2016/10/18.
 */
/**
 * Created by youngdeer on 2016/10/18.
 */
var express = require('express');
var router = express.Router();
var Promise = require("bluebird");
var QuestionMonitor = require('../model/deerWork/questionMonitor.js');
Promise.promisifyAll(QuestionMonitor);
Promise.promisifyAll(QuestionMonitor.prototype);


router.get('/', checkLogin);
router.get('/', function(req,res,next){
    res.render('deerWork/deerWork_index', {

    });
});

router.get('/questionMonitor', checkLogin);
router.get('/questionMonitor', function(req,res,next){
    var user = req.session.user;
    QuestionMonitor.getList(user.name,function(err,questionMonitors){
        if(err){
            questionMonitors = [];
        }
        //console.log(questionMonitors);
        res.render('deerWork/questionMonitor',{
            questionMonitors: questionMonitors
        });

    });
});

router.post('/saveQm', checkLogin);
router.post('/saveQm', function(req,res){
    var module = req.body.module;
    var simpleDesc = req.body.simpleDesc;
    var priority = req.body.priority;
    var startTime = req.body.startTime;
    var dealTime = req.body.dealTime;
    var mark = req.body.mark;
    var description = req.body.description;
    var status = req.body.status;
    var currentUser = req.session.user;
    var id = req.body.id;
    var questionMonitor = new QuestionMonitor(currentUser.name,module,simpleDesc,priority,startTime,dealTime,mark,description,status);
    if(id){
        //console.log(id)
        questionMonitor.updateAsync(id)
            .then(function(){
                res.json({success:'更新成功'});
            })
            .catch(function(err){
                console.log(err)
                return res.json({error:err});
            });
    }else{
        questionMonitor.saveAsync()
            .then(function(){
                res.json({success:'保存成功'});
            })
            .catch(function(err){
                return res.json({error:err});
            });
    }

});

router.post('/getQmById', checkLogin);
router.post('/getQmById', function(req,res,next){
    var id = req.body.id;
    QuestionMonitor.getById(id,function(err,questionMonitors){
        if(err){
            questionMonitors = [];
            return res.json({error:err});
        }
        //console.log(questionMonitors);
        res.json({questionMonitors:questionMonitors});

    });
});

router.get('/table', checkLogin);
router.get('/table', function(req,res,next){
    res.render('deerWork/table', {

    });
});



function checkLogin(req,res,next){
    if(!req.session.user){
        req.flash('error', 'user is not login.');
        return res.redirect('/login');
    }
    next();
}

module.exports = router;