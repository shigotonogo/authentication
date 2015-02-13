var express = require('express');
var url = require('url');
var router = express.Router();

var passwordless = require('passwordless');
var config = require('../config/app.config');

/* GET home page. */
router.get('/', function(req, res) {
    if (req.user) {
        var cookieOptions = {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 60 * 24 * 30 //one month
        };

        //in local development environment, we should not set the cookie domain to localhost(chrome browser has issue with this).
        if(process.env.NODE_ENV === 'production'){
            //we want set cookie to the root domain so we can have a simple sso solution.
            cookieOptions.domain = url.parse(config.application).hostname;
        }

        res.cookie('uid', req.user, cookieOptions);

        res.redirect(config.application);
    }else{
        res.render('index', {
            user: req.user
        });
    }
});

/* GET restricted site. */
router.get('/restricted', passwordless.restricted(),
    function(req, res) {
        res.render('restricted', {
            user: req.user
        });
    });

/* GET login screen. */
router.get('/login', function(req, res) {
    res.render('login', {
        user: req.user
    });
});

/* GET logout. */
router.get('/logout', passwordless.logout(),
    function(req, res) {
        res.clearCookie('uid');
        res.redirect(config.application + 'login');
    });

/* POST login screen. */
router.post('/sendtoken',
    passwordless.requestToken(
        // Simply accept every user
        function(user, delivery, callback) {
            callback(null, user);
            // usually you would want something like:
            // User.find({email: user}, callback(ret) {
            //      if(ret)
            //          callback(null, ret.id)
            //      else
            //          callback(null, null)
            // })
        }),
    function(req, res) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        res.render('sent');
    });

module.exports = router;
