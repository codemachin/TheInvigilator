myApp.service('testService', function($http){
	
	//this is used to parse the token in base64 format to user details
	this.url_base64_decode = function (str) {
	  var output = str.replace('-', '+').replace('_', '/');
	  switch (output.length % 4) {
	    case 0:
	      break;
	    case 2:
	      output += '==';
	      break;
	    case 3:
	      output += '=';
	      break;
	    default:
	      throw 'Illegal base64url string!';
	  }
	  return window.atob(output); //polifyll https://github.com/davidchambers/Base64.js
	}
	


	this.testCreate = function (data){
		return $http.post('./tests/create', data)
	} // end delete blog

	this.testEdit = function (id,data){
		return $http.put('./tests/'+id+'/edit', data)
	} // end delete blog

	this.questionCreate = function (data,id){
		return $http.post('./tests/add/question/'+id, data)
	} // end delete blog

	this.questionEdit = function (data,id,no){
		return $http.post('./tests/edit/question/'+no+'/'+id, data)
	} // end delete blog

	this.deleteQuestion = function (id,data){
		return $http.post('./tests/'+id+'/questiondelete', data)
	} // end create blog

	this.testDelete = function (id){
		return $http.post('./tests/'+id+'/delete')
	} // end create blog
	
	this.getAllQuestions = function(id){

		return $http.get('./tests/'+id)

	} //end get all blogs

	this.getAllTests = function(){

		return $http.get('./tests/all')

	} //end get all blogs

	this.getAllResults = function(id){

		return $http.get('./tests/allResults/'+id)

	} //end get all blogs

	this.getResults = function(){

		return $http.get('./tests/allMarks')

	} //end get all blogs

	this.getTest = function(id){

		return $http.get('./tests/'+id)

	} //end get all blogs

	this.saveAns = function(data){

		return $http.post('./liveTest/answerSave',data)

	} //end get all blogs

	this.getResult = function(id){

		return $http.get('./liveTest/'+id)

	} //end get all blogs


	this.getLogin = function (data){
		return $http.post('./api/v1/users/login',data)
	} // end delete blog

	this.forgot = function(id){

		return $http.post('./api/v1/forgot',id)

	} // api to request new password

	this.updatePass = function(id,data){

		return $http.post('./api/v1/reset/'+id,data)

	} // api to update new password on valid token

	this.postSignup = function(data){

		return $http.post('./api/v1/users/signup',data)

	} //end get all blogs

	this.passportLogin = function (){

		return $http.get('./api/v1/getProfile')

	} // api to log in to google or facebook account whichever requested

	this.getAllUsers = function(){

		return $http.get('./api/v1/users/all')

	} //end get all blogs

	this.getUser = function(id){

		return $http.get('./api/v1/users/'+id)

	} //end get all blogs

	
});