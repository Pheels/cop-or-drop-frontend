function getProduct() {
  var url = 'http://localhost:8080/getIndividualItemByID';
  //get id and name from url query string
  var urlParams = new URLSearchParams(window.location.search);
  var id = matchFirstRegex(/id=.*/g, urlParams.toString()).replace("id=", "");

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
    localStorage.setItem('productInfo',JSON.stringify(response[0].items));
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

function purhaseButtonSelected(){
  // calculate price
  var product = JSON.parse(localStorage.getItem('productInfo'));
  var bids = JSON.parse(localStorage.getItem('bidsChosen'));
  var price = bids.length * (Number(product['price']) / Number(product['numberAllowedBids']));

  //check size of local storage array to get price
  //take payment
  //send api request to add bid
  //need to check that bids available just before payment
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

function swapImage(imagePath, thumb, id){
  console.log(imagePath + " " + thumb + " " + id);
  // get the main image and the current image path
  var mainImage = document.getElementById("image1");
  var mainImagePath = matchFirstRegex(/src=.*" srcset/g, mainImage.innerHTML).replace("src=\"", "").replace(" srcset", "").replace("\"", "");

  // get the small image and rewrite main image html
  var smallImage = document.getElementById(id);
  mainImage.innerHTML = `
  <img src="`+imagePath+`" srcset="`+imagePath+` 500w, `+imagePath+` 800w, `+imagePath+` 1080w, `+imagePath+` 1194w" sizes="(max-width: 991px) 95vw, 42vw" alt="" class="hero"></a>
  `
  // rewrite small image html
  smallImage.innerHTML = `
  <img onclick=swapImage("`+mainImagePath+`","`+thumb+`","`+id+`") src="`+mainImagePath +`" srcset="`+mainImagePath +` 500w, `+mainImagePath +` 800w, `+mainImagePath +` 1080w, `+mainImagePath+` 1194w" sizes="(max-width: 991px) 15vw, 7vw" alt="" class="thumb`+thumb+`">

  `
}

function displayImages(productResponse){
  var image1 = productResponse['s3Location'] + '/image1.jpg'

  // set main image
  document.getElementById("image1").innerHTML = `
  <img src="`+image1+`" srcset="`+image1+` 500w, `+image1+` 800w, `+image1+` 1080w, `+image1+` 1194w" sizes="(max-width: 991px) 95vw, 42vw" alt="" class="hero"></a>
  `

  // set smaller images
  for (var i=2; i <5; i++){
    var image = productResponse['s3Location'] + '/image'+i+'.jpg'
    document.getElementById("image"+i).innerHTML = `
    <img onclick=swapImage("`+image+`","thumb`+i+`","image`+i+`") src="`+image+`" srcset="`+image+` 500w, `+image+` 800w, `+image+` 1080w, `+image+` 1194w" sizes="(max-width: 991px) 15vw, 7vw" alt="" class="thumb`+i+`">
    `
  }
}
