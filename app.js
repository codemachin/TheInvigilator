var express = require('express');
var app = express();
var server = require('http').createServer(app);
var mongoose = require('mongoose');
var logger = require('morgan');
var bodyParser = require('body-parser');
var responseGenerator = require('./server/libs/responseGenerator');
var passport = require('passport');
// path is used the get the path of our files on the computer
var path = require ('path');

app.use(logger('dev'));
app.use(bodyParser.json({limit:'10mb',extended:true}));
app.use(bodyParser.urlencoded({limit:'10mb',extended:true}));

// initialising the passportjs middlewares . It contains the google and facebook strategy configurations

require('./server/middlewares/passport').passportMiddleware(passport,app);

//set the views folder to html page in views folder


app.use('/',express.static(__dirname + '/public'));


var dbPath  = "mongodb://localhost/myTestSystem";

// command to connect with database
db = mongoose.connect(dbPath);

mongoose.connection.once('open', function() {

	console.log("database connection open success");

});



// fs module, by default module for file management in nodejs
var fs = require('fs');

// include all our model files
fs.readdirSync('./server/app/models').forEach(function(file){
	// check if the file is js or not
	if(file.indexOf('.js'))
		// if it is js then include the file from that folder into our express app using require
		require('./server/app/models/'+file);

});// end for each

// include controllers
fs.readdirSync('./server/app/controllers').forEach(function(file){
	if(file.indexOf('.js')){
		// include a file as a route variable
		var route = require('./server/app/controllers/'+file);
		//call controller function of each file and pass your app instance to it
    if(route.controllerFunction){
      route.controllerFunction(app)
    }else if(route.passportControllerFunction){
      route.passportControllerFunction(app,passport)
    }else if(route.liveControllerFunction){
		  route.liveControllerFunction(app,server)
    }

	}

});//end for each

//////////////////////////////// error handling token expired error ///////////////////////////////

app.use(function(err, req, res, next){
  if (err.constructor.name === 'UnauthorizedError') {
    req.session.destroy();
    var myResponse = responseGenerator.generate(true,"Unauthorised access. Token expired, please login again",401,null);
    res.send(myResponse);
  }
});

/////////////////////////////// error handling illegal routes /////////////////////////////////////

app.use(function(req, res) {
   
  res.status(404).send("You hit an incorrect path. Check again");
    
}); 

server.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});