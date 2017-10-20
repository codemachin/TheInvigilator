

myApp.controller('testLiveController',['socket','$timeout','$scope','$http','$routeParams','testService','$interval','$location','$window',function(socket,$timeout,$scope,$http,$routeParams,testService,$interval,$location,$window) {

  var main = this;

  // checks if token is in sessionStorage and parses it
  if($window.sessionStorage.token){
    var encodedProfile = $window.sessionStorage.token.split('.')[1];
    this.profile = JSON.parse(testService.url_base64_decode(encodedProfile));
    // url_base64_decode function decodes the token stored in base 64 format

    // donot allow admin to access this page as he himself has created the questions
    if(main.profile.user.email=="admin@admin.com"){
      alert("Admin cannot take a test as he has created all questions and can view them anytime the admin needs to.");
      $window.history.back();
    }

  }else{
    alert("no token found. please login")
    window.location='#/'
  }// gets details from the jwt token an decodes it to get profile information

  this.answer=[];
  var userInitiated=false;
  var isSaved = false;

  var dy= new Date();

  // check if any recent test was saved accidently due to refresh or route change
  // and displays the message which is timed out after 20 secs
  if((dy.getTime()-$window.sessionStorage.refreshed)<1000*60*5){
    this.savmes = $window.sessionStorage.refreshed;
    $timeout(function(){ 
      main.savmes="";
      $window.sessionStorage.refreshed=null;
    }, 20000);
  }

  // recieves the server time which is emited from the server every 5 secs to keep track of the time.
  // and also prevents the user from pausing the test or anyhow cheating the system
  socket.on("serverTime",function(data){   
      main.trackTime(data)
  })

  // stops the test if time runs out and saves it by the event emited from server
  // if test if not stopped automatically at the client side
  socket.on("stop test",function(){
    if(isSaved==false){
      main.saveFinal();
    }
  })

  // saves the test as much as it has been answered on location change
  $scope.$on('$locationChangeStart', function(event) {
    if(userInitiated==false){
      var bool = confirm("Are you sure you want to leave this page? Test will be saved even if you haven't completed it.");
      if(bool==false){
        event.preventDefault();
      }else{
        if(main.loaded==true){
          main.saveFinal();
        }
      }
    }
             
  });

  // function that saves the test as much as answered if its refreshed accidently or deliberately
  var saveResultwhenRefreshed = function(){

    var time = (main.items.data.time*60) - (main.min*60+main.sec);
    var minutes = Math.floor(time / 60);
    var seconds = time - minutes * 60;

    var mydata = {
      id : main.items.data._id,
      userAnswer : main.answer,
      timeTaken : minutes+" minutes "+seconds+" seconds"
    }

      var savenow = function( callback) {
        testService.saveAns(mydata)
          .then(function successCallback(response) {

                callback(response.data.message);
          
            }, function errorCallback(response) {

                callback(response);
            });
      }

      if(main.loaded==true){
        savenow( function(returnData) {
          console.log(returnData)
        })
      }

  }

  // this function checks if the page has been reloaded and displays a warning and saves the test if refreshed
  window.onbeforeunload = function() {
      
        var d= new Date();
        $window.sessionStorage.refreshed=d.getTime();
        saveResultwhenRefreshed();

      return undefined;   
  };

  
  // function to start the timer using $interval after the test has been loaded
  this.startTimer = function(time){
      var countdown = time;
      timerId = $interval(function(){
        countdown -= 1000;
        var min = Math.floor(countdown / (60 * 1000));
        //var sec = Math.floor(countdown - (min * 60 * 1000));  // wrong
        var sec = Math.floor((countdown - (min * 60 * 1000)) / 1000);  //correct

        if (countdown <= 0) {
           alert(main.items.data.time +" mins over!!!");

           $interval.cancel(timerId);
           if(isSaved==false){
              main.saveFinal();
           }

        } else {
           
           main.min = min;
           main.sec = sec;
           
        }

      }, 1000); //1000ms. = 1sec.

      // destroy event when the controller scope is destroys
      // cancels the interval promise, emits socket end connection
      // removes all the socket listeners whichever open
      // and removes the onbeforeunload method that prevents reload
      $scope.$on('$destroy', function () { 
        $interval.cancel(timerId);
        socket.getSocket().removeAllListeners();
        socket.emit('end connection');
        window.onbeforeunload = undefined;
      });
  }


  this.question={};
  this.id = $routeParams.id;
  var i = 0;
  this.count = i;

  // function is used to fetch the next question
  // timeeach records the time when any question is loaded
  // main.sel holds the answer thats selected
  this.getNext=function(){
    if(i+1<main.questions.length){
      main.question = main.questions[++i];
      var d= new Date();
      main.timeEach = d.getTime();
      this.count = i;
      main.sel = main.answer[i].answer
    }else{
      alert('end of test')
    }
    // checks if the current question is the last question
    if(i+1==main.questions.length){
      main.endOfTest=true;
    }else main.endOfTest=false;

  }

  // function is used to fetch the next question
  // timeeach records the time when any question is loaded
  // main.sel holds the answer thats selected
  this.getPrev=function(){
    if(i>0){
      main.question = main.questions[--i];
      var d= new Date();
      main.timeEach = d.getTime();
      this.count = i;
      main.sel = main.answer[i].answer
      
    }else{
      alert('start of test')
    }
    // checks if the current question is the last question
    if(i+1==main.questions.length){
      main.endOfTest=true;
    }else main.endOfTest=false;
  }

  // saves the answer when submit button is hit
  // each variable hold the time taken to answer each question 
  this.saveAnswer = function(option){
    var d= new Date();
    var each = main.answer[i].timeEach + d.getTime() - main.timeEach;
    main.answer[i] = { 
      answer : option,
      timeEach : each
    }

    main.sel = main.answer[i].answer
    main.timeEach = d.getTime();
  }


  // loads the test questions
  this.testStart = function(){

    testService.getTest(main.id)
    .then(function successCallback(response) {
          
          if(response.data.status==401){
            alert(response.data.message)
            window.location="#/"
          }
          else if(response.data.status==200){

            main.items= response.data;
            // emits that test is started to the server so that it starts maintaining the time
            socket.emit("startServerTimer",main.items.data.time)
            main.questions = response.data.data.questions;
            // loads the first question
            main.question=main.questions[0];
            // checks if there is only one question and sets the end of test flag
            if(main.questions.length==1){
              main.endOfTest=true
            }

            // makes the array for the answers to be saved
            main.answer = Array(main.questions.length).fill({answer:"",timeEach:0});
            main.startTimer(main.items.data.time * 60 * 1000);
            var d= new Date()
            main.startTime = d.getTime();
            main.timeEach = main.startTime;
            main.loaded = true;


          } else {
            alert(response.data.message)
          }
          
          

        }, function errorCallback(response) {
          
          alert("some error occurred. Check the console.");
          console.log(response);
        });
  }



  // saves all the answers when final submit is hit
  // time taken is calculated  
  this.saveFinal = function(){

    var time = (main.items.data.time*60) - (main.min*60+main.sec)
    isSaved = true;

    var minutes = Math.floor(time / 60);
    var seconds = time - minutes * 60;

      var mydata = {
        id : main.items.data._id,
        userAnswer : main.answer,
        timeTaken : minutes+" minutes "+seconds+" seconds"
      }

      testService.saveAns(mydata)
      .then(function successCallback(response) {
            
            if(response.data.status==401){
              alert(response.data.message)
              window.location="#/"
            }
            else if(response.data.status==200){

              userInitiated=true;
              alert(response.data.message);
              window.location='#/'+response.data.data._id+'/result'
              

            } else {
              alert(response.data.message)
            }
            
            

          }, function errorCallback(response) {
            
            alert("some error occurred. Check the console.");
            console.log(response);
          });

  }

  // function gets the number of times the test is taken 
  // and prevents any user to take the test more than thrice
  this.findResults = function(){

      testService.getAllResults(main.profile.user._id)
      .then(function successCallback(response) {
            
            if(response.data.status==401){
              alert(response.data.message)
              window.location="#/"
            }
            else if(response.data.status==200){
              var c=0;
              for(var x in response.data.data){
                if(response.data.data[x].testId==main.id){
                  c++
                }
              }
              if(c>=3){
                alert('Maximum numbers of test an user can take is exceeded. Try some other test.')
                window.location = "#/takeatest"
              }else{
                main.testStart();
              }

            } else {
              alert(response.data.message)
            }
            
            

          }, function errorCallback(response) {
            
            alert("some error occurred. Check the console.");
            console.log(response);
          });

  }

  if($window.sessionStorage.token){
    this.findResults();
  }

  // gets the server test start time to maintain the time difference between the server and the client
  socket.on("startedTime",function(data){

    var negative = main.startTime - data.time 
    main.timeDiff = -negative>0 ? -negative : negative;
    main.serverStartTime = data.time;

  }) 


  // constantly checks for the time difference between the server and client at any moment
  // keeps consideration if server is ahead of client or client is ahead of server
  // if anyhow the timer difference in the server and client exceeds
  // more than 3 secs the test timer is reset automatically to the server time
  // if anyhow the time difference increases the total test time, due to hacking or cheating the test is saved immediately
  this.trackTime = function(response){

      if(main.startTime>main.serverStartTime){

        var negative = ((main.items.data.time*60) - (main.min*60+main.sec))*1000 - (response.time+main.timeDiff-main.startTime);
        var currentDif = -negative>0 ? -negative : negative;
        var cnvt = response.time+main.timeDiff-main.startTime;
        var elaspedTime = -cnvt>0 ? -cnvt : cnvt;

      }else{

          var negative = ((main.items.data.time*60) - (main.min*60+main.sec))*1000 - (response.time-main.timeDiff-main.startTime);
          var currentDif = -negative>0 ? -negative : negative;
          var cnvt = response.time-main.timeDiff-main.startTime;
          var elaspedTime = -cnvt>0 ? -cnvt : cnvt;

      }

        if(currentDif>3000){
          $interval.cancel(timerId);
          main.startTimer(main.items.data.time * 60 * 1000-(elaspedTime));
        }else if(currentDif>main.items.data.time*60*1000){
          main.answer.length=0;
          main.saveFinal();
        }

  }

  this.logout = function () {
    
    delete $window.sessionStorage.token;
    window.location="#/"
    
  };// deletes the token on user logout

}]); // end controller