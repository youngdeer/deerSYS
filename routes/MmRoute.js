/**
 * Created by youngdeer on 2016/7/11.
 */
var express = require('express');
var router = express.Router();
var Promise = require("bluebird");
var Account = require('../model/account.js');
var UseType = require('../model/useType.js');
Promise.promisifyAll(Account);
Promise.promisifyAll(Account.prototype);
Promise.promisifyAll(UseType);
Promise.promisifyAll(UseType.prototype);



router.post('/deleteAccount', checkLogin);
router.post('/deleteAccount', function(req,res){
    var id = req.body.accountId;
    Account.delete(id,function(err){
        if(err){
            return res.json({error:err});
        }
        res.json({success:1});
    });
});

router.post('/addType', checkLogin);
router.post('/addType', function(req,res){
    var currentUser = req.session.user;
    var useType = req.body.type;
    var useType = new UseType(currentUser.name,useType);
    //console.log(useType);
    useType.saveAsync()
        .then(function(){
            res.json({success:1});
        })
        .catch(function(err){
            return res.json({error:err});
        });
});

router.post('/deleteUseType', checkLogin);
router.post('/deleteUseType', function(req,res){
    var id = req.body.id;
    UseType.delete(id,function(err){
        if(err){
            return res.json({error:err});
        }
        res.json({success:1});
    });
});

router.get('/getUseType', checkLogin);
router.get('/getUseType', function(req,res){
    var user = req.session.user;
    UseType.get(user.name,function(err,typeList){
        if(err){
            return res.json({error:err});
        }
        res.json(typeList);
    });
});

router.get('/', checkLogin);
router.get('/', function(req,res,next){
    var user = req.session.user;
    Account.get(user.name,function(err,accounts,totalCost){
        if(err){
            accounts = [];
        }

        UseType.get(user.name,function(err,typeList){
            if(err){
                typeList = [];
            }

            res.render('managerMoney',{
                title: '记账本',
                accounts: accounts,
                typeList: typeList,
                totalCost:totalCost.toString(),
            });

        });

    });
});

router.post('/', checkLogin);
router.post('/', function(req,res,next){
    var isSearch = req.body.isSearch;
    if(isSearch != 'yes'){
        var number = req.body.number;
        var type = req.body.type;
        if(number == '' || type == ''){
            req.flash('error','number or type can not empty!');
            return res.redirect('/managerMoney');
        }
    }
    next();
});
router.post('/', function(req,res){
    var isSearch = req.body.isSearch;
    var currentUser = req.session.user;
    if(isSearch != 'yes'){
        var account = new Account(currentUser.name,req.body.number,req.body.type,req.body.time);
        account.saveAsync()
            .then(function(){
                req.flash('success','account success!');
                res.redirect('/managerMoney');
            })
            .catch(function(err){
                req.flash('error', err);
                return res.redirect('/managerMoney');
            });
        /*account.save(function(err){
         if(err){
         req.flash('error', err);
         return res.redirect('/managerMoney');
         }
         req.flash('success','account success!');
         res.redirect('/managerMoney');
         });*/
    }else{
        Account.search(currentUser.name,req.body.number,req.body.type,req.body.time,function(err,accounts,totalCost){
            if(err){
                accounts = [];
            }
            UseType.get(currentUser.name,function(err,typeList){
                if(err){
                    typeList = [];
                }

                res.render('managerMoney',{
                    title: '记账本',
                    accounts: accounts,
                    typeList: typeList,
                    totalCost:totalCost.toString(),
                });

            });
        });
    }
});

function checkLogin(req,res,next){
    if(!req.session.user){
        req.flash('error', 'user is not login.');
        return res.redirect('/login');
    }
    next();
}

module.exports = router;