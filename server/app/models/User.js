var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({

  firstName : {type:String,default:"",required:true},
  lastName : {type:String,default:"",required:true},
  email : {type:String,default:"",required:true,index:true,unique:true},
  password : {type:String,default:""},
  contact : {type:String,default:""},
  address : {type:String,default:""},
  city : {type:String,default:""},
  state : {type:String,default:""},
  country : {type:String,default:""},
  pinCode : {type:String,default:""},
  resetPasswordToken: {type:String,default:""},
  resetPasswordExpires: {type:Date},
  created : {type:Date,default:Date.now},
  updated : {type:Date,default:Date.now}

});

mongoose.model('User',userSchema);