var AWS = require('aws-sdk');
var mysql = require('mysql');
var conf = require("../conf/api_config.json");
const aws = require('aws-sdk');
const s3 = new aws.S3(); // Pass in opts to S3 if necessary
var dbUtils = require("../utils/database");

function removeItem(connection, name){
  var sql = "DELETE FROM items WHERE name='"+name+"';";
  connection.query(sql, function (err, result) {
  if (err) throw err;
    //console.log("item removed");
  });
}

function removeBidsTable(connection, name){
    //var tableName = item.name+"_"+(parseInt(result[0]['id']).toString(10));
    //console.log('Creating Table Named: ' + tableName);
    var sql = "DROP TABLE IF EXISTS copordrop."+name;
    console.log(sql);
    connection.query(sql, function (err, result) {
    if (err) throw err;
      //console.log("Table Deleted");
    });
};

module.exports = function (connection, data) {
  itemName = data.Records[0]['s3']['object']['key'].split('/')[0];
  removeItem(connection, itemName);
  //removeBidsTable(connection, itemName);
  return 'Success';

};
