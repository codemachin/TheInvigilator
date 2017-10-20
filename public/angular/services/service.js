myApp.service('testService', function($http){
	
	var baseUrl = "./api/v1"

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
		return $http.post(baseUrl+'/tests/create', data)
	}// api for creating tests

	this.testEdit = function (id,data){
		return $http.put(baseUrl+'/tests/'+id+'/edit', data)
	}// api for editing test

	this.questionCreate = function (data,id){
		return $http.post(baseUrl+'/tests/add/question/'+id, data)
	} // api to add a single question

	this.questionEdit = function (data,id,no){
		return $http.post(baseUrl+'/tests/edit/question/'+no+'/'+id, data)
	} // api to edit a particular question.

	this.deleteQuestion = function (id,data){
		return $http.post(baseUrl+'/tests/'+id+'/questiondelete', data)
	}// api to delete a particular question

	this.testDelete = function (id){
		return $http.post(baseUrl+'/tests/'+id+'/delete')
	}// api for deleting a test
	
	this.getAllQuestions = function(id){

		return $http.get(baseUrl+'/tests/'+id)

	} // api for getting a all questions of a test

	this.getAllTests = function(){

		return $http.get(baseUrl+'/tests/all')

	} // api for getting all tests

	this.getAllResults = function(id){

		return $http.get(baseUrl+'/tests/allResults/'+id)

	} // api for getting all the results for a user

	this.getResults = function(){

		return $http.get(baseUrl+'/tests/allMarks')

	} // api for getting all the results

	this.getTest = function(id){

		return $http.get(baseUrl+'/tests/'+id)

	} // api for getting a single test

	this.saveAns = function(data){

		return $http.post(baseUrl+'/liveTest/answerSave',data)

	}// api to save answer

	this.getResult = function(id){

		return $http.get(baseUrl+'/liveTest/'+id)

	}// api to get a particular result


	this.getLogin = function (data){
		return $http.post(baseUrl+'/users/login',data)
	} // api to login user

	this.forgot = function(id){

		return $http.post(baseUrl+'/forgot',id)

	} // api to request new password

	this.updatePass = function(id,data){

		return $http.post(baseUrl+'/reset/'+id,data)

	} //api to update new password on valid token

	this.postSignup = function(data){

		return $http.post(baseUrl+'/users/signup',data)

	} // api to signup new user with all necessary details

	this.passportLogin = function (){

		return $http.get(baseUrl+'/getProfile')

	} // api to log in to google or facebook account whichever requested

	this.getAllUsers = function(){

		return $http.get(baseUrl+'/users/all')

	} // api to get all users

	this.getUser = function(id){

		return $http.get(baseUrl+'/users/'+id)

	} //api to get a particular user

	
});