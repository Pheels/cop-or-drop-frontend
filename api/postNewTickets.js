var AWS = require('aws-sdk');
var mysql = require('mysql');
var conf = require("../conf/api_config.json");
var dbUtils = require("../utils/database");

function postTickets(connection, tickets, callback){
  // iterate tickets
  var hasFailed = false;
  var itemsProcessed = 0;
  for (var t=0; t < tickets.length; t++){
    dbUtils.checkTicketAvailable(connection, tickets[t], function(result){
      // we return the ticket from checkTicketAvailable if it's not already taken
      if (result){
          // check if ticket number taken
          var sql = "INSERT INTO "+result.table+" (userName, timestamp, paymentId, paymentMethod, ticketNumber) VALUES ('"+result.userName+"', '"+result.timestamp+"', '"+result.paymentId+"', '"+result.paymentMethod+"','"+result.ticketNumber+"')";
          connection.query(sql, function (err, results) {
            if (err) throw err;
            return;
          });
          itemsProcessed++;
          if (itemsProcessed == tickets.length){
            var response = '{"response" : "Ticket(s) inserted successfully"}'
            callback(JSON.parse(response));
          }
      } else {
          hasFailed = true;
          itemsProcessed++;
          if (itemsProcessed == tickets.length){
            console.log("Ticket already exists");
            var response = '{"response" : "Ticket already exists"}'
            callback(JSON.parse(response));
          }
          // need some way to notify front end

        }
      });
    }
}

module.exports = {
  postTickets : function (connection, data, callback){
    var success = true;
    var tickets = [];
    if (data['ticketNumbers'].includes(',')){
      var ticketNumbers = data['ticketNumbers'].split(',');
      for (var i=0; i < ticketNumbers.length; i++){
        var ticket = {};
        ticket.table = data['name']
        ticket.userName = data['userName']
        ticket.timestamp = data['timestamp']
        ticket.paymentId = data['paymentId']
        ticket.paymentMethod = data['paymentMethod']
        ticket.ticketNumber = ticketNumbers[i];
        tickets.push(ticket);
        }
      } else {
        var ticket = {};
        ticket.table = data['name']
        ticket.userName = data['userName']
        ticket.timestamp = data['timestamp']
        ticket.paymentId = data['paymentId']
        ticket.paymentMethod = data['paymentMethod']
        ticket.ticketNumber = data['ticketNumbers'];
        tickets.push(ticket);
      }
    dbUtils.checkTableExists(connection, tickets[0].table, function(results){
      // ensure table exists
      if (Object.keys(results).length){
        postTickets(connection, tickets, function(response){
          callback(response);
        });
      } else {
        console.log('Table ' + tickets[0].table + ' does not exist.')
        var response = '{"response" : "Database error - table does not exist"}'
        callback(JSON.parse(response));
      }
    })
  }
};
