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
var fs = require('fs');
var mustache = require('mustache');

var routes = require('./routes/index');
var config = require('./config/app.config');

var app = express();

var emailConfig = {
   host:     process.env.SMTP_SERVER || config.email.smtp, 
   port:     process.env.SMTP_PORT,
   ssl:      process.env.NODE_ENV === 'production'
};

var redisHost = process.env.REDIS_HOST || '127.0.0.1'

if(process.env.NODE_ENV === 'production'){
    emailConfig.user = config.email.sender;
    emailConfig.password = config.email.password;
}

var smtpServer  = email.server.connect(emailConfig);

//Path to be send via email
var host = config.host;

// Setup of Passwordless
passwordless.init(new RedisStore(6379, redisHost));
passwordless.addDelivery(
    function(tokenToSend, uidToSend, recipient, callback) {
        // Send out token
        var emailTemplate = mustache.render(fs.readFileSync('./views/email.mustache.html','utf-8'), {
            host : host,
            token : tokenToSend,
            uid : encodeURIComponent(uidToSend)
        });

        smtpServer.send({
           text :    'Hello!\nYou can now access your account here: ' 
                + host + '?token=' + tokenToSend + '&uid=' + encodeURIComponent(uidToSend), 
           from :    config.email.sender, 
           to :      recipient,
           subject : '欢迎加入Facehub',
           attachment : [
            {data: emailTemplate, alternative:true}
           ]
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

//make the login states persistent use redis
var Redis = require('connect-redis')(expressSession);
app.use(expressSession({
    store: new Redis(),
    secret: config.email.password
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

process.on('uncaughtException', function(err) {
    console.error('Caught exception: ', err);
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  console.log('please visit http://127.0.0.1:' + server.address().port);
});
