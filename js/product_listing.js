function getProduct() {
  var url = 'http://localhost:8080/getIndividualItemByID';
  //get id and name from url query string
  var urlParams = new URLSearchParams(window.location.search);
  var id = matchUrlRegex(/id=.*/g, urlParams.toString()).replace("id=", "");

  // format json to get product
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

  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(jsondata);
}

function displayProduct(productResponse){
  getBidsForItem(productResponse);
  displayImages(productResponse);
  displayProductName(productResponse['name']);
  displayInformation(productResponse);
}

function getBidsForItem(productResponse){
  var url = 'http://localhost:8080/getBidNumbers';
  var xhr = createCORSRequest('POST', url);
  // format json to get product
  var bidsJson = JSON.stringify({
    item_name: productResponse['name']
  });


  if (!xhr) {
    alert('CORS not supported');
    return;
  }

  // Response handlers.
  xhr.onload = function() {
    var bids = xhr.response;
    console.log(bids);
    displayBids(productResponse, bids);
  };

  xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
  };

  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(bidsJson);

}

function displayBids(productResponse, bids){
  // REMEMBER TO CHECK BIDS BEFORE ACCEPTING PAYMENT AS LOCAL STORAGE CAN BE EDITED

  // store bidsChosen locally
  var bidsChosen = [];
  localStorage.setItem('bidsChosen',JSON.stringify(bidsChosen));

  // store taken bids
  var bidsTaken;
  if (bids['Size'] > 0){
    bidsTaken = bids['bidNumbers'].split(",");
  }

  // do api call to get bids for item and grey out already bought ones
  for (var i=1; i <= productResponse['numberAllowedBids']; i++){
    var bidNumber;
    if (i.toString().length < 2){
      //prepend zero
      bidNumber = 0+ ""+i;
    } else {
      bidNumber = i;
    }
    // store current html to avoid double lookup
    var ihtml = document.getElementById("raffle-buttons").innerHTML;
    if (bidsTaken.includes(i.toString())){
      document.getElementById("raffle-buttons").innerHTML = ihtml + `
      <a id="raffle-button-`+bidNumber+`" href="#" class="raffle-number-taken w-button-taken">`+bidNumber+`</a>
      `
    } else {
      document.getElementById("raffle-buttons").innerHTML = ihtml + `
      <a id="raffle-button-`+bidNumber+`" href="#" class="raffle-number w-button" onclick="buttonSelected('`+bidNumber+`')">`+bidNumber+`</a>
      `
    }
  }
}

function buttonSelected(bidNumber){
  var button = document.getElementById("raffle-button-"+bidNumber);

  //change css class
  var bidChosenArr = JSON.parse(localStorage.getItem("bidsChosen"));
  console.log(bidChosenArr);
  button.classList.toggle('raffle-number-chosen');
  if (button.classList.contains('raffle-number-chosen')){
    bidChosenArr.push(bidNumber);
  } else {
    bidChosenArr = bidChosenArr.filter(function(e) { return e !== bidNumber })
  }
  console.log(bidChosenArr);
  localStorage.setItem('bidsChosen',JSON.stringify(bidChosenArr));
}

function displayInformation(productResponse){
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
