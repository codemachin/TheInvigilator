myApp.controller('signupController',['$window','$http','$routeParams','testService',function($window,$http,$routeParams,testService) {

  var main = this;
  this.email="";
  this.firstName="";
  this.lastName="";
  this.password1="";
  this.password="";
  this.mobile="";
  
  

  this.signup = function(){

    if (!main.firstName || !main.lastName || !main.email || !main.password || !main.mobile) {
      return alert("Please enter complete information");
    }else if(main.password.length<6){
      return alert("Minimum password length must be 6")
    }else if(main.firstName==main.lastName){
      return alert("firstName and lastName cannot be the same. Please check again.")
    }else if(main.mobile.toString().length<6){
      return alert("Mobile number cannot be less than 6 digits")
    }

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
              var encodedProfile = $window.sessionStorage.token.split('.')[1];
              this.profile = JSON.parse(testService.url_base64_decode(encodedProfile));
              // url_base64_decode function decodes the token stored in base 64 format

              // routing user to dashboard if he is admin
              // else send user to home
              if(profile.user.email=="admin@admin.com"){
                window.location = '#/dashboard'
              }else{
                  window.location = "#/home"
                }
            
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