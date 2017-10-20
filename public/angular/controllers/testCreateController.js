myApp.controller('testCreateController',['$window','$http','$routeParams','testService',function($window,$http,$routeParams,testService) {

  //create a context
  var main = this;

  // checks if token is in sessionStorage and parses it
  if($window.sessionStorage.token){
    var encodedProfile = $window.sessionStorage.token.split('.')[1];
    this.profile = JSON.parse(testService.url_base64_decode(encodedProfile));
    // url_base64_decode function decodes the token stored in base 64 format

    // donot allow any one other than admin to access this page
    if(main.profile.user.email!="admin@admin.com"){
      alert("You are not authorised to view this page");
      $window.history.back();
    }
    
    if(main.profile.exp*1000<Date.now()){
      alert("Token expired. Login again to continue.")
      window.location='#/'
    }
  }else{
    alert("no token found. please login")
    window.location='#/'
  }// gets details from the jwt token an decodes it to get profile information

  this.name="";
  this.marksEach="";
  this.details="";
  this.totalQuestions="";
  this.time=null;
  
  // function for test creation
  this.create = function(){

  	var myData = {

            name: main.name,
            details: main.details,
            marksEach: main.marksEach,
            totalQuestions: main.totalQuestions,
            time: main.time

        }
   
      testService.testCreate(myData)
      .then(function successCallback(response) {
          
          if(response.data.status==401){
            alert(response.data.message)
            window.location="#/"
          }
          else if(response.data.status==200){
          	
            alert(response.data.message);

            // route to create questions on successfull test creation
            window.location="#/"+response.data.data._id+"/createQuestions"

          	

          } else {
          	alert(response.data.message)
          }
          
          

        }, function errorCallback(response) {
          
          alert("some error occurred. Check the console.");
          console.log(response);
        });


  }





}]); // end controller