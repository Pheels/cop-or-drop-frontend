function getCartItems(){
  var cartJson = JSON.parse(sessionStorage.getItem('cartItems'));

  if (cartJson){
    sessionStorage.setItem('total', 0);
    //set cart title
    document.getElementById("shopping-cart").innerHTML += `
    <!-- Title -->
    <div class="title-cart">
      Shopping Cart
    </div>
    `;

    for (var i = 0; i < Object.keys(cartJson).length; i ++){
      // last item
      if (i == Object.keys(cartJson).length -1){
        getProduct(cartJson[i]['id'], cartJson[i], true);
      } else {
        getProduct(cartJson[i]['id'], cartJson[i], false);
      }
    }

  } else {
    //nothing in cart
  }
}

function getProduct(id, cartJson, lastItem, totalPrice) {
  var url = 'https://api.copordrop.co.uk/getIndividualItemByID';

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
    displayProduct(response[0].items, cartJson);
    var totalPrice = sessionStorage.getItem('total');
    if (lastItem){
      document.getElementById("total-price-box").innerHTML += `
      <div class="total-price">Total Price: \xA3`+totalPrice+`</div>`;
    }
    return totalPrice;
  };

  xhr.onerror = function() {
    alert('Error: An errror occured whilst loading the page.');
  };

  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(jsondata);
}

function displayProduct(item, cartJson){
  var image = item['s3Location'] + '/image1.jpg'
  var description = item['description']
  var name = item['name'].replace("_", " ");
  var tickets = cartJson['ticketNumbers'].replace(",", ", ");
  var totalPrice = cartJson['ticketNumbers'].split(",").length * (Number(item['price']) / Number(item['numberAllowedTickets']));
  var total = sessionStorage.getItem('total');
  sessionStorage.setItem('total', Number(total) + Number(totalPrice));

  document.getElementById("shopping-cart").innerHTML += `
   <div class="item" id="`+name+`-item">
    <div class="buttons">
      <span class="delete-btn" onclick="removeItem('`+name+`')"></span>
    </div>

    <div class="product-image" id="`+name+`-image" >
      <img src="`+image+`" alt="" Style="width:120px;height:80px;"/>
    </div>

    <div class="description" id="`+name+`-description">
      <span>`+name+`</span>
      <span></span>
    </div>

    <div class="tickets" id="`+name+`-tickets">
      <span>Tickets:<br></span>
      <font color="#86939E">`+tickets+`</font>
    </div>

    <div class="item-price" id="`+name+`-price">
      <span>Price:<br></span>
        <font color="#86939E" id='`+name+`-price-value'>\xA3`+totalPrice+`</font></div>
    <div class="buttons">
      <span class="edit-btn"></span>
    </div>
  </div>
`
  console.log(item);
  console.log(cartJson);
  return totalPrice;
}

function removeItem(name){
  var tprice = Number(document.getElementById(name+'-price-value').textContent.replace("\xA3", ""));
  document.getElementById(name+"-item").outerHTML = "";
  var cartJson = JSON.parse(sessionStorage.getItem('cartItems'));
  var total = sessionStorage.getItem('cartItems');
  var newCartJson = [];
  for (var i = 0; i < Object.keys(cartJson).length; i ++){
    if (cartJson[i]['name'].replace("_", " ") == name){
      sessionStorage.setItem('total', Number(sessionStorage.getItem('total'))-tprice);
      document.getElementById("total-price-box").innerHTML = `
      <div class="total-price">Total Price: \xA3`+sessionStorage.getItem('total')+`</div>`;

      // do nothing
    } else {
      newCartJson.push(cartJson[i]);
    }
  }
  sessionStorage.setItem('cartItems', JSON.stringify(newCartJson));
  loadCart();
}

function purhaseButtonSelected(){
  console.log(getCookieValue("name"));
  // no answer selected
  if (document.getElementById("termscheckbox").checked == false){
    $.alert({
      title: 'Please Note:',
      content: 'You must agree to the terms and conditions in order to participate.',
      boxWidth: '50%',
      useBootstrap: false,
      offsetBottom: 70,
      onDestroy: function () {
        // before the modal is hidden.
        var elmnt = document.getElementById("termscheckbox");
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

        }
      });
  } else if (1 == 1) {
    // length greater than 2 as otherwise just empty brackets.

    // add class loading
    document.getElementById("submitButton").innerHTML = `
    <a href="#" onclick=purhaseButtonSelected(); class="button purchase w-button">Loading...</a></div>
    `;

    // ***** NOTE : REMOVE DUPLICATES FROM TICKET STRING ******* //

    // get total price
      //send api request to add ticket
      var ticketsString = tickets.join(",");
      var url = 'https://api.copordrop.co.uk/postNewTickets';

      // should this not be answerResponse and not session storage?
      if (sessionStorage.getItem('answer') == 'false'){
        ticketsString = "";
        for (var l=0; l < tickets.length; l++){
          ticketsString += "0,"
        }
        ticketsString= ticketsString.substring(0, ticketsString.length - 1);
      }

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
          document.getElementById("submitButton").remove();
          document.getElementById("questions").remove();
        } else {
          alert(response.response);
        }
      };

      xhr.onerror = function() {
        alert('Error: An errror occured whilst loading the page.');
      };
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var name = cookies[i].split('=')[0].toLowerCase();
        var value = cookies[i].split('=')[1].toLowerCase();
        if (name === 'email'){
          console.log(value);
        }

      }

      // configure stripe handler
      var handler = StripeCheckout.configure({
        key: 'pk_test_7YtUrmQsMxOWEHuVtbCPfccO000KeLEQHe',
        image: '',
        locale: 'auto',
        shippingAddress: true,
        billingAddress: true,
        email: getCookieValue("email"),
        token: function(token) {
            $.ajax({
              url: 'https://api.copordrop.co.uk/postNewPayment',
              type: 'POST',
              data: {
                stripeToken: token.id,
                stripePrice: price*100,
                item: product['name']
              }
            }).done(function(stripeCustomer) {
              var jdata = {
                "name": product['name'],
                "userName": "Oliver",
                "timestamp": timestamp,
                "paymentMethod": "Stripe",
                "paymentId": stripeCustomer.id,
                "ticketNumbers": ticketsString
              };
              var jsondata = JSON.stringify(jdata);
              console.log(jsondata);
              xhr.setRequestHeader("Content-Type", "application/json");
              xhr.send(jsondata);
            }).fail(function(e) {
              alert('There was an error processing the payment. Please try again.')
            });
            }
        });

        // open stripe handler
        event.preventDefault()
        handler.open({
          name: 'CopOrDrop',
          description: '',
          currency: 'gbp',
          amount: price*100,
          closed: function () {
            document.getElementById("submitButton").innerHTML = `
            <a href="#" onclick=purhaseButtonSelected(); class="button purchase w-button">PURCHASE TICKETS &gt;</a></div>
            `;
          }
        });
  }
}
