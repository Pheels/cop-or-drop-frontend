function displayDocument(name){
  switch(name) {
    case 'privacy':
      var html = document.getElementById("privacycookies").innerHTML = `
        <div onclick="closeDocument('privacy')" class="h33 up">Privacy and cookies policy
        <img src="images/down.png" height="35px" width="35px" style="float:right"></div>
        <embed src="files/Privacy_and_Cookie_Policy.pdf" width="60%" height="750px" style="padding-bottom:50px" type="application/pdf">
        `
      break;
    case 'refund':
    var html = document.getElementById("refund").innerHTML = `
      <div onclick="closeDocument('refund')" class="h33 up">Refund Policy
      <img src="images/down.png" height="35px" width="35px" style="float:right"></div>
      <embed src="files/Refund_Policy.pdf" width="60%" height="750px" style="padding-bottom:50px" type="application/pdf">
      `
      break;
    case 'terms':
    var html = document.getElementById("termsconditions").innerHTML = `
      <div onclick="closeDocument('terms')" class="h33 up">Terms and Conditions
      <img src="images/down.png" height="35px" width="35px" style="float:right"></div>
      <embed src="files/Terms_and_Conditions.pdf" width="60%" height="750px" style="padding-bottom:50px" type="application/pdf">
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
    <div onclick="displayDocument('terms')"  class="h33">Terms and Conditions
    <img src="images/up.png" height="35px" width="35px" style="float:right"></div>`


      break
  }
}
