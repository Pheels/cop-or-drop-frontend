function submitEmail(){
  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var message = document.getElementById("message").value;

  if ((name && typeof name !== 'undefined') && (email && typeof email !== 'undefined') && (message && typeof message !== 'undefined')) {
    var url = 'http://cop-or-drop-env.smp7ifmpcm.eu-west-2.elasticbeanstalk.com/sendEmail';
    var xhr = createCORSRequest('POST', url);
    // format json to get product
    var emailJson = JSON.stringify({
      name: name,
      email: email,
      message: message
    });


    if (!xhr) {
      alert('CORS not supported');
      return;
    }

    // Response handlers.
    xhr.onload = function() {
      var response = xhr.response;
      console.log(response);
      document.getElementById("email-form").reset();

      var emailForm = document.getElementById("emailFormBox");
      emailForm.innerHTML = `
      <div>Thank you! Your submission has been received!</div>
      `
    };

    xhr.onerror = function() {
      alert('Woops, there was an error making the request.');
    };

    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(emailJson);
  } else {
    var emailForm = document.getElementById("submitButtonFail");
    emailForm.innerHTML = `
    <div id="submitButtonFail"  class="w-form-fail">
      <div>Oops! Something went wrong while submitting the form.</div>
    </div>
    `
    console.log("Name: " +name +"\nEmail: " + email+ "\nMessage: " + message);
  }
}
