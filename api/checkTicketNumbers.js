// get dependencies
var AWS = require('aws-sdk');
var mysql = require('mysql');

module.exports = {
    getNumbers : function (connection, item, callback){
    var sql = "SELECT ticketNumber FROM "+item['name'];
    connection.query(sql, function (err, results) {
      if (err) throw err;
      callback(results);
    });
    }
};
