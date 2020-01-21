

function handleSignupSubmit(){
  validateInputs()
}

function validateInputs(){
  // console.log("validating inputs");

  var name = document.getElementById("name").value;
  var address1 = document.getElementById("address1").value;
  var postcode = document.getElementById("postcode").value;
  var country = document.getElementById("country").value;
  var phone = document.getElementById("phone").value;
  var email = document.getElementById("email").value;
  var dob = document.getElementById("dateofbirth").value;
  var password1 = document.getElementById("pass1").value;
  var password2 = document.getElementById("pass2").value;
  var insta = document.getElementById("insta").value;
  var datesplit = dob.split("-");

  if (!name){
    document.getElementById("name").classList.add("signup-field-missing");
    $.alert({
      title: 'Please Note:',
      content: 'A valid Name is required.',
      boxWidth: '50%',
      useBootstrap: false,
      offsetBottom: 50,
      onDestroy: function () {
        // before the modal is hidden.
        var elmnt = document.getElementById("signup-form");
        elmnt.scrollIntoView();
      }
    });
  } else if (!address1 || !validateAddress(address1)){
    document.getElementById("address1").classList.add("signup-field-missing");
    $.alert({
      title: 'Please Note:',
      content: 'A valid Address is required.',
      boxWidth: '50%',
      useBootstrap: false,
      offsetBottom: 50,
      onDestroy: function () {
        // before the modal is hidden.
        var elmnt = document.getElementById("address1");
        elmnt.scrollIntoView();
      }
    });
  } else if (!postcode || !validatePostcode(postcode)){
    document.getElementById("postcode").classList.add("signup-field-missing");
    $.alert({
      title: 'Please Note:',
      content: 'A valid Postcode is required.',
      boxWidth: '50%',
      useBootstrap: false,
      offsetBottom: 50,
      onDestroy: function () {
        // before the modal is hidden.
        var elmnt = document.getElementById("address2");
        elmnt.scrollIntoView();
      }
    });
  } else if (!country || !validateCountry(country)){
    document.getElementById("country").classList.add("signup-field-missing");
    $.alert({
      title: 'Please Note:',
      content: 'A valid Country is required.',
      boxWidth: '50%',
      useBootstrap: false,
      offsetBottom: 50,
      onDestroy: function () {
        // before the modal is hidden.
        var elmnt = document.getElementById("postcode");
        elmnt.scrollIntoView();
      }
    });
  } else if (!phone || !validatePhone(phone)){
    document.getElementById("phone").classList.add("signup-field-missing");
    $.alert({
      title: 'Please Note:',
      content: 'A valid phone number is required.',
      boxWidth: '50%',
      useBootstrap: false,
      offsetBottom: 50,
      onDestroy: function () {
        // before the modal is hidden.
        var elmnt = document.getElementById("country");
        elmnt.scrollIntoView();
      }
    });
  } else if (!email || !validateEmail(email)){
    document.getElementById("email").classList.add("signup-field-missing");
    $.alert({
      title: 'Please Note:',
      content: 'A valid email addresss is required.',
      boxWidth: '50%',
      useBootstrap: false,
      offsetBottom: 50,
      onDestroy: function () {
        // before the modal is hidden.
        var elmnt = document.getElementById("phone");
        elmnt.scrollIntoView();
      }
    });
  } else if (!dob){
      document.getElementById("dateofbirth").classList.add("signup-field-missing");
      $.alert({
        title: 'Please Note:',
        content: 'A valid date of birth is required.',
        boxWidth: '50%',
        useBootstrap: false,
        offsetBottom: 50
      });
  } else if (!isDate18orMoreYearsOld(parseInt(datesplit[2]), parseInt(datesplit[1]), parseInt(datesplit[0]))){
      document.getElementById("dateofbirth").classList.add("signup-field-missing");
      $.alert({
        title: 'Please Note:',
        content: 'You must be over 18 years old to sign up for an account.',
        boxWidth: '50%',
        useBootstrap: false,
        offsetBottom: 50
      });
    } else if (!pass1 == pass2){
      document.getElementById("pass1").classList.add("signup-field-missing");
      $.alert({
        title: 'Please Note:',
        content: 'Passwords do not match.',
        boxWidth: '50%',
        useBootstrap: false,
        offsetBottom: 50,
        onDestroy: function () {
          // before the modal is hidden.
          var elmnt = document.getElementById("dateofbirth");
          elmnt.scrollIntoView();
        }
      });
    } else if (!validatePasswords(password1, password2)){
      document.getElementById("pass1").classList.add("signup-field-missing");
      // do nothing - html message pops up.
    } else {
      // send information
      var json = JSON.stringify({
        name: name,
        address1: address1,
        address2: address2,
        postcode: postcode,
        country: country,
        phone: phone,
        email: email.toLowerCase(),
        dob: dob,
        password: password1,
        insta: insta
      });

      var url = 'https://api.copordrop.co.uk/signUpUser';

      var xhr = createCORSRequest('POST', url);
      if (!xhr) {
        alert('CORS not supported');
        return;
      }

      // Response handlers.
      xhr.onload = function() {
        var response = xhr.response;
        console.log(response);
        if (String(response).toLowerCase().includes("successfully") || response == null){
          confirmEmail(response, email.toLowerCase());
        } else if (JSON.stringify(response).includes("UsernameExistsException"))  {
          $.alert({
            title: 'Please Note:',
            content: 'A user with this email address already exists.',
            boxWidth: '50%',
            useBootstrap: false,
            offsetBottom: 50
          });
        } else {
          alert(JSON.stringify(response));
        }
      };

      xhr.onerror = function() {
        alert('Error: An errror occured whilst loading the page.');
      };

      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(json);
    }
}

function confirmEmail(response, email){
  document.location.href='/confirmEmail.html?email='+email;
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validatePhone(phone) {
    var re = /^(?:(?:\(?(?:0(?:0|11)\)?[\s-]?\(?|\+)44\)?[\s-]?(?:\(?0\)?[\s-]?)?)|(?:\(?0))(?:(?:\d{5}\)?[\s-]?\d{4,5})|(?:\d{4}\)?[\s-]?(?:\d{5}|\d{3}[\s-]?\d{3}))|(?:\d{3}\)?[\s-]?\d{3}[\s-]?\d{3,4})|(?:\d{2}\)?[\s-]?\d{4}[\s-]?\d{4}))(?:[\s-]?(?:x|ext\.?|\#)\d{3,4})?$/;
    return re.test(String(phone).toLowerCase());
}

function validateAddress(address) {
    var re = /^[a-z0-9A-Z ]{0,255}$/;
    return re.test(String(address).toLowerCase());
}

function validateCountry(country) {
    var re = /^[a-z0-9A-Z ]{0,50}$/;
    return re.test(String(country).toLowerCase());
}

function validatePostcode(postcode) {
    var re = /^[a-z0-9A-Z ]{4,10}$/;
    return re.test(String(postcode).toLowerCase());
}

function isDate18orMoreYearsOld(day, month, year) {
    return new Date(year+18, month-1, day) <= new Date();
}

function validatePasswords(password1, password2){
  if (password1.toLowerCase() == password1 || password2.toLowerCase() == password2 || password1.toUpperCase() == password1 || password2.toUpperCase() == password2){
    return false
  } else {
    return true;
  }
}
