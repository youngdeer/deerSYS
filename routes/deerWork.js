/**
 * Created by youngdeer on 2016/10/18.
 */
/**
 * Created by youngdeer on 2016/10/18.
 */
var express = require('express');
var router = express.Router();


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



function checkLogin(req,res,next){
    if(!req.session.user){
        req.flash('error', 'user is not login.');
        return res.redirect('/login');
    }
    next();
}

module.exports = router;