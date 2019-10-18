function getProduct() {
  sessionStorage.removeItem("questionSelected");

  sessionStorage.removeItem('answer');
  var fwd = true;
  var url = 'https://api.copordrop.co.uk/getIndividualItemByID';
  //get id and name from url query string
  var urlParams = new URLSearchParams(window.location.search);
  if (!(urlParams.toString().includes('fwd=true'))){
    sessionStorage.removeItem('ticketsChosen');
    fwd = false;
  }
  var id = matchFirstRegex(/id=[0-9]+/g, urlParams.toString()).replace("id=", "");

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
    sessionStorage.setItem('productInfo',JSON.stringify(response[0].items));
    displayProduct(response[0].items, fwd);
  };

  xhr.onerror = function() {
    alert('Error: An errror occured whilst loading the page.');
  };

  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(jsondata);
}

function displayProduct(productResponse, fwd){
  getTicketsForItem(productResponse, fwd);
  displayImages(productResponse);
  displayProductName(productResponse['name']);
  displayInformation(productResponse);
  displayQuestions(productResponse);
}

function getTicketsForItem(productResponse, fwd){
  var url = 'https://api.copordrop.co.uk/getTicketNumbers';
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
    displayTickets(productResponse, tickets, fwd);
  };

  xhr.onerror = function() {
    alert('Error: An errror occured whilst loading the page.');
  };

  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(ticketsJson);

}

function displayTickets(productResponse, tickets, fwd){

  if (fwd == false) {
    // store ticketsChosen locally
    var ticketsChosen = [];
    sessionStorage.setItem('ticketsChosen',JSON.stringify(ticketsChosen));
  }  else {
    var ticketsChosen = JSON.parse(sessionStorage.getItem('ticketsChosen'));
  }

  // store taken tickets
  var ticketsTaken;
  if (tickets['Size'] > 0){
    ticketsTaken = tickets['ticketNumbers'].split(",");
  }
  // // check if number of tickets greater than 60 - split them up
  // if (productResponse['numberAllowedTickets'] > 60){
  //   var numberSplits = Math.ceil(productResponse['numberAllowedTickets'] / 60);
  //   for (var x= 0; x <= numberSplits; x++){
  //     document.getElementById("ticketNumberSections").innerHTML = ihtml + `
  //
  //     `
  //   }
  //
  // } else {

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
      // }
    }
  }
  if (fwd == true){
    for (var i = 0; i < ticketsChosen.length; i++){
      console.log(ticketsChosen[i]);
      buttonSelected(ticketsChosen[i]);
    }
  }
  blockTickets();
  loadCart();
}

function buttonSelected(ticketNumber){
  var button = document.getElementById("raffle-button-"+ticketNumber);

  //change css class
  var ticketChosenArr = JSON.parse(sessionStorage.getItem("ticketsChosen"));
  button.classList.toggle('raffle-number-chosen');
  if (button.classList.contains('raffle-number-chosen')){
    ticketChosenArr.push(ticketNumber);
  } else {
    ticketChosenArr = ticketChosenArr.filter(function(e) { return e !== ticketNumber })
  }
  var uniqueArray = ticketChosenArr.filter(function(elem, index, self) {
    return index === self.indexOf(elem);
  });
  sessionStorage.setItem('ticketsChosen',JSON.stringify(uniqueArray));
}

