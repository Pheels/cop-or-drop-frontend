function getProducts() {
  var url = 'http://cop-or-drop-env.smp7ifmpcm.eu-west-2.elasticbeanstalk.com/getItems';
  var xhr = createCORSRequest('GET', url);
  if (!xhr) {
    alert('CORS not supported');
    return;
  }

  // Response handlers.
  xhr.onload = function() {
    var response = xhr.response;
    //console.log(response[0].items);
    displayProducts(response);
  };

  xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
  };

  xhr.send();
}



function displayProducts(jsonResponse){
  for (var i = 0; i < Object.keys(jsonResponse).length; i ++){
      var item = jsonResponse[i]['items'];
      var image = item['s3Location'] + '/image1.jpg'
      var description = item['description']
      var name = item['name'];
      var id = item['id'];
      document.getElementById("product-wrap").innerHTML = document.getElementById("product-wrap").innerHTML + `
      <div class="product-item">
        <div class="div-block-12" id="`+name+`-button"><img src="`+image+`" width="59" srcset="`+image+` 500w, `+image+` 800w, `+image+` 1080w, `+image+` 1194w" sizes="(max-width: 767px) 85vw, (max-width: 991px) 41vw, 25vw" alt="" class="image-17">
          <div class="product-info-wrap"><a href="" onclick="toProductListing('`+id+`', '`+name+`')" class="button w-button">view this product &gt;</a>
            <div class="product-title">`+name+`</div>
            <div class="product-description">`+description+`</div>
          </div>
        </div>
      </div>`
    }
}

function toProductListing(id, name){
   event.preventDefault()
   location.href = "product-listing.html?name="+name+"&id="+id;
}
