myApp.controller('testEditController',['$window','$http','$routeParams','testService',function($window,$http,$routeParams,testService) {

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
    
  }else{
    alert("no token found. please login")
    window.location='#/'
  }// gets details from the jwt token an decodes it to get profile information

  this.id = $routeParams.id;

  // get the test details which is being edited
  this.getTest = function(){

    testService.getTest(main.id)
    .then(function successCallback(response) {
          
          if(response.data.status==401){
            alert(response.data.message)
            window.location="#/"
          }
          else if(response.data.status==200){

            main.items= response.data.data;


          } else {
            alert(response.data.message)
          }
          
          

        }, function errorCallback(response) {
          
          alert("some error occurred. Check the console.");
          console.log(response);
        });
    }

  if($window.sessionStorage.token){
    this.getTest();
  }

  
  // function to edit the test
  this.edit = function(){

  	var myData = {

            name: main.items.name,
            details: main.items.details,
            marksEach: main.items.marksEach,
            totalQuestions: main.items.totalQuestions,
            time: main.items.time

        }
   
      testService.testEdit(main.id,myData)
      .then(function successCallback(response) {
          
          if(response.data.status==401){
            alert(response.data.message)
            window.location="#/"
          }
          else if(response.data.status==200){
          	
            alert(response.data.message);

            // after editing location route to create Questions page
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