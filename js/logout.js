function logout(){

  sessionStorage.clear()
  document.cookie = "name= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
  console.log("Removed cookie");

  var url = 'https://api.copordrop.co.uk/logout'
  try {
    // Response handlers.
    var xhr = createCORSRequest('POST', url);
    if (!xhr) {
      alert('CORS not supported');
      return;
    }

    xhr.onload = function() {
      var response = xhr.response;
      if (response){
        console.log(response);
        window.location.href = "https://www.copordrop.co.uk";
      }
    };

    xhr.onerror = function() {
      alert('Error: An errror occured whilst loading the page.');
    };

    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({logout: 'logout'}));
  } catch (err){
    if (!err instanceof TypeError){
     throw err.message;
   }
  }
}
