var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 
app.use(express.static('public'));
app.use('/', index);
app.use('/users', users);

//+
app.use('/current', function(req, res) {
	res.send(currentData);
});
app.use('/rcs', function(req, res) {
	res.send(rcsData);
});
//+s
app.use('/rcs1', function(req, res) {
    res.send(rcsData1);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');

});

module.exports = app;

//+add file
const fs = require('fs');

const currentPath = './public/data/current.sc';
const currentData = Buffer.from(fs.readFileSync(currentPath)).toString();

//rsc_m
const rcsPath = './public/data/test.rcs';
const rcsData = Buffer.from(fs.readFileSync(rcsPath)).toString();

//rsc_s
const rcsPath1 = './public/data/test1.rcs';
const rcsData1 = Buffer.from(fs.readFileSync(rcsPath1)).toString();