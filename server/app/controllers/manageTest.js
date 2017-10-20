var mongoose = require('mongoose');
var express = require('express');

var jwt = require('jsonwebtoken'); 
var expressJwt = require('express-jwt'); 
// express router // used to define routes
var secret = require("./../../libs/jwtSecret").secret; 
var testRouter  = express.Router();
var testModel = mongoose.model('Test')
var answerModel = mongoose.model('Answer')
var responseGenerator = require('./../../libs/responseGenerator');


module.exports.controllerFunction = function(app) {

   
 //////////////////////////////////// get all answers specific to any user from the database ////////////////////////////////////   

    testRouter.use('/', expressJwt({secret: secret}));

    testRouter.get('/allResults/:id',function(req,res){
        answerModel.find({userId:req.params.id},function(err,alltests){
            if(err){                
                var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
                res.send(myResponse);
            }
            else{

                var myResponse = responseGenerator.generate(false,"successfully retrieved",200,alltests);
                res.send(myResponse);

            }

        });

    });

//////////////////////////////////// get all answers from the database ////////////////////////////////////

    testRouter.get('/allMarks/',function(req,res){
        answerModel.find({},function(err,alltests){
            if(err){                
                var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
                res.send(myResponse);
            }
            else{

                var myResponse = responseGenerator.generate(false,"successfully retrieved",200,alltests);
                res.send(myResponse);

            }

        });

    });


//////////////////////////////////////////// get all tests from the database /////////////////////////////////////////

    testRouter.get('/all',function(req,res){
        testModel.find({},function(err,alltests){
            if(err){                
                var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
                res.send(myResponse);
            }
            else{

                var myResponse = responseGenerator.generate(false,"successfully retrieved",200,alltests);
                res.send(myResponse);

            }

        });

    });

///////////////////////////////get specific product , secured api////////////////////////////////

    testRouter.get('/:id',function(req,res){
      

        testModel.findOne({'_id':req.params.id},function(err,foundtest){
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
      

    });

    

 //////////////////////////////////////////// api for editing a specific test //////////////////////////////////////////   

    testRouter.put('/:id/edit',function(req,res) {

        var update = req.body;

        testModel.findOneAndUpdate({'_id':req.params.id},update,function(err,result){

            if(err){
                var myResponse = responseGenerator.generate(true,err,404,null);
                res.send(myResponse);
            }
            else{
                var myResponse = responseGenerator.generate(false,"test successfully edited",200,result);
                res.send(myResponse);
            }


        }); 

    });


    /////////////////////////////////////////// api for deleting a specific test ////////////////////////////////////////

    testRouter.post('/:id/delete',function(req,res) {

      testModel.remove({'_id':req.params.id},function(err,result){

        if(err){
          console.log('some error');
          console.log(err);
          var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
          res.send(myResponse);

        }
        else{
          var myResponse = responseGenerator.generate(false,"test deleted successfully",200,result);
          res.send(myResponse);
        }


      });

    });


    //////////////////////////////////////////// api for creating a test ///////////////////////////////////////////

    testRouter.post('/create',function(req,res){

        if(req.body.name!=undefined && req.body.marksEach!=undefined && req.body.totalQuestions!=undefined && req.body.time!=undefined){

            var newtest = new testModel({
                name             : req.body.name,
                details          : req.body.details,
                marksEach        : req.body.marksEach,
                totalQuestions   : req.body.totalQuestions,
                time             : req.body.time



            });// end new product 

            newtest.save(function(err){
                if(err){

                     var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
                     res.send(myResponse);
                     

                }
                else{


                   var myResponse = responseGenerator.generate(false,"test successfully created",200,newtest);
                   res.send(myResponse);
                
                  
                }

            });//end new test save


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


    /////////////////////////////////////////// api for deleting a specific question ///////////////////////////////////

    testRouter.post('/:id/questiondelete',function(req,res) {
        

        
        testModel.findOneAndUpdate({'_id':req.body.testId},{
            '$pull':{questions:{_id:req.params.id}}
        },{new:true},
            function(err,result){

                if(err){
                    var myResponse = responseGenerator.generate(true,"some error "+err,500,null);
                    res.send(myResponse);
                }
                else{
                    var myResponse = responseGenerator.generate(false,"success",200,result);
                    res.send(myResponse);

                }


            });

    });

    ////////////////////////////////////////// api for editing a specific question /////////////////////////////////////

    testRouter.post('/edit/question/:no/:id',function(req,res){
    // here no is the index of the question to delete and id is the test id   

        testModel.findOne({'_id': req.params.id},function(err,result){
            if(err){

                        var myResponse = responseGenerator.generate(true,"some error "+err,500,null);
                        res.send(myResponse);  

                    }
                    else{

                        result.questions[req.params.no] = req.body;

                        result.save(function(err){
                            if(err){

                                 var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
                                 res.send(myResponse);
                                 
                            }
                            else{                               
                               
                                var myResponse = responseGenerator.generate(false,"success",200,result);
                                res.send(myResponse);
                            
                              
                            }
                          
                       
                        })

                    }

        });
    })


    /////////////////////////////////////////// api to add a question to the test model ////////////////////////////////////

    testRouter.post('/add/question/:id',function(req,res){
        

        var question =  {
                            question: req.body.question,
                            optionA: req.body.optionA,
                            optionB: req.body.optionB,
                            optionC: req.body.optionC,
                            optionD: req.body.optionD,
                            answer : req.body.answer

                        };

        testModel.findOneAndUpdate({'_id': req.params.id},{
            '$push':{questions: question }
        },{new: true},
                function(err,result){
                    if(err){

                        var myResponse = responseGenerator.generate(true,"some error "+err,500,null);
                        res.send(myResponse);  

                    }
                    else{

                       var myResponse = responseGenerator.generate(false,"Question added successfully",200,result);
                       res.send(myResponse);   
                       
                    }

                });
    })




    // naming the router
    app.use('/api/v1/tests', testRouter);



 
} //end contoller code
