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
	}

	this.testEdit = function (id,data){
		return $http.put('./tests/'+id+'/edit', data)
	}

	this.questionCreate = function (data,id){
		return $http.post('./tests/add/question/'+id, data)
	} 

	this.questionEdit = function (data,id,no){
		return $http.post('./tests/edit/question/'+no+'/'+id, data)
	}

	this.deleteQuestion = function (id,data){
		return $http.post('./tests/'+id+'/questiondelete', data)
	}

	this.testDelete = function (id){
		return $http.post('./tests/'+id+'/delete')
	}
	
	this.getAllQuestions = function(id){

		return $http.get('./tests/'+id)

	} 

	this.getAllTests = function(){

		return $http.get('./tests/all')

	} 

	this.getAllResults = function(id){

		return $http.get('./tests/allResults/'+id)

	} 

	this.getResults = function(){

		return $http.get('./tests/allMarks')

	} 

	this.getTest = function(id){

		return $http.get('./tests/'+id)

	} 

	this.saveAns = function(data){

		return $http.post('./liveTest/answerSave',data)

	}

	this.getResult = function(id){

		return $http.get('./liveTest/'+id)

	}


	this.getLogin = function (data){
		return $http.post('./api/v1/users/login',data)
	} 

	this.forgot = function(id){

		return $http.post('./api/v1/forgot',id)

	} 

	this.updatePass = function(id,data){

		return $http.post('./api/v1/reset/'+id,data)

	} 

	this.postSignup = function(data){

		return $http.post('./api/v1/users/signup',data)

	} 

	this.passportLogin = function (){

		return $http.get('./api/v1/getProfile')

	} 

	this.getAllUsers = function(){

		return $http.get('./api/v1/users/all')

	} 

	this.getUser = function(id){

		return $http.get('./api/v1/users/'+id)

	} 

	
});