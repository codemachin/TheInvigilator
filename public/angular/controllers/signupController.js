myApp.controller('signupController',['$window','$http','$routeParams','testService',function($window,$http,$routeParams,testService) {

  var main = this;
  this.email="";
  this.firstName="";
  this.lastName="";
  this.password1="";
  this.password="";
  this.mobile="";
  
  

  this.signup = function(){

    var myData = {

            firstName: main.firstName,
            lastName: main.lastName,
            email: main.email,
            password: main.password,
            mobile : main.mobile

        }
    if(main.password1==main.password){
      testService.postSignup(myData)
        .then(function successCallback(response) {

            if(response.data.status==200){
              $window.sessionStorage.token = response.data.data;
              window.location = "#/home"
            
            }else{
              alert(response.data.message)
            }
                        

        }, function errorCallback(response) {
          
          alert("some error occurred. Check the console.");
          console.log(response);

        });
    }else{
    alert("passwords don't match!!!")
    }


  }// function to post all user details for successful signup




}]); // end controller