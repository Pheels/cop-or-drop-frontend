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
  if (items){
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Samsung|SAMSUNG|Android/i.test(navigator.userAgent) ) {
      var navbar = document.getElementById("w-icon-nav-menu");
      if (navbar){
        navbar.innerHTML = `<i class="fa nav-link w-nav-link" style="font-size:23px">&#xf07a;</i>
        <span class='badge badge-warning nav-link w-nav-link' id='lblCartCount' href='checkout.html'>`+JSON.parse(items).length+`</span>`
        document.getElementById("checkoutButton").innerHTML = `
        <a href="checkout.html" class="nav-link w-nav-link" style='float:left;'>CHECKOUT</a>`
      }
    } else {
    document.getElementById("checkoutButton").innerHTML = `
    <i class="fa nav-link w-nav-link" style="font-size:23px">&#xf07a;</i>
    <span class='badge badge-warning nav-link w-nav-link' id='lblCartCount'>`+JSON.parse(items).length+`</span>
    `
    }
  }
}
