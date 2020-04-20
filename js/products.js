function getProducts() {
  var url = 'https://api.copordrop.co.uk/getItems';
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
    alert('Error: An errror occured whilst loading the page.');
  };

  xhr.send();
}

function displayProducts(jsonResponse){
  for (var i = 0; i < Object.keys(jsonResponse).length; i ++){
      var item = jsonResponse[i]['items'];
      if (item['active']){
        var image = item['s3Location'] + '/image1.jpg'
        var description = item['description']
        var name = item['name'].replace(/_/g, " ");
        var id = item['id'];
        document.getElementById("product-wrap").innerHTML = document.getElementById("product-wrap").innerHTML + `
        <div class="product-item">
          <div class="div-block-12" id="`+name+`-button"><img src="`+image+`"  class="image-17"> 
            <div class="product-info-wrap"><a href="" onclick="toProductListing('`+id+`', '`+name+`')" class="button w-button">win this product &gt;</a>
              <div class="product-title">`+name+`</div>
              <!-- <div class="product-description">`+description+`</div> -->
            </div>
          </div>
        </div>`
      }
    }
}

function toProductListing(id, name){
   event.preventDefault()
   location.href = "competition-listing.html?name="+name+"&id="+id;
}
