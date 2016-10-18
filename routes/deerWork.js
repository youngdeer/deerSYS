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
    res.render('deerWork_index', {
        title: 'deer work'
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