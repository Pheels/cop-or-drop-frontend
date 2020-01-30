
function checkUrl(){
  var url = window.location.href;
  if (!url.includes("email=")){
    document.location.href = "/error.html"
  }
}


function sendConfirmationCode(){
  var confirmationCode = document.getElementById("confcode").value;
  var email = document.location.href.split('=')[1];
  var emailUrl = 'https://api.copordrop.co.uk/confirmUser'
  var json = JSON.stringify({
    email: email,
    confCode: confirmationCode
  });
  console.log(json);
  try {
      var xhr = createCORSRequest('POST', emailUrl);

      // Response handlers.
      xhr.onload = function() {
        var response = xhr.response;
        console.log(response);
        if (response){
          if (response['result'].toLowerCase().includes('success')){
            successfulSignup();
          } else {
            $.alert({
              title: 'Please Note:',
              content: response,
              boxWidth: '50%',
              useBootstrap: false,
              offsetBottom: 50
            });
          }
        } else {
          $.alert({
            title: 'Please Note:',
            content: "Something has gone wrong. Please try again.",
            boxWidth: '50%',
            useBootstrap: false,
            offsetBottom: 50
          });
          console.log(response);
          }
      };

      xhr.onerror = function() {
        alert('Error: An errror occured whilst loading the page.');
      };

      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(json);
    } catch (err){
      if (!err instanceof TypeError){
        console.log(err.message)
       throw err.message;
     }
  }
}

function resendCode(){
  var email = document.location.href.split('=')[1];
  var emailUrl = 'https://api.copordrop.co.uk/resendConfCode'
  var json = JSON.stringify({
    email: email
  });
  console.log(json);
  try {
      var xhr = createCORSRequest('POST', emailUrl);

      // Response handlers.
      xhr.onload = function() {
        var response = xhr.response;
        if (response['result']['CodeDeliveryDetails']){
          $.alert({
            title: 'Please Note:',
            content: "Code has been resent.",
            boxWidth: '50%',
            useBootstrap: false,
            offsetBottom: 50
          });
        }
        document.getElementById('issue').outerHTML = `<label class="signup-label" for="issue" id='issue'>Still having an issue? <a href="/contact.html">Contact Us</a>.</label>`

      };

      xhr.onerror = function() {
        alert('Error: An errror occured whilst loading the page.');
      };

      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(json);
    } catch (err){
      if (!err instanceof TypeError){
        console.log(err.message)
       throw err.message;
     }
  }
}


function successfulSignup(){
  document.getElementById("signupinputs").innerHTML = `
  <div class="successful-signup">Congratulations, your account has successfully been created!<br></div>
  <div class="terms-title">Click <a href="/login.html">here</a> to login.</div>`
}
