var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(new GoogleStrategy({
        clientID: "332799736831-mcj8eu9ocjaj89kaasde3j6rf6tugtt8.apps.googleusercontent.com",
        clientSecret: "Iejq6vU5UkiGBEXJdyjm9Wqh",
        callbackURL: "http://localhost:3000/auth/google/callback"
    },
    function (accessToken, refreshToken, profile, done) {
        let userEmail = profile.emails[0].value;
        let suffixOfEmail = userEmail.split('@')[1];
        //Remember Change The Condition.
        if (suffixOfEmail !== 'aguda.bgu.ac.il') {
            done(null, profile);
        }
        else {
            done(null, null);
        }
    }
));

module.exports = passport;
