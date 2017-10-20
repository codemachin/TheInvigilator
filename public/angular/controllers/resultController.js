myApp.controller('resultController',['$window','$http','$routeParams','testService',function($window,$http,$routeParams,testService) {

  //create a context
  var main = this;
  this.id = $routeParams.id;
  this.totalCorrect=0;

  // checks if token is in sessionStorage and parses it
  if($window.sessionStorage.token){
    var encodedProfile = $window.sessionStorage.token.split('.')[1];
    this.profile = JSON.parse(testService.url_base64_decode(encodedProfile));
    // url_base64_decode function decodes the token stored in base 64 format

  }else{
    alert("no token found. please login")
    window.location='#/'
  }// gets details from the jwt token an decodes it to get profile information

  this.result = function(){

  	testService.getResult(main.id)
    .then(function successCallback(response) {
          
          if(response.data.status==401){
            alert(response.data.message)
            window.location="#/"
          }
          else if(response.data.status==200){
          	main.result= response.data.data;

            // get the user details of the result
            main.getUser(main.result.userId);

            // get the test details of the result
            main.getTest(main.result.testId);

            // calculate the number of correct and wrong answers
            angular.forEach(main.result.userAnswer, function(value, key){
                if(value.answer==main.result.rightAnswer[key]){
                  main.totalCorrect +=1;
                }
            });


          } else {
          	alert(response.data.message)
          }
          
          

        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          alert("some error occurred. Check the console.");
          console.log(response);
        });
  }

  if($window.sessionStorage.token){
    this.result();
  }

  // gets the specific test details
  this.getTest = function(id){

    testService.getTest(id)
    .then(function successCallback(response) {
          
          if(response.data.status==401){
            alert(response.data.message)
            window.location="#/"
          }
          else if(response.data.status==200){

            main.test= response.data.data;


          } else {
            alert(response.data.message)
          }
          
          

        }, function errorCallback(response) {
          
          alert("some error occurred. Check the console.");
          console.log(response);
        });
  }

  // get the user whose result is being fetched
  this.getUser = function(id){

    testService.getUser(id)
    .then(function successCallback(response) {
          // this callback will be called asynchronously
          // when the response is available
          if(response.data.status==401){
            alert(response.data.message)
            window.location="#/"
          }
          else if(response.data.status==200){

            main.user= response.data.data;


          } else {
            alert(response.data.message)
          }
          
          

        }, function errorCallback(response) {
          
          alert("some error occurred. Check the console.");
          console.log(response);
        });
  }

  this.logout = function () {
    
    delete $window.sessionStorage.token;
    window.location="#/"
    
  };// deletes the token on user logout



}]); // end controller