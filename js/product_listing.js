function getProduct() {
  var url = 'http://cop-or-drop-env.smp7ifmpcm.eu-west-2.elasticbeanstalk.com/getItems';
  //get id out of url
  var data = JSON.stringify({
    "id": "5"
  });

  var xhr = createCORSRequest('GET', url);
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

    xhr.send(data);
  }

  function displayProduct(productResponse){
    var image = productResponse['s3Location'] + '/image1.jpg'
    console.log(image);
    document.getElementById("main-image").innerHTML = `
    <div class="column-18 w-col w-col-6 w-col-stack"><a href="#" class="lightbox-link hero w-inline-block w-lightbox"><img src="`+image+`" srcset="`+image+` 500w, `+image+` 800w, `+image+` 1080w, `+image+` 1194w" sizes="(max-width: 991px) 95vw, 42vw" alt="" class="hero"></a>
    `

  }
