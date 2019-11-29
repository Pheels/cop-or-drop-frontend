function displayDocument(name){
  switch(name) {
    case 'privacy':
      var html = document.getElementById("privacycookies").innerHTML = `
        <div onclick="closeDocument('privacy')" class="h33 up">Privacy and cookies policy
        <img src="images/down.png" height="35px" width="35px" style="float:right"></div>
        <iframe src="https://drive.google.com/file/d/15M74lXZiV4708au-jjhkDYlGQ8Gi3wPX/preview" width="60%" height="580"</iframe>
        `
      break;
    case 'refund':
    var html = document.getElementById("refund").innerHTML = `
      <div onclick="closeDocument('refund')" class="h33 up">Refund Policy
      <img src="images/down.png" height="35px" width="35px" style="float:right"></div>
      <iframe src="https://drive.google.com/file/d/1ViGi71kio7QN3H_95rxYPza-pZcUxKxa/preview" width="60%" height="580"</iframe>
      `
      break;
    case 'terms':
    var html = document.getElementById("termsconditions").innerHTML = `
      <div onclick="closeDocument('terms')" class="h33 up">Terms and Conditions&nbsp&nbsp&nbsp&nbsp
      <img src="images/down.png" height="35px" width="35px" style="float:right"></div>
      <iframe src="https://drive.google.com/file/d/15M74lXZiV4708au-jjhkDYlGQ8Gi3wPX/preview" width="60%" height="580"</iframe>
      `
      break
    case 'copyright':
    var html = document.getElementById("copyright").innerHTML = `
      <div onclick="closeDocument('copyright')" class="h33 up">Copyright Policy&nbsp&nbsp&nbsp&nbsp
      <img src="images/down.png" height="35px" width="35px" style="float:right"></div>
      <iframe src="https://drive.google.com/file/d/1KMK9qKd4r3l-m3bL5yGPz6kfcVtDhpYD/preview" width="60%" height="580"</iframe>
      `
      break
  }
}

function closeDocument(name){
  switch(name) {
    case 'privacy':
    var html = document.getElementById("privacycookies").innerHTML = `
      <div onclick="displayDocument('privacy')"  class="h33">Privacy and cookies policy
      <img src="images/up.png" height="35px" width="35px" style="float:right"></div>`
      break;
    case 'refund':
    var html = document.getElementById("refund").innerHTML = `
      <div onclick="displayDocument('refund')"  class="h33">Refund policy
      <img src="images/up.png" height="35px" width="35px" style="float:right"></div>`
      break;
    case 'terms':
    var html = document.getElementById("termsconditions").innerHTML = `
    <div onclick="displayDocument('terms')"  class="h33">Terms and Conditions&nbsp&nbsp&nbsp&nbsp
    <img src="images/up.png" height="35px" width="35px" style="float:right"></div>`
      break
    case 'copyright':
      var html = document.getElementById("copyright").innerHTML = `
      <div onclick="displayDocument('copyright')"  class="h33">Copyright Policy&nbsp&nbsp&nbsp&nbsp
      <img src="images/up.png" height="35px" width="35px" style="float:right"></div>`
        break
  }
}
