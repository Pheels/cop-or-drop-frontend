function getProduct() {
  var url = 'http://localhost:8080/getIndividualItemByID';
  //get id out of url
  var urlParams = new URLSearchParams(window.location.search);
  var idMatch = /id=.*/g;
  var match = idMatch.exec(urlParams.toString());
  var id = match[0].replace("id=", "");
  var jsondata = JSON.stringify({
    id: id.toString()
  });

  var xhr = createCORSRequest('POST', url);
  if (!xhr) {
    alert('CORS not supported');
    return;
  }

  // Response handlers.
  xhr.onload = function() {
    var response = xhr.response;
    console.log(response[0].items);
    displayProduct(response[0].items);
  };

  xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
  };
  console.log(jsondata);
  if (id){
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(jsondata);
  }
}

function displayProduct(productResponse){
  displayImages(productResponse);
  displayProductName(productResponse['name']);
  displayInformation(productResponse);
}

function displayInformation(productResponse){
  console.log(typeof productResponse['price']);
  document.getElementById("information").innerHTML =`
  <div class="product-price">Ticket Price: £`+(productResponse['price']/productResponse['numberAllowedBids'])+`</div>
  <div class="product-worth">Worth: £`+productResponse['price']+`</div>
  <div class="product-description-long">`+productResponse['description']+`<br></div>
  `


}

function displayProductName(name){
  document.getElementById("title").innerHTML =`
    <title>`+name.replace("_", " ")+`</title>
  `
  document.getElementById("product-name").innerHTML =`
  <div class="h1">`+name.replace("_", " ")+`</div>
  `
}

function displayImages(productResponse){
  var image = productResponse['s3Location'] + '/image1.jpg'
  var image2 = productResponse['s3Location'] + '/image2.jpg'
  var image3 = productResponse['s3Location'] + '/image3.jpg'
  var image4 = productResponse['s3Location'] + '/image4.jpg'

  document.getElementById("main-image").innerHTML = `
  <img src="`+image+`" srcset="`+image+` 500w, `+image+` 800w, `+image+` 1080w, `+image+` 1194w" sizes="(max-width: 991px) 95vw, 42vw" alt="" class="hero"></a>
  `

  document.getElementById("second-image").innerHTML = `
  <img src="`+image2+`" srcset="`+image2+` 500w, `+image2+` 800w, `+image2+` 1080w, `+image2+` 1194w" sizes="(max-width: 991px) 15vw, 7vw" alt="" class="thumb1">
  `

  document.getElementById("third-image").innerHTML = `
  <img src="`+image3+`" srcset="`+image3+` 500w, `+image3+` 800w, `+image3+` 1080w, `+image3+` 1194w" sizes="(max-width: 991px) 15vw, 7vw" alt="" class="thumb2">
  `
  document.getElementById("fourth-image").innerHTML = `
  <img src="`+image4+`" srcset="`+image4+` 500w, `+image4+` 800w, `+image4+` 1080w, `+image4+` 1194w" sizes="(max-width: 991px) 15vw, 7vw" alt="" class="thumb3">
  `
}
