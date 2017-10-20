# The Invigilator, a live test taking system

Robust MEAN live test taking system

## Domain pointed to cloud server using route 53

[theinvigilator.ga](http://theinvigilator.ga "live test taking system")

## AWS public ip

[52.1.107.157](http://52.1.107.157 "live test taking system")

## Assumption

* Please signup with email as '**admin@admin.com**' to be the admin of this system.
* All users having email as '**admin@admin.com**' will be the admin of this application.
* Treated the Admin as a user of the system. Did not create special backend for admin.

## Please note

* All callback urls for social logins and email reset url links are with respect to theinvigilator.ga

## Project Description
```
A live test taking system that allows an organisation to conduct a test in MCQ pattern. The project keeps a track of the time live and prevents any kind of tampering. Various charts and analytics are shown once the user finishes the test.
```

## Features

	1) Single page application
	2) Login(encrypted)
	3) Signup(encrypted)
	4) Facebook and google login using passport js.
	5) Facebook and google signup using passport js.
	6) Forgot password functionality to resetting password.
	7) User testing management panel - User facing 
		~  Once the user logs into the system, he can see a dashboard containing the statistics of all tests he has taken. The statistics include the number of tests taken, average score and percentage growth etc.
		~ Multiple charts are shown that calculate various analytics for the user includes a area chart, bar graph and a pie chart.
		~ Dashboard contains the recent tests the user has given and on view more the user can see all his test results. All items are clickable.
		~ There is a “take a test” option in menu from which user can go to test taking page
		~ On test taking page, user can see a list of tests he can appear for along with a button to start that test.
	8) User test taking panel - User facing
		~ Once user clicks on start test, he can see an instructions screen containing the rules of the test.
		~ Once the user reads the instructions and accepts the rules (single accept button), The test timer will start and the screen should display the test questions and options associated with it.
		~ User can choose only one option as answer for every question.
		~ User can go back and forward in the test as he/she wishes and the test also shows what answer he/she had selected previously.
		~ The test has a time limit. The test window automatically closes once the timeout occurs irrespective of how many questions have been answered. The system should submit the answers automatically.
		~ The test gives warning if user tries to reload or leave the page.
		~ The test saves the test as much answered if the user reloads the test or tries to leave the page.
		~ If the user completes the test before the time ends, he should see a final submit button which will submit his all answers. In case of timeouts, the user is redirected to the result page.
		~ The system keeps track of how much time a user is taking for answering each question.
		~ Socketio is used for live tracking the test timer and checking at constant interval that the timer is not hacked or paused.
		~  On submission of test, result is shown to the student. He is shown the number of correct answers and percentage of marks obtained and other analytics.
	9) Test listing panel - Admin facing
		~ Admin can create tests in the system.
		~ Each test has a set of questions, each question containing at least 4 options and overall time limit of the test.
		~ Admin can create, edit, delete and view any tests, question or option.
		~ While creating options for any question, admin can set a correct answer. This answer (flag) will actually help in automating the test evaluation process. 
	10) User analytics panel - Admin facing 
		~ Admin can view details and analytics of all the users registered in the system.
		~ Admin can view overall performance of the user in all his tests.
	11) Single page application.

## Extra features

	1) DataTables showing test analytics like who scored highest, lowest in the test, used anguler-datatable.
	2) Chart js used to show 3 kinds of charts.
	3) Each test can be given a maximum of 3 times.
	4) The test prevents any kind of cheating or hacking the timer by automatically tallying the server time with the client time.
	5) It automatically resets the timer if time difference becomes greater than 3 secs. It keeps into consideration the round trip time between the client and the server.
	6) Socket event stops the test if client timer fails or paused or is hacked.
	7) Secured with JWT. Default JWT expiry time is set to 30 minutes.
	8) Pure stateless REST apis.	

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

	1) Nodejs
	2) Mongodb
	3) NPM
	4) Git

### Installing

Environment : Windows and Linux

Setting Prerequisites

```
1) Start mongodb by running mongod
2) Check node is above version 6.0. Check by typing node -v in terminal
```

Setting up the local server

```
1) Unzip the file
2) Open terminal and change its location the where you unzipped the file
3) Run command npm install
4) After all dependencies are installed. Run command : node app.js, in your terminal
5) let the server start
```

Getting started

```
1) Visit http://localhost:3000 on your browser
2) Select signup to create a new account
3) Organise a quality test for the students to judge their skills with the vast array of analytics.
```

## How to use

```
User facing :
	1) Use a unique email to start with.
	2) After logging in, user will be able to view all the test and their analytics.
	3) The area chart shows timeline of the tests user has taken.
	4) The bar graph shows the average performance for a single test given multiple times by the user.
	5) The pe chart shows the average percentage in a scored over multiple times, with respect to other tests in the system. An user can know which is the most scoring subject for him.
	3) User can view all results on view more.
	4) User can take a test maximum of three times. 
	5) User cannot reload or leave the live test page once he starts it.
	6) User can view all the results individually.
	7) User can also view the correct answers on the result page.
	8) User can reset password securely if he forgets it.

Admin facing :
	1) Admin must signup with email as admin@admin.com (all small characters).
	2) All users having email as admin@admin.com will be the admin of this application.
	3) After logging in, admin will be able to view all the user details in the tests they have given.
	4) Admin can view the test analytics individually.
	5) Admin can create the test.
	6) Admin can create, edit, delete and add any questions.
	7) Test wont be shown to user unless all the questions are filled.
	8) Admin can reset password securely if he forgets it.
```



## Deployment on linux server

Prerequisites

```
1) Mongodb
2) Node js version 6 and above
3) Nginx
4) Git
```

Installing and pulling files

```
1) Create new directory by : mkdir dirname
2) cd into that folder
3) Add git origin by : git remote add origin https://github.com/codemachin/TheInvigilator.git
4) Initialise git to that directory : git init
5) Pull files: git pull origin master  
6) Run : npm install, to install all dependencies
7) Run : node app.js, to start the server
```

Nginx configuration for proxy pass to port 80

```

	server {

	    listen 80;
	    server_name theinvigilator.ga;

	    location / {

	            proxy_pass http://localhost:3000;

	    }

	}

```

## Built With

* Socket Io
* Bootstrap
* nodejs
* Postman
* Sublime Text

## Versioning

The Invigilator version 1.0

## Authors

* **Vivek Shankar** 