// function handleAuth(){
//   var url = 'https://api.copordrop.co.uk/confirmValidJWT'
//   try {
//     var token = matchFirstRegex(/id_token=.*/g, window.location.href);
//     console.log(token);
//     // format json to get product
//     var jsondata = JSON.stringify({
//       jwt: token.toString()
//     });
//
//     var xhr = createCORSRequest('POST', url);
//     if (!xhr) {
//       alert('CORS not supported');
//       return;
//     }
//
//     // Response handlers.
//     xhr.onload = function() {
//       var response = xhr.response;
//       console.log(response);
//       if (response){
//         writeCookie(response);
//         handleLoginButton();
//         // write to local storage
//         // change login in to logout
//       }
//     };
//
//     xhr.onerror = function() {
//       alert('Error: An errror occured whilst loading the page.');
//     };
//
//     xhr.setRequestHeader("Content-Type", "application/json");
//     xhr.send(jsondata);
//   } catch (err){
//     if (!err instanceof TypeError){
//      throw err.message;
//    }
//   }
// }

function writeCookie(data){
  var now = new Date();
  var time = now.getTime();
  time += 3600 * 1000;
  now.setTime(time);
  document.cookie = "email="+data['email']+";"
  document.cookie = "expires="+ now.toUTCString()+";"
  document.cookie = "path=/";
  console.log(document.cookie);
  console.log(getCookieValue('email'));
}

function getCookieValue(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function handleLoginButton(){
  if (!getCookieValue("email") == "") {
    var loginButton = document.getElementById('login-button');
    loginButton.textContent = "LOGOUT";
    loginButton.href = "/logout.html";
  }
}
