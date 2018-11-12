var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var expressSession = require('express-session');
var flash = require('express-flash');

const MongoStore = require("connect-mongo")(expressSession);
var mongoose = require('mongoose');

var routes = require('./routes/index');
var create = require('./routes/widget/create');
var widgetIndex = require('./routes/widget/index');
var widgetEdit = require('./routes/widget/edit');
var render = require('./routes/render');
var widget = require('./routes/widget')

// auth
var signin = require('./routes/auth/signin');
var signup = require('./routes/auth/signup');
var auth = require('./routes/auth');

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
// development
var dbUri = (app.get("env") === "development") ? 'mongodb://localhost:27017/vcl' : 'mongodb://idevia:idevia123@ds111963.mlab.com:11963/vcl-api';
mongoose.connection.openUri(dbUri, { useNewUrlParser: true }, function(err) {
    if (err) {
        console.log('Not connected to database', err);
    } else {
        console.log('database connected');
    }
});


const yes = require("yes-https");
app.use(yes());
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
app.use(expressSession({ secret: 'superAwesome', saveUninitialized: false, resave: false, store: new MongoStore({ mongooseConnection: mongoose.connection }) }));
app.use(flash());

app.use('/', routes);
app.use('/create', create);
app.use('/widget/', widgetIndex);
app.use('/widget/delete', widget);
app.use('/widget/edit/', widgetEdit);
app.use('/render', render);
app.use('/auth', auth);
app.use('/auth/signup', signup);
app.use('/auth/signin', signin);

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
