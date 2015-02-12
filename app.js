var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var bodyParser = require('body-parser');

var passwordless = require('passwordless');

var RedisStore = require('passwordless-redisstore-bcryptjs');
 
var email = require("emailjs");
var url = require('url');

var routes = require('./routes/index');
var config = require('./config/app.config');

if(!config.email.password){
    console.error('please config the password for smtp server');
    process.exit(1);
}

var app = express();

var smtpServer  = email.server.connect({
   user:    config.email.sender, 
   password: config.email.password, 
   host:    config.email.smtp, 
   ssl:     true
});

//Path to be send via email
var host = config.host;

// Setup of Passwordless
passwordless.init(new RedisStore(6379, '127.0.0.1'));
passwordless.addDelivery(
    function(tokenToSend, uidToSend, recipient, callback) {
        // Send out token
        smtpServer.send({
           text:    'Hello!\nYou can now access your account here: ' 
                + host + '?token=' + tokenToSend + '&uid=' + encodeURIComponent(uidToSend), 
           from:    config.email.sender, 
           to:      recipient,
           subject: 'Token for ' + host
        }, function(err, message) { 
            if(err) {
                console.log(err);
            }
            callback(err);
        });
    });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Standard express setup
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

var Redis = require('connect-redis')(expressSession);
app.use(expressSession({
    store: new Redis(),
    secret: 'keyboard cat',
    cookie: {
        httpOnly: true,
        secure: false, 
        maxAge: 1000 * 60 * 60 * 24 * 30, //one month
        domain: url.parse(config.application).hostname
    },
    unset: 'destroy'
}));

app.use(express.static(path.join(__dirname, 'public')));

// Passwordless middleware
app.use(passwordless.sessionSupport());
app.use(passwordless.acceptToken({ successRedirect: '/' }));

app.use('/', routes);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});
