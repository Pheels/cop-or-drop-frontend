// app.js
// eb deploy cop-or-drop-env --label 0.0.1

// get dependencies
var AWS = require('aws-sdk');
var mysql = require('mysql');
var listAllObjects = require('s3-list-all-objects');
var sha256 = require('js-sha256');
var authConfig = require('./conf/auth.json')
var connection = require("./helpers/databaseConnection");

// Set the region
AWS.config.update({region: 'eu-west-2'});
// Create S3 service object
s3 = new AWS.S3({apiVersion: '2006-03-01'});
console.log("Generating Auth Hash")
// generate sha256 for authenticating endpoints
var hash = sha256(authConfig['apiPass']);


// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var cors = require('cors');

app.use(cors());

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ============================== UTILITY FUNCTIONS ============================
function authenticateLambdaRequest(authToken){
  if (authToken == hash){
    return true;
  } else {
    return false;
  }
};

function objToJson(object){
  var objs = [];
  for (var i = 0;i < object.length; i++) {
   objs.push({items: object[i]});
  }
  json = JSON.stringify(objs);
  return json
}

function formatTicketNumbers(data, callback){
  var jsonResponse = [];
  var jsonSize = data.length;
  ticketNumbers = [];
  while(jsonSize--){
    ticketNumbers.push(data[jsonSize].ticketNumber);
  }
  callback(data.length, ticketNumbers);
}
// =============================================================================

// ============================== TEST ENDPOINTS ===============================
app.get('/test', function (req, res) {
  res.json({ message: 'hooray! welcome to our api!', dbname: process.env.RDS_HOSTNAME});
})
// =============================================================================

// ============================== ENDPOINTS ================================
app.post('/checkTickets', function (req, res) {
  var checkTicketNumbers = require('./api/checkTicketNumbers');
  var cCAfunc = require('./api/checkCorrectAnswer');
    var item = req.body;
    var response = ""
    cCAfunc.checkAnswer(connection, item['id'], item['answer'], function(answerResults){
      if (answerResults == 'false'){
        var tickets = item['ticketNumbers'].split(',');
        var ticketsString = "";
        for (var l = 0; l < tickets.length; l++){
          ticketsString += "0,"
        }
        ticketsString = ticketsString.substring(0, ticketsString.length - 1);
        item['ticketNumbers'] = ticketsString;
        res.send(item);
      } else {
        response = item;
        cCAfunc.checkNumbers(connection, item, function(results){
          if (results['ticketsTaken']){
            res.send(results);
          } else {
            res.send(item);
          }
        });
      }
    });
});

app.post('/getTotalPrice', function (req, res) {
  var getTotalPrice = require('./api/getTotalPrice');
  console.log(req.body);
  getTotalPrice.getPrice(connection, req.body, function(totalPrice) {
    res.send(totalPrice);
  });
});

app.get('/getItems', function (req, res){
  console.log("getting items")
  var func = require('./api/getItems');
  func.getRows(connection, function(results){
    response = objToJson(results);
    res.send(response);
  })});

app.post('/postNewItem', function (req, res) {
  if (authenticateLambdaRequest(req.body['auth'])){
    var response = require('./api/postNewItem')(connection, req.body);
    res.send(response.Records);
  } else {
    res.status(403);
    res.send("Unauthorised");
  }
});

app.post('/deleteItem', function (req, res) {
  if (authenticateLambdaRequest(req.body['auth'])){
    var response = require('./api/deleteItem')(connection, req.body);
    res.send(response.Records);
  } else {
    res.status(403);
    res.send("Unauthorised");
  }
});

app.post('/postNewTickets', function (req, res) {
  // loop through items in cart
  console.log(req.body);
  // will need to authenticate here based on login and payment info
  var postNewTickets = require('./api/postNewTickets');
  postNewTickets.postTickets(connection, req.body, function(results){
    res.send(results);
  });
});

app.post('/postNewPayment', function (req, res) {
  // check tickets are ok
  // check total price is ok
  // post the tickets
  // complete payment
  // send response
  console.log(req.body);

  // will need to authenticate here based on login and payment info
  var postNewPayment = require('./api/postNewPayment');
  postNewPayment.postPayment(req, function(results){
    // console.log(results);
    res.send(results);
  });
});

app.post('/getIndividualItemById', function (req, res) {
  var func = require('./api/getIndividualItemByID');
  func.getItem(connection, req.body['id'], function(results){
    response = objToJson(results);
    res.send(response);
  })});

app.post('/checkCorrectAnswer', function (req, res) {
  var func = require('./api/checkCorrectAnswer');
  func.getItem(connection, req.body['id'], req.body['answer'], function(results){
    res.send(results);
  })});

app.post('/getTicketNumbers', function (req, res) {
  var func = require('./api/getTicketNumbers');
  func.getItem(connection, req.body, function(results){
  formatTicketNumbers(results, function(length, ticketNumbers) {
    res.setHeader('Content-Type', 'application/json');
    res.send('{"Size": "' + length+'", "ticketNumbers": "' + ticketNumbers.toString()+'"}');
  })
})});

app.post('/sendEmail', function (req, res) {
  var emailFunc = require('./api/sendEmail');
  emailFunc.sendEmail(req.body['name'], req.body['email'], req.body['message'], function(response){
    if (response){
      res.send(response);
    } else {
      res.status(500);
      console.log("Unable to send email, error: " + response);
      res.send("Unable to send email, error: " + response);
    }
  });
});

app.post('/confirmValidJWT', function (req, res) {
  var func = require('./api/confirmValidJWT');
  func.confirmToken(connection, req.body['jwt'], function(results){
    res.send(results);
  })});

// =============================================================================

// ============================== START SERVER =================================
const server = app.listen(8081);
console.log('Listening on port ' + 8081);
// =============================================================================

// ============================== GRACEFUL SHUTDOWN ============================
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received.');
  server.close(() => {
    console.log('Http server closed.');
    connection.end(false, () => {
      console.log('Mysql connection closed.');
    });
  });
});
// =============================================================================
