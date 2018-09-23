var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var mongoose = require('mongoose');

var routes = require('./routes/index');
var create = require('./routes/create');
var render = require('./routes/render');
var test = require('./routes/test');
// var comic = require('./routes/comic');
// var chapters = require('./routes/chapters');
// var page = require('./routes/page');
// var popular = require('./routes/popular');
// var browse = require('./routes/browse');
// var latest = require('./routes/latest');
// var trending = require('./routes/trending');
// var auth = require('./routes/auth');
// var user = require('./routes/user');

var app = express();
mongoose.Promise = global.Promise;
// var dbpath = "mongodb://localhost:27017/vlc";
var dbpath = "mongodb://idevia:1devia@ds111963.mlab.com:11963/vcl-api";

// development
mongoose.connection.openUri(dbpath, { useNewUrlParser: true }, function(err) {
    if (err) {
        console.log('Not connected to database', err);
    } else {
        console.log('database connected');
    }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/create', create);
app.use('/render', render);
app.use('/test', test);
// app.use('/comic', comic);
// app.use('/chapters', chapters);
// app.use('/page', page);
// app.use('/popular', popular);
// app.use('/browse', browse);
// // app.use('/push', push);
// app.use('/latest', latest);
// app.use('/trending', trending);
// app.use('/auth', auth);
// app.use('/user', user);

/// catch 404 and forwarding to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
