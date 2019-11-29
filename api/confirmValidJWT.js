// get dependencies
var AWS = require('aws-sdk');
var mysql = require('mysql');
var jose = require('node-jose');
var jwt = require('jsonwebtoken');
var jwkToPem = require('jwk-to-pem');
var jwks = require('../conf/jwk.json');


module.exports = {
    confirmToken : function (connection, token, callback){
      idtoken = token.replace(/id_token=/g, "").replace(/&access_token.*/g, "");
      var sections = idtoken.split('.');
      // get the kid from the headers prior to verification
      var header = jose.util.base64url.decode(sections[0]);
      header = JSON.parse(header);
      var kid = header.kid;

      // get keys from jwk.json file
      var keys = jwks['keys'];

       // search for the kid in the downloaded public keys
       var key_index = -1;
       for (var i=0; i < keys.length; i++) {
               if (kid == keys[i].kid) {
                   key_index = i;
                   break;
               }
       }
       if (key_index == -1) {
         console.log('Public key not found in jwks.json');
         callback('Public key not found in jwks.json');
       }

        var pem = jwkToPem(keys[key_index]);
        jwt.verify(idtoken, pem, { algorithms: ['RS256'] }, function(err, decodedToken) {
          if (err){
            console.log(err);
          }
          var resp = {};
          resp['email'] = decodedToken['email'];
          resp['name'] = decodedToken['name'];
          resp['phone_number'] = decodedToken['phone_number'];
          callback(resp);
        });
    }
};
