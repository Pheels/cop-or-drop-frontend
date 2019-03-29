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


function matchUrlRegex(pattern, string){
  var match = pattern.exec(string);
  return match[0];
}
