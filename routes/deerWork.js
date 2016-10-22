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
    res.render('deerWork/questionMonitor', {

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
    var questionMonitor = new QuestionMonitor(currentUser.name,module,simpleDesc,priority,startTime,dealTime,mark,description,status);
    questionMonitor.saveAsync()
        .then(function(){
            res.json({success:1});
        })
        .catch(function(err){
            return res.json({error:err});
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