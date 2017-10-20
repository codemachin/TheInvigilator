var express          = require( 'express' )
var responseGenerator = require('./../../libs/responseGenerator');

var mongoose = require('mongoose');
var userModel = mongoose.model('User');


module.exports.passportControllerFunction = function(app,passport) {

    //   redirecting the user to google.com.  After authorization, Google
    //   will redirect the user back to this application at /auth/google/callback
    app.get('/auth/google', passport.authenticate('google', { scope: [ 'profile','email' ] //asks for specific permissions
          
    }));
    
    //if authenticated check if user is in db or not 
    // if not then saves it
    app.get( '/auth/google/callback', 
        	passport.authenticate( 'google', { 
        		
        		failureRedirect: '/login'}), function(req, res){
                
              if(req.isAuthenticated()){

                    userModel.find({'email':req.user.emails[0].value},function(err,result){

                        if(err){
                          res.send("some error "+err)
                        }else{
                          if(result=="" || result == undefined ||result == null){

                              var newUser = new userModel({
                                  
                                  firstName           : req.user.name.givenName,
                                  lastName            : req.user.name.familyName,
                                  email               : req.user.emails[0].value,

                              });// end new user 

                              newUser.save(function(err){
                                  if(err){
                                      var myResponse = responseGenerator.generate(true,err,500,null);
                                      console.log(myResponse);                                     
                                  }
                                  else{
                                     req.session.user = newUser;
                                     res.redirect('/#/')                                    
                                  }

                              });//end new user save

                          }else {
                               req.session.user = result[0]
                               res.redirect('/#/')
                          }
                        }

                    })
                }
            });


}