function displayInformation(productResponse){
  var price = (productResponse['price']/productResponse['numberAllowedTickets']).toFixed(2);
  document.getElementById("information").innerHTML =`
  <div class="product-price">Ticket Price: &pound;`+price+`</div>
  <div class="product-worth">RRP: &pound;`+productResponse['rrp']+`</div>
  <div class="product-description-long"><p id="timer"></p><br>`+productResponse['description'].replace(/\n/g, "<br>")+`<br></div>
  `;
  setTimer(productResponse);
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

function setTimer(productResponse){
  // Set the date we're counting down to
  var date = new Date(Date.parse(productResponse['created']));
  date = date.addDays(productResponse['countdown']);
  // var countDownDate = new Date("Jan 5, 2021 15:37:25").getTime();
  // var countDownDate = date.toLocaleDateString("en-US", options).getTime();
  var countDownDate = date.getTime();

  // Update the count down every 1 second
  var x = setInterval(function() {

    var now = new Date().getTime();
    // console.log('from ' + countFrom + ' to ' + countDownDate);
    var distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the result in the element with id="demo"
    document.getElementById("timer").innerHTML = days + "d " + hours + "h "
    + minutes + "m " + seconds + "s ";

    // If the count down is finished, write some text
    if (distance < 0) {
      // call endpoint here
      clearInterval(x);
      var url = 'https://api.copordrop.co.uk/incTimerResets';
      var xhr = createCORSRequest('POST', url);
      // format json to get product
      var ticketsJson = JSON.stringify({
        id: productResponse['id'],
        numberAllowedTickets: productResponse['numberAllowedTickets'],
        name: productResponse['name']
      });

      if (!xhr) {
        alert('CORS not supported');
        return;
      }

      // Response handlers.
      xhr.onload = function() {
        var resp = xhr.response;
        if (resp.maxIncrements == true){
          document.getElementById("timer").innerHTML = "EXPIRED";
        } else {
          location.reload();
        }
      };

      xhr.onerror = function() {
        alert('Error: An errror occured whilst loading the page.');
      };

      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(ticketsJson);

    }
  }, 1000);
}

function displayProductName(name){
  document.getElementById("title").innerHTML =`
    <title>`+name.replace(/_/g, " ")+`</title>
  `
  document.getElementById("product-name").innerHTML =`
  <div class="h9">`+name.replace(/_/g, " ");+`</div>
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
  if (!(productResponse['question'].includes("?"))){
    productResponse['question'] = productResponse['question'] +"?"
  }

  //set question
  document.getElementById("question").innerHTML = `
  <label for="name" class="competitiong-question">`+productResponse['question']+`</label>
  `
  document.getElementById("answer1").innerHTML = `
  <div class="checkbox-field w-checkbox"><input type="checkbox" onclick="selectOnlyThis(this.id)" id="checkbox-1" name="checkbox-1" data-name="Checkbox" class="checkbox w-checkbox-input">
  <label for="checkbox-1" class="p w-form-label">`+productResponse['answer1']+`</label></div>
  `
  document.getElementById("answer2").innerHTML = `
  <div class="checkbox-field w-checkbox"><input type="checkbox" onclick="selectOnlyThis(this.id)" id="checkbox-2" name="checkbox-2" data-name="Checkbox 2" class="checkbox w-checkbox-input">
  <label for="checkbox-2" class="p w-form-label">`+productResponse['answer2']+`</label></div>
  `
  if (productResponse['answer3'] !== ""){
    document.getElementById("answer3").innerHTML = `
    <div class="checkbox-field w-checkbox"><input type="checkbox" onclick="selectOnlyThis(this.id)" id="checkbox-3" name="checkbox-3" data-name="Checkbox 3" class="checkbox w-checkbox-input">
    <label for="checkbox-3" class="p w-form-label">`+productResponse['answer3']+`</label></div>
    `
  }

  if (productResponse['answer4'] !== ""){
    document.getElementById("answer4").innerHTML = `
    <div class="checkbox-field w-checkbox"><input type="checkbox" onclick="selectOnlyThis(this.id)" id="checkbox-4" name="checkbox-4" data-name="Checkbox 4" class="checkbox w-checkbox-input">
    <label for="checkbox-4" class="p w-form-label">`+productResponse['answer4']+`</label></div>`
  }

  var questionImage = productResponse['s3Location'] + '/question.jpg'
  document.getElementById("question-image").innerHTML = `
  <img src="`+questionImage+`" srcset="`+questionImage+` 500w, `+questionImage+` 800w, `+questionImage+` 1080w, `+questionImage+` 1194w" sizes="(max-width: 991px) 95vw, 42vw" alt="" class="hero">
  `

}

function selectOnlyThis(id) {
    if (document.getElementById(id).checked){
      var numberBoxes = document.getElementsByTagName('input').length;
      for (var i = 1;i <= numberBoxes; i++){
          document.getElementById("checkbox-"+i).checked = false;
      }
      document.getElementById(id).checked = true;
      sessionStorage.setItem('questionSelected', "answer"+id.charAt(id.length-1));
    } else {
      document.getElementById(id).checked = false;
      sessionStorage.removeItem("questionSelected");
    }
}

function checkCorrectAnswer(id, answer, callback){
  var url = 'https://api.copordrop.co.uk/checkCorrectAnswer';
  var jdata = {
    "id": id,
    "answer": answer
  };
  var jsondata = JSON.stringify(jdata);
  var xhr = createCORSRequest('POST', url);
  if (!xhr) {
    alert('CORS not supported');
    return;
  }

  // Response handlers.
  xhr.onload = function() {
    var response = xhr.response;
    sessionStorage.setItem('answer', response['answer']);
    callback();
  };

  xhr.onerror = function() {
    alert('Error: An errror occured whilst loading the page.');
  };

  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(jsondata);
}

function purhaseButtonSelected(){
  // no answer selected
  if (!sessionStorage.getItem('questionSelected')){
    $.alert({
      title: 'Please Note:',
      content: 'You must answer the question before you can enter the competition.',
      boxWidth: '50%',
      useBootstrap: false,
      offsetBottom: 60,
      onDestroy: function () {
        // before the modal is hidden.
        var elmnt = document.getElementById("questions");
        elmnt.scrollIntoView();
      }
    });
  } else if (getCookieValue("name") == ""){
      $.alert({
        title: 'Please Note:',
        content: 'You must be signed in to participate.',
        boxWidth: '50%',
        useBootstrap: false,
        offsetBottom: 70,
        onDestroy: function () {
          // before the modal is hidden.
          var elmnt = document.getElementById("questions");
          elmnt.scrollIntoView();
        }
      });
      // $.confirm({
      //   title: 'Please Note:',
      //   content: 'You must be signed in to participate.',
      //   typeAnimated: true,
      //   boxWidth: '50%',
      //   useBootstrap: false,
      //   offsetBottom: 50,
      //   escapeKey: true,
      //   buttons: {
      //       Ok: {
      //           text: 'Sign In'
      //       }
      //   }
      // });
  } else if (sessionStorage.getItem('ticketsChosen') && (sessionStorage.getItem('ticketsChosen').length > 2)) {
    // length greater than 2 as otherwise just empty brackets.

    // calculate price
    var product = JSON.parse(sessionStorage.getItem('productInfo'));
    var ticketsArr = JSON.parse(sessionStorage.getItem('ticketsChosen'));
    var tickets = ticketsArr.filter(function(elem, index, self) {
      return index === self.indexOf(elem);
    });
    var price = tickets.length * (Number(product['price']) / Number(product['numberAllowedTickets']));
    var timestamp = new Date().toLocaleString();
    var cartJson = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    var ticketsString = tickets.join(",");

    var itemInCart = false;
    for (var i = 0; i < Object.keys(cartJson).length; i ++){
      if (cartJson[i]['name'] == product['name']){
        itemInCart = true;
        // split ticketsString
        cartJson[i]['ticketNumbers'] += "," + ticketsString;
      }
      sessionStorage.setItem('cartItems', JSON.stringify(cartJson));
    }
    if (itemInCart == false){
      // push new item to cart
      var jdata = {
        "name": product['name'],
        "userName": getCookieValue("name"),
        "timestamp": timestamp,
        "ticketNumbers": tickets.join(","),
        "id": product['id'],
        "answer": sessionStorage.getItem('questionSelected')
      };
      cartJson.push(jdata);
      sessionStorage.setItem('cartItems', JSON.stringify(cartJson));
    }
    loadCart();
    blockTickets();
    document.getElementById("submitButton").text = `
    <a href="#" onclick=purhaseButtonSelected(); class="button purchase w-button">ADDED TO CART!</a></div>
    `
    var ticketsChosen = [];
    sessionStorage.setItem('ticketsChosen',JSON.stringify(ticketsChosen));

  // no bids selected
  } else {
    $.alert({
      title: 'Please Note:',
      content: 'You must chose at least one valid bid number before continuing.',
      boxWidth: '50%',
      useBootstrap: false,
      offsetBottom: 60,
      onDestroy: function () {
        // before the modal is hidden.
        var elmnt = document.getElementById("raffle-title");
        elmnt.scrollIntoView();
      }
    });
  }
}

function getCookieValue(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function blockTickets(){
  var cartJson = JSON.parse(sessionStorage.getItem("cartItems"));
  var product = JSON.parse(sessionStorage.getItem('productInfo'));

  if (cartJson){
    for (var i = 0; i < Object.keys(cartJson).length; i ++){
      if (cartJson[i]['name'] == product['name']){
        var ticketNumbers = cartJson[i]['ticketNumbers'].replace(" ", "").split(",");
        for (var x = 0; x < ticketNumbers.length; x++){
          document.getElementById("raffle-button-"+ticketNumbers[x]).outerHTML = `
          <a id="raffle-button-`+ticketNumbers[x]+`" href="#" class="raffle-number-taken w-button-taken">`+ticketNumbers[x]+`</a>
          `;
        }
      }
    }
  }
}
