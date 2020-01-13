
function forgotPassword(){
    var url = 'https://api.copordrop.co.uk/forgotPassword';
    var email = document.getElementById("email").value;

    var json = {
      "username": email
    }

    var xhr = createCORSRequest('POST', url);
    if (!xhr) {
      alert('CORS not supported');
      return;
    }

    // Response handlers.
    xhr.onload = function() {
      console.log(xhr.response);
      var email = document.getElementById("email").value;
      window.location.href = "/confirmpassword.html?email="+email;
    }

    xhr.onerror = function() {
      alert('Error: An errror occured whilst loading the page.');
    };

    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(json));
}

function confirmCode(){
  var url = 'https://api.copordrop.co.uk/confirmPasswordCode';
  var password1 = document.getElementById("password1").value;
  var password2 = document.getElementById("password2").value;
  var code = document.getElementById("code").value;
  var email = window.location.href.split("email=")[1];


  if (!password1 == password2){
    document.getElementById("pass1").classList.add("signup-field-missing");
    $.alert({
      title: 'Please Note:',
      content: 'Passwords do not match.',
      boxWidth: '50%',
      useBootstrap: false,
      offsetBottom: 50
    });
  } else if (!validatePasswords(password1, password2)){
    document.getElementById("pass1").classList.add("signup-field-missing");
    // do nothing - html message pops up.
  } else {
    var json = {
      "username": email,
      "code": code,
      "password": password1
    }

    var xhr = createCORSRequest('POST', url);
    if (!xhr) {
      alert('CORS not supported');
      return;
    }

    // Response handlers.
    xhr.onload = function() {
      var response = xhr.response;
      document.getElementById("signupinputs").innerHTML = `
      <div class="successful-signup">Password successfully reset.<br></div>
      <div class="terms-title">Click <a href="/login.html">here</a> to login.</div>`
    }

    xhr.onerror = function() {
      alert('Error: An errror occured whilst loading the page.');
    };

    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(json));
  }
}

function validatePasswords(password1, password2){
  if (password1.toLowerCase() == password1 || password2.toLowerCase() == password2 || password1.toUpperCase() == password1 || password2.toUpperCase() == password2){
    return false
  } else {
    return true;
  }
}
