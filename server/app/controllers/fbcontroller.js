var express = require('express');
var mongoose = require('mongoose');
var userModel = mongoose.model('User');
var responseGenerator = require('./../../libs/responseGenerator');
var jwt = require('jsonwebtoken'); 
var expressJwt = require('express-jwt');
var socialRouter  = express.Router();


var secret = require("./../../libs/jwtSecret").secret;


module.exports.passportControllerFunction = function(app,passport) {
   

    app.get('/login/facebook',
      passport.authenticate('facebook',{ scope: ['email']}));

    app.get('/login/facebook/return', 
      passport.authenticate('facebook', { failureRedirect: '/login' }),
      function(req, res) {
        //if authenticated check if user is in db or not 
        // if not then saves it
        if(req.isAuthenticated()){
            userModel.findOne({'email':req.user.emails[0].value},function(err,result){

                if(err){
                  res.send("some error "+err)
                }else{
                  if(result=="" || result == undefined ||result == null){

                      var newUser = new userModel({
                          
                          firstName           : req.user.name.givenName,
                          lastName            : req.user.name.familyName,
                          email               : req.user.emails[0].value


                      });// end new user 
                      // saves new user
                      newUser.save(function(err){
                          if(err){

                              var myResponse = responseGenerator.generate(true,err,500,null);
                              console.log(myResponse);
                             
                          }
                          else{
                             // sets new user to session
                             req.session.user = newUser;
                             res.redirect('/#/')
                            
                          }

                      });//end new user save

                  }else {                    
                      //sets found user to session
                      req.session.user = result
                      res.redirect('/#/')
                  }
                }

            })
        }
        
      });

    ////////////////////////////////////// route to check if user is set or not ///////////////////////////////////

    socialRouter.get('/getProfile',
      function(req, res){
        if(req.session.user){
          
          var user = req.session.user;
          delete user.password;  
          req.session.user=null;
          req.logout();
          var token = jwt.sign({user:user}, secret, { expiresIn : 60*30 });
          var myResponse = responseGenerator.generate(false,"success",200,token);
          res.send(myResponse);

        }else{
          var myResponse = responseGenerator.generate(true,"user not set",404,null);
          res.send(myResponse)
        }
    });


    app.use('/api/v1', socialRouter);


}
