function getCartItems(){
  var cartJson = JSON.parse(sessionStorage.getItem('cartItems'));

  if (cartJson){
    //set cart title
    document.getElementById("shopping-cart").innerHTML += `
    <!-- Title -->
    <div class="title-cart">
      Shopping Cart
    </div>
    `;

    for (var i = 0; i < Object.keys(cartJson).length; i ++){
      getProduct(cartJson[i]);
    }
    getTotalPrice(cartJson, function(response){
      document.getElementById("total-price-box").innerHTML = `
      <div class="total-price">Total Price: \xA3`+response['price']+`</div>`;
      updateItemPrices(cartJson, response);
    });
  } else {
    //nothing in cart
  }
}

function getProduct(cartJson) {
  var url = 'https://api.copordrop.co.uk/getIndividualItemByID';

  // format json to get product
  var jsondata = JSON.stringify({
    id: cartJson['id'].toString()
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
  var price = cartJson['ticketNumbers'].split(",").length * (Number(item['price']) / Number(item['numberAllowedTickets']));

  if (tickets.slice(-1) == ','){
    tickets = tickets.substring(0, tickets.length - 1);
  }

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
      <font color="#86939E" id='`+name+`-price-value'>\xA3`+price+`</font>
    </div>
    <div class="buttons">
      <span class="edit-btn" onclick="editItem('`+name+`')"></span>
    </div>
  </div>
`
}

function editItem(name){
  // set ticketsChosen
  var cartJson = JSON.parse(sessionStorage.getItem('cartItems'));
  var ticketsChosen = [];
  var newCartJson = [];
  var newUrl = 'https://copordrop.co.uk/product-listing.html?name='
  for(var i = 0; i < Object.keys(cartJson).length; i++) {
    // check that the name matches
    if (cartJson[i]['name'].replace("_", " ") == name){
      newUrl += cartJson[i]['name'].replace("_", "%20") + '&id='+cartJson[i]['id'] + '&fwd=true';
      var ticketSplit = cartJson[i]['ticketNumbers'].split(",");
      for (var x = 0; x < ticketSplit.length; x++) {
        ticketsChosen.push(String(ticketSplit[x]));
      }
      // cartJson[i]['ticketNumbers'] = "";
      // newCartJson.push(cartJson[i]);
    } else {
      newCartJson.push(cartJson[i]);
    }
  }

  sessionStorage.setItem('ticketsChosen', JSON.stringify(ticketsChosen));
  sessionStorage.setItem('cartItems', JSON.stringify(newCartJson));
  window.location.replace(newUrl);
}

function removeItem(name){
  document.getElementById(name+"-item").outerHTML = "";
  var cartJson = JSON.parse(sessionStorage.getItem('cartItems'));
  var total = sessionStorage.getItem('cartItems');
  var newCartJson = [];
  for (var i = 0; i < Object.keys(cartJson).length; i ++){
    if (!(cartJson[i]['name'].replace("_", " ") == name)){
      newCartJson.push(cartJson[i]);
    }
  }
  sessionStorage.setItem('cartItems', JSON.stringify(newCartJson));
  if (!newCartJson === undefined || !newCartJson.length == 0 ){
     getTotalPrice(newCartJson, function(response){
      document.getElementById("total-price-box").innerHTML = `
      <div class="total-price">Total Price: \xA3`+response['price']+`</div>`;
    });
  } else {
    document.getElementById("total-price-box").innerHTML = `
    <div class="total-price"></div>`;
  }
  loadCart();
}

function purchaseButtonSelected(){
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

    // add class loading
    document.getElementById("submitButton").innerHTML = `
    <a href="#" onclick=purchaseButtonSelected(); class="button purchase w-button">Loading...</a></div>
    `;

    // looping through items and confirming they are still available
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
                        action: window.stop(),
                        action: removeBids(data),
                        action: updateProductTickets(JSON.parse(sessionStorage.getItem('cartItems'))[index]),
                    }
                }
              });

            } else {
              cartItems = sessionStorage.getItem('cartItems');
              cartItems[index]['ticketsString'] = data['ticketsString'];
              sessionStorage.setItem('cartItems', cartItems);
            }
        });
    });
    // stop stripe if removing items.
    displayStripe(cartItems);
  }
}

function updateProductTickets(product){
  try {
    // add class loading
    document.getElementById(product['name'].replace('_',' ')+"-tickets").innerHTML = `
    <span>Tickets:<br></span>
    <font color="#86939E">`+product['ticketNumbers']+`</font>`;
  } catch(err) {
    // console.log(err.message);
  }
  var cartJson = JSON.parse(sessionStorage.getItem('cartItems'));

  getTotalPrice(cartJson, function(response){
    document.getElementById("total-price-box").innerHTML = `
    <div class="total-price">Total Price: \xA3`+response['price']+`</div>`;
    updateItemPrices(cartJson, response);
  });
}

function updateItemPrices(cartJson, prices){
  for (var i = 0; i < Object.keys(cartJson).length; i ++){
    try {
      document.getElementById(cartJson[i]['name'].replace("_", " ")+'-price-value').textContent ="\xA3"+prices[cartJson[i]['name']];
    } catch(err) {
      // console.log(err.message);
    }
  }
}

function getTotalPrice(cartJson, callback){
  var url = 'https://api.copordrop.co.uk/getTotalPrice';

  var xhr = createCORSRequest('POST', url);
  if (!xhr) {
    alert('CORS not supported');
    return;
  }

  // Response handlers.
  xhr.onload = function() {
    var response = xhr.response;
    callback(response);
  };

  xhr.onerror = function() {
    alert('Error: An errror occured whilst loading the page.');
  };

  xhr.setRequestHeader("Content-Type", "application/json");
  if (!cartJson === undefined || !cartJson.length == 0 ){
    xhr.send(JSON.stringify(cartJson));
  }
}

function removeBids(data){
  var cartItems = JSON.parse(sessionStorage.getItem('cartItems'));
  var cartItemsNew = cartItems;
  var ticketsTaken = data['ticketsTaken'].replace(' ','').split(',');
  var ticketsTakenNumbers = ticketsTaken.map(Number);

  // add class loading
  document.getElementById("submitButton").innerHTML = `
  <a href="#" onclick=purchaseButtonSelected(); class="button purchase w-button">PURCHASE TICKETS ></a></div>
  `;

  // go through every cart item
  for(var i = 0; i < cartItems.length; i++) {
    // check that the name matches
    if (cartItems[i]['name'] == data['name']){
      // split the ticketNumbers string
      var tickets = cartItems[i]['ticketNumbers'].split(',');
      var ticketsNumbers = tickets.map(Number);

      var ticketsFiltered = ticketsNumbers.filter(function(item) {
        return ticketsTakenNumbers.indexOf(item) < 0; // Returns true for items not found in b.
      });

      var ticketString = "";

      if (ticketsFiltered.length > 0){
        for (var x=0; x < ticketsFiltered.length; x++){
          if (ticketsFiltered[x] < 10){
            ticketString += "0" + ticketsFiltered[x] + ",";
          } else {
            ticketString += ticketsFiltered[x] + ",";
          }
        }
        ticketString = ticketString.substring(0, ticketString.length - 1);
        cartItemsNew[i]['ticketNumbers'] =  ticketString;
        sessionStorage.setItem('cartItems', JSON.stringify(cartItemsNew));

      } else {
        removeItem(cartItems[i]['name'].replace("_"," "));
        // remove item from document
      }


    }
  }
}

function removeByIndex(array, index){
    return array.filter(function(elem, _index){
        return index != _index;
    });
}

function finalCheckTickets(cartItem, jdata, callback){
  var url = 'https://api.copordrop.co.uk/checkTickets';
  var xhr = createCORSRequest('POST', url);
  if (!xhr) {
    alert('CORS not supported');
    return;
  }

  // Response handlers.
  xhr.onload = function() {
    var response = xhr.response;
    callback(response, jdata);
  };

  xhr.onerror = function() {
    alert('Error: An errror occured whilst loading the page.');
  };

  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(cartItem));

}

function displayStripe(){
    // ***** NOTE : REMOVE DUPLICATES FROM TICKET STRING ******* //

    var cartJson = JSON.parse(sessionStorage.getItem('cartItems'));

    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var name = cookies[i].split('=')[0].toLowerCase();
      var value = cookies[i].split('=')[1].toLowerCase();
    }

    getTotalPrice(cartJson, function(priceResponse){

      var products = [];
      for (var i = 0; i < Object.keys(cartJson).length; i++) {
        products.push(cartJson['name']);
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
                 stripePrice: priceResponse['price']*100,
                 item: products
               }
             }).done(function(stripeCustomer) {
               for (var i = 0; i < Object.keys(cartJson).length; i ++){
                 var timestamp = new Date().toLocaleString();
                 var jdata = {
                    "name": cartJson[i]['name'],
                    "userName": "Oliver",
                    "timestamp": timestamp,
                    "paymentMethod": "Stripe",
                    "paymentId": stripeCustomer.id,
                    "ticketNumbers": cartJson[i]['ticketNumbers']
                  };
                 finalCheckTickets(cartJson[i], jdata, function(result) {
                   if (result['ticketsTaken']){
                     $.confirm({
                       title: 'Unable to process payment: Ticket Number(s) ' + data['ticketsTaken'] + ' already taken for item ' + data['name']+'.',
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
                               action: removeBids(data),
                               action: updateProductTickets(JSON.parse(sessionStorage.getItem('cartItems'))[index]),
                           }
                       }
                     });
                   } else {
                     var url = 'https://api.copordrop.co.uk/postNewTickets';
                     var xhr = createCORSRequest('POST', url);
                     if (!xhr) {
                       alert('CORS not supported');
                       return;
                     }

                     xhr.onerror = function() {
                       alert('Error: An errror occured whilst loading the page.');
                     };

                     // Response handlers.
                     xhr.onload = function() {
                       var response = xhr.response;
                       if (response.response == "Ticket(s) inserted successfully"){
                         // do something to show all has been well
                       } else {
                         alert(response.response);
                       }
                     };

                     var jsondata = JSON.stringify(jdata);
                     console.log(jsondata);
                     xhr.send(jsondata);
                  }
                });
              }
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
           amount: priceResponse['price']*100,
           closed: function () {
             document.getElementById("submitButton").innerHTML = `
             <a href="#" onclick=purchaseButtonSelected(); class="button purchase w-button">PURCHASE TICKETS &gt;</a></div>
             `;
           }
         });
    });
}
