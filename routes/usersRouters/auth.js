let express = require('express');
let router = express.Router();
let passportGoogle = require('../../auth/google');
let passportOutlook = require('../../auth/outlook');
let dummyAuth = require('../../auth/dummyAuth');

/* LOGOUT ROUTER */
router.get('/logout', function (req, res)
{
    req.logout();
    res.redirect('/');
});

/* GOOGLE ROUTER */
router.get('/google',
    passportGoogle.authenticate('google', {scope: ['https://www.googleapis.com/auth/userinfo.email']}));

router.get('/google/callback',
    passportGoogle.authenticate('google', {failureRedirect: '/NotAgudaEmployee'}),
    function (req, res)
    {
        if (req.isAuthenticated()) {
            res.redirect('/Home')
        }
        else {
            res.redirect('userViews/login')
        }
    });

///////////////
router.get('/outlook',
    passportOutlook.authenticate('windowslive', {
        scope: [
            'openid',
            'profile',
            'offline_access',
            'https://outlook.office.com/Mail.Read'
        ],
        prompt: 'login'
    })
);

router.get('/outlook/callback',
    passportOutlook.authenticate('windowslive', {failureRedirect: '/userViews/login'}),
    function (req, res)
    {
        if (req.isAuthenticated()) {
            res.redirect('/Home')
        }
        else {
            res.redirect('userViews/login')
        }
    });

let argv = process.argv;
if (argv.length >= 3 && argv[2].toLowerCase() === "test") {
    router.get('/dummyAuth', dummyAuth.authenticate('local', {failureRedirect: '/userViews/login'}),
        function (req, res)
        {
            if (req.isAuthenticated()) {
                res.redirect('/Home')
            }
            else {
                res.redirect('userViews/login')
            }
        }
    );
}

///////////////
module.exports = router;
