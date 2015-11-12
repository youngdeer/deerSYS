var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');

var routes = require('./routes/index');
var users = require('./routes/users');

//采用connect-mongodb中间件作为Session存储  
var session = require('express-session');  
var settings = require('./settings');  
var MongoStore = require('connect-mongo')(session);

var app = express();

//session配置  
/*app.use(session({  
    secret: Settings.cookieSecret,   
    cookie: { maxAge: 600000 },  
    store: new MongoStore({
        db: Settings.db,
		host: Settings.host,
		port: Settings.port
	}),
	resave: true,
    saveUninitialized: true,		
}));*/
app.use(session({
	secret: settings.cookieSecret,
	store: new MongoStore({
		db: settings.db,
	}),
	resave: true,
    saveUninitialized: true,
}));

app.use(flash());

app.use(function(req,res,next){
	res.locals.user = req.session.user;
	res.locals.post = req.session.post;
	var error = req.flash('error');
	res.locals.error = error.length ? error : null;

	var success = req.flash('success');
	res.locals.success = success.length ? success : null;
	next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
//app.use('/hello', routes);
//app.use('/user/:username',function(req,res){
//	res.send('user: '+req.params.username)
//});
app.use('/u/:user', routes);
app.post('/post', routes);
app.use('/reg', routes);
app.post('/doReg', routes);
app.use('/login', routes);
app.post('/doLogin', routes);
app.use('/logout', routes);
app.use('/users', users);
app.use('/managerMoney', routes);
app.use('/mobileReg', routes);
app.use('/WXtest', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
