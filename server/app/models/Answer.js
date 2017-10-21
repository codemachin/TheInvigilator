
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var answer = new Schema({
                    answer : {type:String},
                    timeEach : {type:Number,default:0}
});

var answerSchema = new Schema({
                    userId: { type: String, required:true},
                    testId: { type: String, required:true },
                    userAnswer: [answer],
                    rightAnswer: [],
                    timeTaken  :{type:String, required:true},
                    date :{type:String,default:Date.now}
});

mongoose.model('Answer',answerSchema);