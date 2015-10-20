var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../model/user.js');
var Post = require("../model/post.js");
var Account = require('../model/account.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  Post.get(null, function(err, posts) {
	if (err) {
		posts = [];
	}
	res.render('index', {
		title: 'HomePage',
		posts: posts,
		user : req.session.user,
            success : req.flash('success').toString(),
            error : req.flash('error').toString()
	});
  });
});

//router.get('/hello', function(req,res,next){
//	res.send('Time is '+new Date().toString );
//});

router.get('/u/:user', function(req,res){
	User.get(req.params.user, function(err, user){
		if(!user){
			req.flash('error', 'user is not exist.');
			return res.redirect('/');
		}
		Post.get(user.name, function(err, posts){
			if(err){
				req.flash('error'. err);
				return res.redirect('/');
			}
			res.render('user',{
				title: user.name,
				posts: posts,
			});
		});
	});
});

router.post('/post', checkLogin);
router.post('/post', function(req,res){
	var currentUser = req.session.user;
	var post = new Post(currentUser.name, req.body.post);
	post.save(function(err){
		if(err){
			req.flash('error', err);
			return res.redirect('/');
		}
		req.flash('success', 'post success.');
		res.redirect('/u/'+ currentUser.name);
	});
});

router.post('/deleteAccount', checkLogin);
router.post('/deleteAccount', function(req,res){
	var id = req.body.accountId;
	Account.delete(id,function(err){
		if(err){
			//req.flash('error', err);
			//return res.redirect('/managerMoney');
		}
		res.json({success:1});
		//req.flash('success','delete success!');
		//res.redirect('/managerMoney');
	});
});

router.get('/managerMoney', checkLogin);
router.get('/managerMoney', function(req,res,next){
	var user = req.session.user;
	Account.get(user.name,function(err,accounts){
		if(err){
			accounts = [];
		}
		res.render('managerMoney',{
			title: 'money manager',
			accounts: accounts,
		});
	});
});

router.post('/managerMoney', checkLogin);
router.post('/managerMoney', function(req,res,next){
	var number = req.body.number;
	var type = req.body.type;
	if(number == '' || type == ''){
		req.flash('error','number or type can not empty!');
		return res.redirect('/managerMoney');
	}
	next();
});
router.post('/managerMoney', function(req,res){
	var currentUser = req.session.user;
	var account = new Account(currentUser.name,req.body.number,req.body.type,req.body.time);
	account.save(function(err){
		if(err){
			req.flash('error', err);
			return res.redirect('/managerMoney');
		}
		req.flash('success','account success!');
		res.redirect('/managerMoney');
	});
});


router.get('/reg', checkNotLogin);
router.get('/reg', function(req,res,next){
	res.render('reg', {
		title: 'user regist'
	});
});

router.post('/reg', checkNotLogin);
router.post('/reg', function(req, res){
	if(req.body['username'] == '' || req.body['password'] == ''){
		req.flash('error','username or password can not be empty.');
		return res.redirect('/reg');
	}
	if(req.body['password-repeat'] != req.body['password']){
		req.flash('error','repeatPwd is not match Pwd');
		return res.redirect('/reg');
	}
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('base64');

	var newUser = new User({
		name: req.body.username,
		password: password,
	});

	User.get(newUser.name, function(err, user){
		if(user){
			err = 'Username already exists.';
		}
		if(err){
			req.flash('error', err);
			return res.redirect('/reg');
		}

		newUser.save(function(err){
			if(err){
				req.flash('error', err);
				return res.redirect('/reg');
			}
			req.session.user = newUser;
			req.flash('success','regist success!');
			res.redirect('/');
		});
	});
});

router.get('/login', checkNotLogin);
router.get('/login', function(req,res,next){
	res.render('login', {
		title: 'user login'
	});
});

router.post('/login', checkNotLogin);
router.post('/login', function(req,res){
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('base64');
	
	User.get(req.body.username, function(err, user){
		if(!user){
			req.flash('error', 'user is not exist.');
			return res.redirect('/login');
		}
		if(user.password != password){
			req.flash('error', 'password is not correct.');
			return res.redirect('/login');
		}
		req.session.user = user;
		req.flash('success', 'login success.');
		res.redirect('/');
	});
});

router.get('/logout', checkLogin);
router.get('/logout', function(req,res){
	req.session.user = null;
	req.flash('success', 'logout success.');
	res.redirect('/');
});

function checkNotLogin(req,res,next){
	if(req.session.user){
		req.flash('error', 'user is already login.');
		return res.redirect('/');
	}
	next();
}

function checkLogin(req,res,next){
	if(!req.session.user){
		req.flash('error', 'user is not login.');
		return res.redirect('/login');
	}
	next();
}

module.exports = router;
