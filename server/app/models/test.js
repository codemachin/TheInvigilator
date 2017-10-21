
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var question = new Schema({
                    question: { type: String, required:true},
                    optionA: { type: String, required:true },
                    optionB: { type: String, required:true},
                    optionC: { type: String, required:true },
                    optionD: { type: String, required:true},
                    answer : {type:String, required:true}
});

var testSchema = new Schema({
      name: {type: String, required: true,index:true,unique:true},
      questions: [question],
      details: {type: String},
      marksEach: {type: Number,default: 5,required: true},
      totalQuestions: {type: Number,default: 10},
      takenBy: [],
      time: {type: Number,default: 30}

})

mongoose.model('Test',testSchema);