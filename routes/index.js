var express = require('express');
var router = express.Router();

var passwordless = require('passwordless');
var config = require('../config/app.config');

/* GET home page. */
router.get('/', function(req, res) {
    if (req.user) {
        res.cookie('uid', req.user, {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 60 * 24 * 30, //one month
            domain: 'facehub.com'
        });

        res.redirect(config.callbackUrl);
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
        res.redirect('/');
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
        res.render('sent');
    });

module.exports = router;
