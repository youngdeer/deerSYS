var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../model/user.js');
var Post = require("../model/post.js");
var Account = require('../model/account.js');
var Weixin = require('../model/weixin.js');
var WeixinMenu = require('../model/weixinMenu.js');
var Promise = require("bluebird");
var request = require('request');
var moment = require('moment');
var Util = require('../model/util.js');
Promise.promisifyAll(Account);
Promise.promisifyAll(Account.prototype);

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

router.post('/deletePost', function(req,res){
	var id = req.body.postId;
	Post.delete(id,function(err){
		if(err){
			return res.json({error:err});
		}
		res.json({success:1});
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

router.get('/WXtest', function(req,res){
	Weixin.get(req,res,function(){
		console.log('weixin get');
	});
	/*Weixin.getMedia();*/
});

router.post('/WXtest', function(req,res){
	Weixin.post(req,res,function(){
		console.log('weixin post');
	});
});

router.get('/mobileReg', checkNotLogin);
router.get('/mobileReg', function(req,res,next){
	res.render('mobileReg', {
		title: 'user mobile regist'
	});
});

router.post('/getIdentifyingCode', checkNotLogin);
router.post('/getIdentifyingCode', function(req, res){
	var md5 = crypto.createHash('md5');
	var timestamp = moment().format('YYYYMMDDHHmmss');
	var str = '7144845b85074746885531f61b1409bc95a9694fe9cb40dd8fc69916ee845d95'+timestamp;
	var sign = md5.update(str).digest('hex');
	var param = Util.randomNum(6);
	var to = req.body.mobileNum;
	if(to.trim() == '' || matchMobileNum(to) == false){
		req.flash('error','mobileNum is empty or format incorrect.');
		return res.redirect('/mobileReg');
	}
	request.post({url:'https://api.qingmayun.com/20150822/SMS/templateSMS', form: {
		accountSid: '7144845b85074746885531f61b1409bc',
		appId: 'b1c92f84a0b64509acdd1215199d9134',
		templateId: '3840229',
		to: to,
		param: param,
		timestamp: timestamp,
		sig: sign,
	}}, function optionalCallback(err, httpResponse, body) {
		if (err) {
			return console.error('getIdentifyingCode failed:', err);
		}
		console.log('getIdentifyingCode successful!  Server responded with:', body);
		if(JSON.parse(body).respCode == '00000'){
			req.flash('success','IdentifyingCode has sent to your phone.');
			res.render('mobileReg',{
				title: 'user mobile regist',
				param: param.toString(),
				to:to.toString(),
			});
		}else{
			req.flash('error','get identifyingCode has problem.');
			return res.redirect('/mobileReg');
		}
	});
});


function matchMobileNum(tel){
	var telReg = !!tel.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
	return telReg;
}

router.get('/reg', checkNotLogin);
router.get('/reg', function(req,res,next){
	res.render('reg', {
		title: 'user regist'
	});
});

router.post('/reg', checkNotLogin);
router.post('/reg', function(req, res){
	var md5 = crypto.createHash('md5');
	var type = req.body.type;
	if(type == 'mobile'){
		var passwordMobile = md5.update(req.body.password).digest('base64');

		var newMobileUser = new User({
			name: req.body.username,
			password: passwordMobile,
		});

		User.get(newMobileUser.name, function(err, user){
			if(user){
				err = 'Username already exists.';
			}
			if(err){
				return res.json({error:err});
			}

			newMobileUser.save(function(err){
				if(err){
					return res.json({error:err});
				}
				req.session.user = newMobileUser;
				res.json({success:1});
			});
		});
	}else{
		if(req.body['username'] == '' || req.body['password'] == ''){
			req.flash('error','username or password can not be empty.');
			return res.redirect('/reg');
		}
		if(req.body['password-repeat'] != req.body['password']){
			req.flash('error','repeatPwd is not match Pwd');
			return res.redirect('/reg');
		}
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
	}
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

router.post('/androidLogin',function(req,res){
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('base64');
	var username = req.body.username;
	//console.log(username+"--"+password);
	User.get(username, function(err, user){
		if(!user){
			return res.send("login fail");
		}
		if(user.password != password){
			return res.send("password is not correct");
		}
		res.send("login success")
	});
});

router.get('/logout', checkLogin);
router.get('/logout', function(req,res){
	req.session.user = null;
	req.flash('success', 'logout success.');
	res.redirect('/');
});

router.get('/createMenu', function(req,res){
	WeixinMenu.createMenu();
});

router.get('/sendTotalCost', function(req,res){
	Account.get("deer",function(err,accounts,totalCost){
		var context = "";
		if(err){
			context = "error";
		}else{
			context = totalCost.toString();
		}
		Weixin.sendTotalCost(context);
	});

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
