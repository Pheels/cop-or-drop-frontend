
function checkUrl(){
  var url = window.location.href;
  if (!url.includes("email=")){
    document.location.href = "/error.html"
  }
}



function sendConfirmationCode(){
  var confirmationCode = document.getElementById("confCode").value;

}


function successfulSignup(response){
  document.getElementById("signupinputs").innerHTML = `
  <div class="successful-signup">Congratulations, your account has successfully been created!<br></div>
  <div class="terms-title">Click <a href="/login.html">here</a> to login.</div>`
}
