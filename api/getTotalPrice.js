// get dependencies
var AWS = require('aws-sdk');
var mysql = require('mysql');


module.exports = {
    getPrice : function (connection, items, callback){
      var response = {}
      var sql = 'SELECT name, price as totalPrice, numberAllowedTickets, price/numberAllowedTickets as price FROM items WHERE name IN (';
      for (var i = 0; i < items.length; i ++){
        sql += "\""+items[i]['name']+"\",";
      }

      sql = sql.substring(0, sql.length - 1)+ ")";
      console.log(sql);
      connection.query(sql, function (err, results) {
        if (err) throw err;
        var tprice = 0;
        for (var i = 0; i < items.length; i++){
          for (var x =0; x < results.length; x++){
            if (items[i]['name'] == results[x]['name']){
              var ticketNums = items[i]['ticketNumbers'].split(",").length;
              var price = Number(results[x]['price']) * Number(ticketNums);

              response[results[x]['name']] = price;
              tprice += price;
            }
          }
        }
        response['price'] = tprice;
        callback(response);
    });
  }
}
