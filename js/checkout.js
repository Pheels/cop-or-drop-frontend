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
      // calculate total price (api call)

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
  if (tickets.slice(-1) == ','){
    tickets = tickets.substring(0, tickets.length - 1);
  }
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
      offsetBottom: 50
    });
  } else if (getCookieValue("name") == ""){
      $.alert({
        title: 'Please Note:',
        content: 'You must be signed in to participate.',
        boxWidth: '50%',
        useBootstrap: false,
        offsetBottom: 60,
        onDestroy: function () {
        }
      });
  } else {
    var url = 'https://api.copordrop.co.uk/checkTickets';
    var cartItems = JSON.parse(sessionStorage.getItem('cartItems'));
    // var cartItemsNew = []

    // add class loading
    document.getElementById("submitButton").innerHTML = `
    <a href="#" onclick=purhaseButtonSelected(); class="button purchase w-button">Loading...</a></div>
    `;

    $.each(cartItems, function(index, val) {
        JSON.stringify(val);
        $.post(url, val)
         .done(function (data) {
            if (data['ticketsTaken']){
              $.confirm({
                title: 'Ticket Number(s) ' + data['ticketsTaken'] + ' already taken for item ' + data['name']+'.',
                content: 'These tickets have been removed from your basket..',
                typeAnimated: true,
                boxWidth: '50%',
                useBootstrap: false,
                offsetBottom: 50,
                escapeKey: true,
                buttons: {
                    Ok: {
                        text: 'Ok',
                        btnClass: 'btn-default',
                        action: removeBids(data)
                    }
                }
              });
            } else {
              cartItems = sessionStorage.getItem('cartItems');
              cartItems[index]['ticketsString'] = data['ticketsString'];
              sessionStorage.setItem('cartItems', cartItems);
            }
            updateProductTickets(JSON.parse(sessionStorage.getItem('cartItems'))[index]);
        });

    });
    // console.log(sessionStorage.getItem('cartItems'));
  }
}

function updateProductTickets(product){
  // add class loading
  console.log(product['name'].replace('_',' ')+"-tickets");
  document.getElementById(product['name'].replace('_',' ')+"-tickets").innerHTML = `
  <span>Tickets:<br></span>
  <font color="#86939E">`+product['ticketNumbers']+`</font>`;


  // document.getElementById("total-price-box").innerHTML += `
  // <div class="total-price">Total Price: \xA3`+totalPrice+`</div>`;
  // console.log(product);
}

function getTotalPrice(){
  var url = 'https://api.copordrop.co.uk/getTotalPrice';

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
      // calculate total price (api call)

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

function removeBids(data){
  var cartItems = JSON.parse(sessionStorage.getItem('cartItems'));
  var ticketsTaken = data['ticketsTaken'].split(',');
  var cartItemsNew = cartItems;

  // go through every cart item
  for(var i = 0; i < cartItems.length; i++) {
    // check that the name matches
    if (cartItems[i]['name'] == data['name']){
      // split the ticketNumbers string
      var tickets = cartItems[i]['ticketNumbers'].split(',');
      // go through all ticket numbers
      for (var x = 0; x < tickets.length; x++){
        //go throught tickets taken
        for (var y = 0; y < ticketsTaken.length; x++){
          // check if ticket numbers match
          if (parseInt(tickets[x], 10) == parseInt(ticketsTaken[y], 10)){
            cartItemsNew[i]['ticketNumbers'] = removeByIndex(tickets, x).join(',');
            sessionStorage.setItem('cartItems', JSON.stringify(cartItemsNew));
            console.log(sessionStorage.getItem('cartItems'));
            return;
          }
          // remove item(s) from tickets, (be careful of 0), and join them again.
        }
      }
    }
  }

}

function removeByIndex(array, index){
    return array.filter(function(elem, _index){
        return index != _index;
    });
}

function displayStripe(){
  // get total price
    //send api request to add ticket
    // ***** NOTE : REMOVE DUPLICATES FROM TICKET STRING ******* //
    var ticketsString = tickets.join(",");
    var url = 'https://api.copordrop.co.uk/postNewTickets';

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
