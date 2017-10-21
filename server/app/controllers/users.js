var mongoose = require('mongoose');
var express = require('express');

// express router // used to define routes 
var userRouter  = express.Router();
var userModel = mongoose.model('User');

var jwt = require('jsonwebtoken');  
var expressJwt = require('express-jwt');
var secret = require("./../../libs/jwtSecret").secret;
var responseGenerator = require('./../../libs/responseGenerator');
var crypto = require('./../../libs/crypto');
var key = "JAICRYPTO-AES256";
var auth = require("./../../middlewares/auth");


module.exports.controllerFunction = function(app) {

    
////////////////////////////////// api to get all user details //////////////////////////////

    userRouter.get('/all',expressJwt({secret: secret}),function(req,res){
        userModel.find({},function(err,allUsers){
            if(err){                
                var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
                res.send(myResponse);
            }
            else{

                var myResponse = responseGenerator.generate(false,"retrieved successfully",200,allUsers);
                res.send(myResponse);

            }

        });//end user model find 

    });//end get all users

//////////////////////////////////////// get user by id ////////////////////////////////////////

    userRouter.get('/:id',expressJwt({secret: secret}),function(req,res){

        userModel.findOne({'_id':req.params.id},function(err,foundUser){
            if(err){
                var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
                res.send(myResponse);
            }
            else if(foundUser==null || foundUser==undefined || foundUser._id==undefined){

                var myResponse = responseGenerator.generate(true,"user not found",404,null);
                res.send(myResponse);

            }
            else{

                var myResponse = responseGenerator.generate(false,"user found",200,foundUser);
                res.send(myResponse);

            }

        });// end find
      

    });//end get all users

    ////////////////////////////////api to signup new user and enryping password with aes algorithm///////////

    userRouter.post('/signup',function(req,res){

        if(req.body.firstName!=undefined && req.body.lastName!=undefined && req.body.email!=undefined && req.body.password!=undefined){

            var passwordDb = crypto.encrypt(req.body.password,key);

            var newUser = new userModel({
                
                firstName           : req.body.firstName,
                lastName            : req.body.lastName,
                email               : req.body.email,
                password            : passwordDb,
                contact             : req.body.mobile


            });// end new user 

            newUser.save(function(err){
                if(err){

                    var myResponse = responseGenerator.generate(true,"email already exists in database",500,null);
                    res.send(myResponse);
                   

                }
                else{

                   var token = jwt.sign({user:newUser}, secret, { expiresIn : 60*30 });
                   var myResponse = responseGenerator.generate(false,"success",200,token);
                   res.send(myResponse);
                  
                }

            });//end new user save


        }
        else{

            var myResponse = {
                error: true,
                message: "Some body parameter is missing",
                status: 403,
                data: null
            };

            res.send(myResponse);

            

        }
        

    });//end get all users

//////////////////////////////////////////api to log in user///////////////////////////////////////

    userRouter.post('/login',auth.login,function(req,res){

        var passwordDb = crypto.encrypt(req.body.password,key);

        userModel.findOne({$and:[{'email':req.body.email},{'password':passwordDb}]},function(err,foundUser){
            if(err){
                var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
                res.send(myResponse);
            }
            else if(foundUser==null || foundUser==undefined || foundUser._id==undefined){

                var myResponse = responseGenerator.generate(true,"Incorrect Password. Please check again.",404,null);
                res.send(myResponse);

            }
            else{

                  // We are sending the profile inside the token
                  var token = jwt.sign({user:foundUser}, secret, { expiresIn : 30*60 });
                  var myResponse = responseGenerator.generate(false,"success",200,token);
                  res.send(myResponse);

            }

        });// end find


    });//end get signup screen




    // naming the router
    app.use('/api/v1/users', userRouter);

 
} //end contoller code
