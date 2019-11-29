// get dependencies
var AWS = require('aws-sdk');
var mysql = require('mysql');

module.exports = {
    checkAnswer : function (connection, id, answer, callback){
    var sql = 'SELECT correctanswer FROM items WHERE id = ' + id;
    connection.query(sql, function (err, results) {
      if (err) throw err;
      var response;
      if (answer == results[0]['correctanswer']){
        response = 'true'
        callback(response);
      } else {
        response = 'false'
        callback(response);
      }
    });
  },
  checkNumbers : function (connection, item, callback){
    var tickets = item['ticketNumbers'].split(',');

    var ticketString = "(";
    for (var i = 0; i < tickets.length; i++){
      ticketString+='"'+tickets[i]+'",';
    }

    var formattedTicketString = ticketString.substring(0, ticketString.length - 1)
    var sql = 'SELECT ticketNumber FROM '+item['name']+' WHERE ticketNumber in ' + formattedTicketString +');';
    connection.query(sql, function (err, results) {
      if (err) throw err;
      var response;
      var ticketsTaken = "";

      if (results) {
        for (var i = 0; i < results.length; i++){
          if (results[i]['ticketNumber']){
            if (i == results.length-1){
              ticketsTaken += results[i]['ticketNumber']
            } else {
              ticketsTaken += results[i]['ticketNumber'] + ", "
            }
          }
        }
        response =  {"ticketsTaken": ticketsTaken, "name": item['name']};
        callback(response);
      } else {
        response = 'true'
        callback(response);
      }
    });
  }
};
