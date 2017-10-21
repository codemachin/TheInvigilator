var mongoose = require('mongoose');
var express = require('express');

var jwt = require('jsonwebtoken'); 
var expressJwt = require('express-jwt'); 
// express router // used to define routes
var secret = require("./../../libs/jwtSecret").secret;
// express router // used to define routes 
var testRouter  = express.Router();
var testModel = mongoose.model('Test')
var answerModel = mongoose.model('Answer')
var responseGenerator = require('./../../libs/responseGenerator');
var getDetails = require('./../../libs/getDetails');


module.exports.liveControllerFunction = function(app,server) {

    /////////////////////////////////////// setting the express js middleware //////////////////////////////////////
    testRouter.use('/', expressJwt({secret: secret}));

    var io = require('socket.io')(server);

    ///////////////////////////////////////// socket connection event /////////////////////////////////////////////
    io.on('connection', function (socket) {

        // listens for event when user starts the test on client side
        socket.on("startServerTimer",function(data) {

            var dy= new Date();
            // emits the server time to the client
            socket.emit("startedTime",{time:dy.getTime()})

            // emits time up event to stop the test
            setTimeout(function() {
                
                socket.emit('stop test')

            }, data * 60 * 1000)
            
            var count = 0;

            // send server time for the client to tally if the test timer is running correctly
            // and its not been tampered or hacked
            var interval = setInterval(function(){

                count = count+5;
                var d= new Date();
                socket.emit("serverTime",{time:d.getTime()})

                if(count>=data*60){
                    clearInterval(interval)
                }
            },5000)
        });

        // ends the socket connection when the live test route is changed client side
        socket.on('end connection', function() {
            socket.disconnect();


        })
        // disconnect if socket is closed
        socket.on('disconnect', function() {
            console.log('successfully disconnected')

        })
        

    });

////////////////////////////////////////////// end socket event ////////////////////////////////////////////////

   
//////////////////////////////////////// api for getting a specific answermodel ////////////////////////////////////////

    testRouter.get('/:id',function(req,res){
      

        answerModel.findOne({'_id':req.params.id},function(err,foundtest){
            if(err){
                var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
                res.send(myResponse);
            }
            else if(foundtest==null || foundtest==undefined || foundtest._id==undefined){

                var myResponse = responseGenerator.generate(true,"test not found",404,null);
                res.send(myResponse);
                

            }
            else{

                var myResponse = responseGenerator.generate(false,"successfully retrieved",200,foundtest);
                res.send(myResponse);


            }

        });// end find
      

    });//end get all products


    ////////////////////////////////// api for saving the answers when test is over //////////////////////////////

    testRouter.post('/answerSave',function(req,res){

        rightAnswer = [];

        getDetails.getTestDetails( req.body.id, function(returnData) {
            
            for(var x =0;x<returnData.questions.length;x++){
                rightAnswer.push(returnData.questions[x].answer);
            }
        

            if(rightAnswer.length>0){

                var newAnswer = new answerModel({
                    userId: req.user.user._id,
                    testId: req.body.id,
                    userAnswer: req.body.userAnswer,
                    rightAnswer: rightAnswer,
                    timeTaken  :req.body.timeTaken



                });// end new answer

                newAnswer.save(function(err){
                    if(err){

                         var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
                         res.send(myResponse);
                         

                    }
                    else{


                       var myResponse = responseGenerator.generate(false,"test successfully created",200,newAnswer);
                       res.send(myResponse);
                    
                      
                    }

                });//end new answer save


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
        });
        

    });



    //////////////////////////////////// naming the router //////////////////////////////////////
     
    app.use('/api/v1/liveTest', testRouter);



 
} //end contoller code
