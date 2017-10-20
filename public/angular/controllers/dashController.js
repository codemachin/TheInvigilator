myApp.controller('dashController',['$window','$http','$routeParams','testService',function($window,$http,$routeParams,testService) {

  // declaring variables
  var main = this;
  this.analytics = [];
  this.marksAll = [];
  this.testHelper = [];
  this.correct = 0;

  // checks if token is in sessionStorage and parses it
  if($window.sessionStorage.token){
    var encodedProfile = $window.sessionStorage.token.split('.')[1];
    this.profile = JSON.parse(testService.url_base64_decode(encodedProfile));
    // url_base64_decode function decodes the token stored in base 64 format

    if(main.profile.user.email!="admin@admin.com"){
      // preventing users other than admin to get access to dashboard
      alert("You are not authorised to view this page");
      $window.history.back();
    }
    
  }else{
    alert("no token found. please login")
    window.location='#/'
  }// gets details from the jwt token an decodes it to get profile information

  // gets all the users to show user details to the admin
  this.allUsers = function(){
    testService.getAllUsers()
    .then(function successCallback(response) {
          
          if(response.data.status==401){
            alert(response.data.message)
            window.location="#/"
          }
          else if(response.data.status==200){
            main.users= response.data.data;
            // fetch all the result for analysing data for each user
            main.allResults();

          } else {
            alert(response.data.message)
          }
          
          

        }, function errorCallback(response) {
          
          alert("some error occurred. Check the console.");
          console.log(response);
        });
  }

  // function call to get all users
  if($window.sessionStorage.token){
    this.allUsers();
  }

  // function to get all results
  this.allResults = function(){

    testService.getResults()
    .then(function successCallback(response) {
          
          if(response.data.status==401){
            alert(response.data.message)
            window.location="#/"
          }
          else if(response.data.status==200){
            main.results= response.data.data;

            // calculating the scores of all test for all user
            // and save them with the respective user
            for(var x in main.users){
              main.marksAll.push({user: main.users[x],scores:[],avg:0})
              for(var y in main.results){
                if(main.users[x]._id==main.results[y].userId){

                  for(var z in main.results[y].rightAnswer){
                    if(main.results[y].userAnswer[z]){
                      if(main.results[y].rightAnswer[z]==main.results[y].userAnswer[z].answer){
                        main.correct +=1;
                      }
                    }
                  }

                  main.marksAll[x].scores.push({
                    percentage : (main.correct/main.results[y].rightAnswer.length)*100,
                    name : main.users[x].firstName,
                    testId : main.results[y].testId,
                    resultId : main.results[y]._id
                  })
                  main.marksAll[x].avg += (main.correct/main.results[y].rightAnswer.length)*100;
                  main.correct = 0;
                }
              }
              // calculating the average score percentage
              if(main.marksAll[x].scores.length>0){
                  main.marksAll[x].avg = Math.round((main.marksAll[x].avg/main.marksAll[x].scores.length)*100)/100;
              }
            }
            // get all the test for analysis and generating details for eaach test
            main.allTests();
            
          } else {
            alert(response.data.message)
          }
          
          

        }, function errorCallback(response) {
          
          alert("some error occurred. Check the console.");
          console.log(response);
        });
  }

  // gets all the test details for generating analysis for each test
  this.allTests = function(){
    testService.getAllTests()
    .then(function successCallback(response) {
          
          if(response.data.status==401){
            alert(response.data.message)
            window.location="#/"
          }
          else if(response.data.status==200){
            main.tests= response.data.data;
            // saves all percentages and user details for all tests
            // and save to testHelper array
            for(var x in main.tests){
              main.testHelper.push({name:main.tests[x].name,scores:[]})
              for(var y in main.marksAll){
                for(var z in main.marksAll[y].scores){
                  if(main.tests[x]._id==main.marksAll[y].scores[z].testId){
                    main.testHelper[x].scores.push({
                      percentage : main.marksAll[y].scores[z].percentage,
                      name : main.marksAll[y].user.firstName,
                      userId : main.marksAll[y].user._id,
                      resultId : main.marksAll[y].scores[z].resultId
                    })
                  }
                }
              }
            }
            

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