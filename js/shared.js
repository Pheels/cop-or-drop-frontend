function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
}


function matchFirstRegex(pattern, string){
  var match = pattern.exec(string);
  return match[0];
}

function loadCart(){
  var items = sessionStorage.getItem("cartItems");
  console.log(JSON.parse(items).length);
  if (items){
    document.getElementById("checkoutButton").innerHTML = `
    <i class="fa nav-link w-nav-link" style="font-size:23px">&#xf07a;</i>
    <span class='badge badge-warning nav-link w-nav-link' id='lblCartCount'>`+JSON.parse(items).length+`</span>
    `
  }
}
