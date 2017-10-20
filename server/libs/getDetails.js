var mongoose = require('mongoose');
var testModel = mongoose.model('Test');
var userModel = mongoose.model('User');

exports.getTestDetails = function( id, callback) {
    testModel.findOne({'_id': id},function(err,result){
        if(err){
            console.log(err)
        }else{
                   
            callback(result)
        }
    })
};// function gets the firstName associated with a particular email address

exports.getUserDetails = function( email, callback) {
    userModel.findOne({'email': email},function(err,result){
        if(err){
            console.log(err)
        }else{            
            callback(result)
        }
    })
};// function gets the firstName associated with a particular email address