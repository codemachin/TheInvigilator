myApp.controller('resetController',['$http','$routeParams','testService',function($http,$routeParams,testService) {

  var main = this;
  this.email="";
  this.pass="";
  this.pass1="";
  

  this.forgotMail = function(id){
    var data={
      email:id
    }
    testService.forgot(data)
      .then(function successCallback(response) {
            
            if(response.data.loginStatus==false){
                window.location="#/"
            }
            else if(response.data.status==200){
              alert(response.data.message);

            } else {
              alert(response.data.message)
            }
          
          

        }, function errorCallback(response) {
          
          alert("some error occurred. Check the console.");
          console.log(response);

        });
  }// function to request forgot password and send the email details

   
  var token = $routeParams.token;
  this.updatePass = function(){

    var data={
      password:main.pass
    }
    if(main.pass1!=main.pass){
        return alert("Passwords entered do not match")
    }

    if(main.pass.length<6){
        return alert("Password too short. Minimum 6 characters required")
    }

    testService.updatePass(token,data)
      .then(function successCallback(response) {
            
            if(response.data.verifying==false){
                window.location="#/"
            }
            else if(response.data.status==200){
              alert(response.data.message);
              window.location="#/"

            } else {
              alert(response.data.message)
            }
            
          

        }, function errorCallback(response) {
          
            alert("some error occurred. Check the console.");
            console.log(response);

        });
      

  }// function to post new password , if reset token is valid and not expired.





}]); // end controller