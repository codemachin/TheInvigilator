myApp.controller('allResultController',['$window','$http','$routeParams','testService',function($window,$http,$routeParams,testService) {

  var main = this;

  if($window.sessionStorage.token){
    var encodedProfile = $window.sessionStorage.token.split('.')[1];
    this.profile = JSON.parse(testService.url_base64_decode(encodedProfile));
    // url_base64_decode decodes the token stored in localstorage in base 64 format
    
    this.email = main.profile.user.email
    
  }else{
    alert("no token found. please login")
    window.location='#/'
  }// gets details from the jwt token an decodes it to get profile information

  this.testArray = [];
  this.loaded = false;
  this.sortvar = "-date"


  // used for sorting by date
  this.sort = function(){
    if(main.sortvar=="-date"){
      main.sortvar="date"
    }else{
      main.sortvar="-date"
    }
  }

  this.testSorter = "";

  // used for the select tag for sort by test name
  this.testFilter = function(){
    if(main.search=="All"){
      main.testSorter = ""
    }else{
      main.testSorter = main.search;
    }
  } 
  
  
  // function is used to get all results if user is admin
  // or gets all results given by a particular user (not admin)
  this.allResults = function(param){

    if(param == "admin"){
      // fun stores function to get all results if user is admin
      var fun = testService.getResults()
    }else{
      // fun stores function to get all results of a particular user if user is not admin
      var fun = testService.getAllResults(param)
    }
    fun
    .then(function successCallback(response) {
          
          if(response.data.status==401){
            alert(response.data.message)
          	window.location="#/"
          }
          else if(response.data.status==200){

          	main.items= response.data.data;
            // call getTest functions only after all results are fetched for analysing the results
            main.getTest();

          } else {
          	alert(response.data.message)
          }
          
          

        }, function errorCallback(response) {
          
          alert("some error occurred. Check the console.");
          console.log(response);
        });
  }

  if($window.sessionStorage.token){
    if(main.email=="admin@admin.com"){
      this.allResults("admin");
      // if user is admin then get all results
    }else{
      // if user is not admin then fetch his particular results
      this.allResults(main.profile.user._id);
    }
  }


  // this function gets all the test for getting the test details for the specific results
  this.getTest = function(){

    testService.getAllTests()
    .then(function successCallback(response) {
          
          if(response.data.status==401){
            alert(response.data.message)
            window.location="#/"
          }
          else if(response.data.status==200){

            main.tests= response.data.data;
            // loop for comparing and storing all the necessary test details for a specific result
            for(var x in main.items){
              for(var y in main.tests){
                if(main.items[x].testId==main.tests[y]._id){
                  main.testArray.push({
                    name:main.tests[y].name,
                    id:main.items[x]._id,
                    date:main.items[x].date,
                    testId:main.items[x].testId,
                    userId:main.items[x].userId,
                    userName:""
                  });

                }
              }
            }
            main.loaded = true;

            main.allUsers();

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

  // this function then checks whick user gave the tests for kknowlodge of the admin
  this.allUsers = function(){
    testService.getAllUsers()
    .then(function successCallback(response) {
          
          if(response.data.status==401){
            alert(response.data.message)
            window.location="#/"
          }
          else if(response.data.status==200){
            main.users= response.data.data;
            // stores the user who gave the test in the test array
            for(var x in main.testArray){
              for(var y in main.users){
                if(main.testArray[x].userId==main.users[y]._id){
                  main.testArray[x].userName=main.users[y].firstName
                }
              }
            }

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

  // logout function that deletes the token from sessionStorage and sends user to login page
  this.logout = function () {
    
    delete $window.sessionStorage.token;
    window.location="#/"
    
  };// deletes the token on user logout


}]); // end controller