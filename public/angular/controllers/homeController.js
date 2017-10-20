myApp.controller('homeController',['$window','$filter','$http','$routeParams','testService','chart','$scope',function($window,$filter,$http,$routeParams,testService,chart,$scope) {
  
  var main=this;

  // declaring the variables
  this.marksAll = [];
  this.chartPer = [];
  this.dateOfTest = [];
  this.testArray = [];
  this.correct = 0;
  this.show = "loading";
  var id = $routeParams.id;

  // setting math variable to scope variable so that it can be accessed from the html
  $scope.Math = window.Math;

  // checks if token is in sessionStorage and parses it
  if($window.sessionStorage.token){
    var encodedProfile = $window.sessionStorage.token.split('.')[1];
    this.profile = JSON.parse(testService.url_base64_decode(encodedProfile));
    this.email = this.profile.user.email
    // url_base64_decode function decodes the token stored in base 64 format
    
  }else{
    alert("no token found. please login")
    window.location='#/'
  }// gets details from the jwt token an decodes it to get profile information

  var pieName = [];
  var pieNet = [];
  var barNet = [];
  var netPercent =[];


  var pieHelper = 0;
  var maxX = 40;
  var count = 0;
  var totalPie = 0;
  var len = 0;
     
  // getting all the results for the user for analysis and charts
  this.allResults = function(userId){

    testService.getAllResults(userId)
    .then(function successCallback(response) {
          
          if(response.data.status==401){
            alert(response.data.message)
            window.location="#/"
          }
          else if(response.data.status==200){
            main.items= response.data.data;

            // loading all the tests for calculating analytics
            main.getTest();
            len = main.items.length;
            

          } else {
            alert(response.data.message)
          }
          
          

        }, function errorCallback(response) {
          
          alert("some error occurred. Check the console.");
          console.log(response);
        });
  }

  // checking if user is admin
  // if admin then load the details of the user he is requesting for
  if(id && $window.sessionStorage.token){
    if(main.profile.user.email=="admin@admin.com"){
      this.allResults(id);
    }else{
      $window.history.back();
    }
  }
  // if user is not an admin
  // then get details specific to him
  else if($window.sessionStorage.token){
    if(main.profile.user.email!="admin@admin.com"){
      this.allResults(main.profile.user._id);
    }else{
      $window.history.back();
    }
  }

  // get all the tests for analytics and charts
  this.getTest = function(){

    testService.getAllTests()
    .then(function successCallback(response) {
          
          if(response.data.status==401){
            alert(response.data.message)
            window.location="#/"
          }
          else if(response.data.status==200){
            // set data points for line chart. Maximum is 40.
            if(len<40){
              maxX = len
            }
            main.totalMarks = 0;

            // calculating percentage obtained for each test attempted by the user
            for(var x = 0;x<len;x++){
              var r8len = main.items[x].rightAnswer.length;
              for(var y =0;y<r8len;y++){
                if(main.items[x].userAnswer[y]){
                  if(main.items[x].rightAnswer[y]==main.items[x].userAnswer[y].answer){
                    main.correct +=1;
                  }
                }
              }

              // get the date on which the test was attempted and push them to markaAll array
              var date = new Date(parseInt(main.items[x].date));
              main.dateOfTest.push($filter('date')(date,'short'));
              main.chartPer.push((main.correct/r8len)*100)
              main.totalMarks +=(main.correct/r8len)*100;
              main.marksAll.push({
                percentage : (main.correct/r8len)*100,
                name : ""
              })
              main.correct = 0;
              
            }

            // calculating average scores for all tests and calculating the last updated date
            if(len>0){
              main.averageScore = Math.round((main.totalMarks/len) * 100) / 100;
              main.lastUpdated = main.items[len-1].date;
            }

            main.tests= response.data.data;
            var testLen = main.tests.length;

            // getting the name of the test for each result
            for(var x =0;x<len;x++){
              for(var y =0;y<testLen;y++){
                if(main.items[x].testId==main.tests[y]._id){
                  main.testArray.push(main.tests[y]);
                  main.marksAll[x].name = main.tests[y].name;                 
                }
              }
            }

            // getting average scores for a single test attempted more than once
            for(var x =0;x<testLen;x++){
              pieName.push(main.tests[x].name)
              for(var y =0;y<len;y++){
                if(main.tests[x].name==main.marksAll[y].name){
                  pieHelper += main.marksAll[y].percentage
                  count +=1;
                }
              }

              // if score is 0 then push zero else push the average score oin each test
              if(pieHelper==0){
                pieNet.push(0)
              }else{
                pieNet.push(Math.round(pieHelper/count*100)/100);
                totalPie +=  pieHelper/count
                main.show = "show";
              }

              // for setting the show hide messages
              if(main.show!='show'){
                main.show='hide';
              }

              pieHelper = 0;
              count = 0;
            }

            // for setting the show variable for hiding the loading screen
            if(main.show=="loading"){
              main.show='hide';
            }
  
            barNet = pieNet;
            netPercent.length=pieNet.length;

            // calculate the percentage scored in one test over others
            for(var y =0;y<testLen;y++){
              if(pieNet[y]==0){
                netPercent[y] = 0;
              }else{
                netPercent[y] = Math.round((pieNet[y]/totalPie*100)*100) / 100;
              }
            }

            // calling the chart service to display all three charts
            chart.displayBarGraph(pieName,barNet,$scope.ctxb);
            chart.displayPieChart(pieName,netPercent,$scope.ctxp);
            chart.loadChart(main.dateOfTest,main.chartPer,maxX,$scope.ctx); 

            main.testArray.reverse();
            
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

  // get user details to be shown when view is generated for the admin
  this.getUser = function(id){

    testService.getUser(id)
    .then(function successCallback(response) {

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

  // calling the functions to get user details if user is admin
  if(id && $window.sessionStorage.token){
    this.getUser(id);
  }

  this.logout = function () {
    
    delete $window.sessionStorage.token;
    window.location="#/"
    
  };// deletes the token on user logout



}]);