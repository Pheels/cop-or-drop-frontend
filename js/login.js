
function handleLoginUser(){
      var url = 'https://api.copordrop.co.uk/loginUser';
      var email = document.getElementById("email").value.toLowerCase();
      var password = document.getElementById("pass").value;

      var json = {
        "username": email,
        "password": password
      }


      var xhr = createCORSRequest('POST', url);
      if (!xhr) {
        alert('CORS not supported');
        return;
      }

      // Response handlers.
      xhr.onload = function() {
        var response = xhr.response;
        console.log(response);
        if (JSON.stringify(response).includes("Incorrect username or password.") || JSON.stringify(response) == "{}"){
          $.alert({
            title: 'Please Note:',
            content: 'Incorrect Username or Password.',
            boxWidth: '50%',
            useBootstrap: false,
            offsetBottom: 50
          });
        } else if(JSON.stringify(response).includes("UserNotConfirmedException")){
          $.alert({
            title: 'Please Note:',
            content: 'You must verify your account before you can login.',
            typeAnimated: true,
            boxWidth: '50%',
            useBootstrap: false,
            offsetBottom: 50,
            escapeKey: true,
            onDestroy: function () {
              confirmEmail(email);
            }
          });
        } else {
          var url2 = 'https://api.copordrop.co.uk/confirmValidJWT'
          try {
            var token = response['idToken'];
            console.log(token);
            // format json to get product
            var jsondata = JSON.stringify({
              jwt: token.toString()
            });


            var hr = createCORSRequest('POST', url2);

            // Response handlers.
            hr.onload = function() {
              var response = hr.response;
              console.log(response);
              if (response){
                writeCookie(response);
                successfulLogin(response);
              }
            };

            hr.onerror = function() {
              alert('Error: An errror occured whilst loading the page.');
            };

            hr.setRequestHeader("Content-Type", "application/json");
            console.log(jsondata);
            hr.send(jsondata);
          } catch (err){
            if (!err instanceof TypeError){
             throw err.message;
           }
        }
      }
    }

    xhr.onerror = function() {
      alert('Error: An errror occured whilst loading the page.');
    };

    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(json));
}

function confirmEmail(email){
  document.location.href = "/confirmEmail.html?email="+email
}

function successfulLogin(response){
  // document.getElementById("signupinputs").innerHTML = `
  // <div class="successful-signup">You are now successfully logged in!<br></div>
  // <div class="terms-title">Click <a href="/products.html">here</a> to view our competitions.</div>`
  document.location.href="/";
  writeCookie(response);
}
