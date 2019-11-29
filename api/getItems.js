// get dependencies
var AWS = require('aws-sdk');
var mysql = require('mysql');
var sql = 'SELECT * FROM items ORDER BY created DESC';

module.exports = {
  getRows: function (connection, callback) {
  connection.query(sql, function (err, results) {
    if (err) throw err;
    callback(results);
  });
  }
};
