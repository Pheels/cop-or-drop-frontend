// get dependencies
var AWS = require('aws-sdk');
var mysql = require('mysql');

module.exports = {
    getItem : function (connection, id, callback){
    var sql = 'SELECT name, id, price, numberAllowedTickets, s3Location, active, created, category, description, question, answer1, answer2, answer3, answer4 FROM items WHERE id = ' + id;
    connection.query(sql, function (err, results) {
      if (err) throw err;
      callback(results);
    });
    }
};
