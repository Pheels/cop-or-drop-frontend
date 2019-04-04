function getProduct() {
  var url = 'http://cop-or-drop-env.smp7ifmpcm.eu-west-2.elasticbeanstalk.com/getIndividualItemByID';
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
  getTicketsForItem(productResponse);
  displayImages(productResponse);
  displayProductName(productResponse['name']);
  displayInformation(productResponse);
}

function getTicketsForItem(productResponse){
  var url = 'http://cop-or-drop-env.smp7ifmpcm.eu-west-2.elasticbeanstalk.com/getTicketNumbers';
  var xhr = createCORSRequest('POST', url);
  // format json to get product
  var ticketsJson = JSON.stringify({
    item_name: productResponse['name']
  });


  if (!xhr) {
    alert('CORS not supported');
    return;
  }

  // Response handlers.
  xhr.onload = function() {
    var tickets = xhr.response;
    console.log(tickets);
    displayTickets(productResponse, tickets);
  };

  xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
  };

  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(ticketsJson);

}

function displayTickets(productResponse, tickets){

  // REMEMBER TO CHECK ticketS BEFORE ACCEPTING PAYMENT AS LOCAL STORAGE CAN BE EDITED

  // store ticketsChosen locally
  var ticketsChosen = [];
  localStorage.setItem('ticketsChosen',JSON.stringify(ticketsChosen));

  // store taken tickets
  var ticketsTaken;
  if (tickets['Size'] > 0){
    ticketsTaken = tickets['ticketNumbers'].split(",");
  }

    // do api call to get tickets for item and grey out already bought ones
    for (var i=1; i <= productResponse['numberAllowedTickets']; i++){
      var ticketNumber;
      if (i.toString().length < 2){
        //prepend zero
        ticketNumber = 0+ ""+i;
      } else {
        ticketNumber = i;
      }
      // store current html to avoid double lookup
      var ihtml = document.getElementById("raffle-buttons").innerHTML;

      if (ticketsTaken && ticketsTaken.includes(i.toString())){
        document.getElementById("raffle-buttons").innerHTML = ihtml + `
        <a id="raffle-button-`+ticketNumber+`" href="#" class="raffle-number-taken w-button-taken">`+ticketNumber+`</a>
        `
      } else {
        document.getElementById("raffle-buttons").innerHTML = ihtml + `
        <a id="raffle-button-`+ticketNumber+`" href="#" class="raffle-number w-button" onclick="buttonSelected('`+ticketNumber+`')">`+ticketNumber+`</a>
        `
      }
  }
}

function buttonSelected(ticketNumber){
  var button = document.getElementById("raffle-button-"+ticketNumber);

  //change css class
  var ticketChosenArr = JSON.parse(localStorage.getItem("ticketsChosen"));
  button.classList.toggle('raffle-number-chosen');
  if (button.classList.contains('raffle-number-chosen')){
    ticketChosenArr.push(ticketNumber);
  } else {
    ticketChosenArr = ticketChosenArr.filter(function(e) { return e !== ticketNumber })
  }
  console.log(ticketChosenArr);
  localStorage.setItem('ticketsChosen',JSON.stringify(ticketChosenArr));
}

function displayInformation(productResponse){
  document.getElementById("information").innerHTML =`
  <div class="product-price">Ticket Price: £`+(productResponse['price']/productResponse['numberAllowedTickets'])+`</div>
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

function displayQuestions(productResponse){

}

function purhaseButtonSelected(){
  // calculate price
  var product = JSON.parse(localStorage.getItem('productInfo'));
  var tickets = JSON.parse(localStorage.getItem('ticketsChosen'));
  var price = tickets.length * (Number(product['price']) / Number(product['numberAllowedtickets']));
  var idString = name+"_id";
  var timestamp = new Date().toLocaleString();
  var ticketsString = tickets.join(",");

  //send api request to add ticket
  var url = 'http://cop-or-drop-env.smp7ifmpcm.eu-west-2.elasticbeanstalk.com/postNewTickets';

  var jdata = {
    "name": product['name'],
    "userName": "Oliver",
    "timestamp": timestamp,
    "paymentId": "w4141d",
    "paymentMethod": "Stripe",
    "ticketNumbers": ticketsString
  };
  jdata[product['name']+"_id"] = product['id'];
  // format json to get product
  var jsondata = JSON.stringify(jdata);

  console.log(jsondata);

  var xhr = createCORSRequest('POST', url);
  if (!xhr) {
    alert('CORS not supported');
    return;
  }

  // Response handlers.
  xhr.onload = function() {
    var response = xhr.response;
    console.log(response);
    if (response.response == "Ticket(s) inserted successfully"){
      document.getElementById("raffle-buttons").innerHTML = `
      <div><h2><p style="text-align:center;">Thank you! Your submission has been received!</p></h2></div>
      `
      document.getElementById("submitButton").innerHTML = `
      `
    } else {
      alert(response.response);
    }
  };

  xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
  };

  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(jsondata);
}
