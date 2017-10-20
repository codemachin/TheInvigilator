myApp.controller('allTestController',['$window','$http','$routeParams','testService',function($window,$http,$routeParams,testService) {

  var main = this;
  
  // checks if token is in sessionStorage and parses it
  if($window.sessionStorage.token){
    var encodedProfile = $window.sessionStorage.token.split('.')[1];
    this.profile = JSON.parse(testService.url_base64_decode(encodedProfile));
    // url_base64_decode function decodes the token stored in base 64 format

    // checks which location is accessed
    // if manage test is accessed by someone who is not admin, unauthorise him
    if(window.location.href==window.location.origin+"/#/manageTest" && main.profile.user.email!="admin@admin.com"){
      alert("You are not authorised to view this page");
      $window.history.back();
    }
    // checks which location is accessed
    // if takeatest is accessed then dont allow admin to go forward as he only has created the test
    if(window.location.href==window.location.origin+"/#/takeatest" && main.profile.user.email=="admin@admin.com"){
      alert("Admin cannot take a test as he has created all questions and can view them anytime the admin needs to.");
      $window.history.back();
    }

  }else{
    alert("no token found. please login")
    window.location='#/'
  }// gets details from the jwt token an decodes it to get profile information

  this.cArray = [];
  
  // gets all the tests that had been created
  this.allTests = function(){

  	testService.getAllTests()
    .then(function successCallback(response) {
          
          if(response.data.status==401){
            alert(response.data.message)
          	window.location="#/"
          }
          else if(response.data.status==200){
          	main.items= response.data;
            //then this function gets all the results
            // so that it can prevent any test to be given more than thrice
            main.allResults(main.profile.user._id);

            // reverse the test array so that the latest test is shown at the first
          	main.items.data.reverse();

          } else {
          	alert(response.data.message)
          }
          
          

        }, function errorCallback(response) {
          
          alert("some error occurred. Check the console.");
          console.log(response);
        });
  }

  // gets all the tests
  if($window.sessionStorage.token){ 
    this.allTests();
  }

  // get all tests specific to the particular person
  this.allResults = function(param){

    testService.getAllResults(param)
    .then(function successCallback(response) {
          
          if(response.data.status==401){
            alert(response.data.message)
            window.location="#/"
          }
          else if(response.data.status==200){

            main.results = response.data.data;

            // loop for counting the total no of tests the user has given
            // for preventing the user to give more than 3 tests
            for(var x in main.items.data){
              var count = 0;
              for(var y in main.results){
                if(main.items.data[x]._id==main.results[y].testId){
                  count++;
                }
              }
              // pushing the data in the same sequence as the test array
              main.cArray.push(count)
            }

          } else {
            alert(response.data.message)
          }
          
          

        }, function errorCallback(response) {
          
          alert("some error occurred. Check the console.");
          console.log(response);
        });
  }

  // for deleting any test if user is an admin
  this.delete = function(id,index){

    testService.testDelete(id)
    .then(function successCallback(response) {
        
        if(response.data.status==401){
          alert(response.data.message)
          window.location="#/"
        }
        else if(response.data.status==200){
          alert(response.data.message);
          // removing the test from the test array for faster delete
          main.items.data.splice(index,1)

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