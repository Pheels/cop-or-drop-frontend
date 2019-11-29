var AWS = require('aws-sdk');
var mysql = require('mysql');
var conf = require("../conf/api_config.json");
const aws = require('aws-sdk');
const s3 = new aws.S3(); // Pass in opts to S3 if necessary
var dbUtils = require("../utils/database");

function postItem(connection, item){
  dbUtils.checkItemExists(connection, item.s3Location, function(results){
    if (!Object.keys(results).length){
      var sql = "INSERT INTO items (name, s3Location, created, active, price, numberAllowedTickets, description, question, answer1, answer2, answer3, answer4, correctanswer) VALUES ('"+item.name+"', '"+item.s3Location+"', '"+item.created+"', "+item.active+", "+item.price+", "+item.numberAllowedTickets+", '"+item.description+"', '"+item.question+"', '"+item.answer1+"', '"+item.answer2+"', '"+item.answer3+"', '"+item.answer4+"', '"+item.correctanswer+"')";
      connection.query(sql, function (err, result) {
      if (err) throw err;
        console.log("item inserted");
      });
    } else {
      console.log('Item already exists in database with id: ' + results[0]['id']+"\n")
    }
  });
}

function createTicketsTable(connection, item){
  dbUtils.getLastItemID(connection, function(result){
    //var tableName = item.name+"_"+(parseInt(result[0]['id']).toString(10));
    //console.log('Creating Table Named: ' + tableName);
    var sql = "CREATE TABLE "+item.name+`(
    \`id\` int(11) unsigned NOT NULL AUTO_INCREMENT,
    \`userName\` int(11) NOT NULL,
    \`timestamp\` varchar(25) NOT NULL DEFAULT '',
    \`paymentId\` varchar(25) NOT NULL DEFAULT '',
    \`paymentMethod\` varchar(25) NOT NULL DEFAULT '',
    \`ticketNumber\` int(11) unsigned NOT NULL,
    PRIMARY KEY (\`id\`)
    ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;`
    console.log(sql);
    connection.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Table Created");
    });
  });
};

function parseItemDescription(data, name, callback){
  console.log("Parsing Description")
  var s3Params = {
    Bucket: 'cop-or-drop-items',
    Key: name+'/description.txt'
  };
  console.log("Pulling s3 object: " + name)

  s3.getObject(s3Params, function(err, data) {
    if (err === null) {
      var fields = {};
      let objectData = data.Body.toString('utf-8');
      fields.description = objectData.match('description: \'[^\']*')[0].split('description: \'')[1];
      fields.price = objectData.match('price: \'[^\']*')[0].split('price: \'')[1];
      fields.numberAllowedTickets = objectData.match('number of tickets: \'[^\']*')[0].split('number of tickets: \'')[1];
      fields.question = objectData.match('question: \'[^\']*')[0].split('question: \'')[1];
      fields.answer1 = objectData.match('answer1: \'[^\']*')[0].split('answer1: \'')[1];
      fields.answer2 = objectData.match('answer2: \'[^\']*')[0].split('answer2: \'')[1];
      fields.answer3 = objectData.match('answer3: \'[^\']*')[0].split('answer3: \'')[1];
      fields.answer4 = objectData.match('answer4: \'[^\']*')[0].split('answer4: \'')[1];
      fields.correctanswer = objectData.match('correctanswer: \'[^\']*')[0].split('correctanswer: \'')[1];

      if (objectData.match("active: 'yes'")[0]){
        fields.active = '1';
      } else {
        fields.active = '0';
      }
      callback(fields);
    } else {
       console.log(err);
    }
  });
}

module.exports = function (connection, data) {
    var item = {};
    item.name = data.Records[0]['s3']['object']['key'].split('/')[0];
    console.log('item name: ' + item.name)
    item.s3Location = conf.bucket_location + item.name
    dbUtils.checkItemExists(connection, item.s3Location, function(results){
      if (!Object.keys(results).length){
        item.created = data.Records[0]['eventTime'];
        console.log("event time " + item.created);
        parseItemDescription(data, item.name, function(fields){
          item.description = fields.description;
          item.price = fields.price;
          item.numberAllowedTickets = fields.numberAllowedTickets;
          item.active = fields.active;
          item.question = fields.question;
          item.answer1 = fields.answer1;
          item.answer2 = fields.answer2;
          item.answer3 = fields.answer3;
          item.answer4 = fields.answer4;
          item.correctanswer = fields.correctanswer;
          postItem(connection, item);
          createTicketsTable(connection, item);
        });
    } else{
      console.log('Item already exists in database with id: ' + results[0]['id']+"\n")
    }
    });
    return 'Success';
};
