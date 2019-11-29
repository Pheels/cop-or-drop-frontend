// get dependencies
var AWS = require('aws-sdk');
var mysql = require('mysql');

module.exports = {
  // return the number of bids and then the list of bid numbers sorted.
    getItem : function (connection, data, callback){
    var sql = "SELECT ticketNumber FROM "+data['item_name']+"";
    connection.query(sql, function (err, results) {
      if (err) throw err;
      callback(results);
    });
    }
};
