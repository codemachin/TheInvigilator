var GoogleStrategy   = require( 'passport-google-oauth2' ).Strategy;
var Strategy = require('passport-facebook').Strategy;

exports.passportMiddleware = function(passport,app) {


    // API Access link for creating client ID and secret:
    var GOOGLE_CLIENT_ID      = "227560016616-1p0bjja183lt5mabridmld3iqch3dk12.apps.googleusercontent.com"
      , GOOGLE_CLIENT_SECRET  = "NEcKJyhz_BnHUwRNBQau_Jyi";


    // Use the GoogleStrategy within Passport.

    passport.use(new GoogleStrategy({
        clientID:     GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        /*callbackURL: "http://totalsolutions.ga/auth/google/callback",*/
        callbackURL: "http://localhost:3000/auth/google/callback",
        passReqToCallback   : true
      },
      function(request, accessToken, refreshToken, profile, done) {                 
          // sets req.user here
          return done(null, profile);
      }));
    

    // setting up client id and client secret

    passport.use(new Strategy({
        /*clientID: '466781710345000',
        clientSecret: 'be05f400aa68396530acd6abee8bbd37',
        callbackURL: 'http://totalsolutions.ga/login/facebook/return',*/
        /////////////////////////////////////// down - localhost ////////////////////////////////////////
        clientID: '359580641139615',
        clientSecret: '42bb227a973945d92e5ea283acdf3bab',
        callbackURL: 'http://localhost:3000/login/facebook/return',
        enableProof: true,
        profileFields: ['id', 'emails', 'name']
      },
      function(accessToken, refreshToken, profile, cb) {
        // req.user set here
        return cb(null, profile);
      }));


    // Configure Passport authenticated session persistence.
    passport.serializeUser(function(user, cb) {
      cb(null, user);
    });

    passport.deserializeUser(function(obj, cb) {
      cb(null, obj);
    });

    // cookie parser and express-sessions required for passportjs sessions
    app.use(require('cookie-parser')());
    app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

    // Initialize Passport and restore authentication state, if any, from the
    // session.
    app.use(passport.initialize());
    app.use(passport.session());


}
