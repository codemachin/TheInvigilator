var responseGenerator = require('../libs/responseGenerator');
var getDetails = require('../libs/getDetails');


// middleware for checking login form
exports.login = function (req, res, next) {

    if (!req.body.email || !req.body.password) {
        var myResponse = responseGenerator.generate(true,"Please enter both email and password",403,null);
        res.send(myResponse);
    }else if (req.body.email && req.body.password){
    	getDetails.getUserDetails( req.body.email, function(returnData) {
    		if(!returnData){
    			var myResponse = responseGenerator.generate(true,"No account with that email present. Please signup to continue.",403,null);
        		res.send(myResponse);
    		}else{
    			next();
    		}
    	});
    }else{
        next();
    }
}

