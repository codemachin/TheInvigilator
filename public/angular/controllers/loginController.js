myApp.controller('loginController',['$window','$http','testService',function($window,$http,testService) {

  //create a context
  var main = this;
  

  this.login = function(){

    

  	var myData = {
            email: main.email,
            password: main.password

        }
   
      
      testService.getLogin(myData)
      .then(function successCallback(response) {
          
            if(response.data.status==200){

              // saving the token in sessionStorage and parsing the data
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
            } else {
            	alert(response.data.message)
            }
          
          

        }, function errorCallback(response) {
          
          alert("some error occurred. Check the console.");
          console.log(response);
        });


  }

  // check if user has logged in via facebook or google
  // if yes then send him to home
  var passportSubmit= function(){
    testService.passportLogin()
      .then(function successCallback(response) {
          
            if (response.data.error==false){

              $window.sessionStorage.token = response.data.data;
              return window.location = "#/home"


            }else if(response.data.status==404){

            }
            else{
              
              alert(response.data.message)

            }


        }, function errorCallback(response) {
          
            alert("some error occurred. Check the console.");
            console.log(response);
          
        });
      
  } // this function runs automatically to check if user has logged in through passport
    // if he has then it saves the token and logs user in

  passportSubmit();


}]); // end controller