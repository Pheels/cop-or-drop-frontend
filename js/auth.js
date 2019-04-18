function handleAuth(){
  var url = 'http://localhost:8081/confirmValidJWT'
  /*
    if token in url, confirm it is valid
      if valid, change nav button to logout
        store non-sensitive information in local storage - name etc.
      else, do nothing
    else do nothing

    must require login for payment etc too

  */

  //  var urlParams = new URLSearchParams(window.location.search);
  var urlParams = `#id_token=eyJraWQiOiJjODVuYVNkZEQ5dnZ2RGJBdzZvNHlVckE4VlRZbUFmRDdmWW5jd1VKcEUwPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiTUJtR2dsYjJkcDRsZ0ZJeXZVaFB0USIsInN1YiI6ImNkY2NmNWU3LWE0ZTUtNDA2ZS05ZjI3LTVjYjE5MmJmODAyMyIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhZGRyZXNzIjp7ImZvcm1hdHRlZCI6IjE5NSBjb21tb24gZWRnZSByb2FkIn0sImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5ldS13ZXN0LTIuYW1hem9uYXdzLmNvbVwvZXUtd2VzdC0yXzVucDlyd2Y2UiIsInBob25lX251bWJlcl92ZXJpZmllZCI6ZmFsc2UsImNvZ25pdG86dXNlcm5hbWUiOiJjZGNjZjVlNy1hNGU1LTQwNmUtOWYyNy01Y2IxOTJiZjgwMjMiLCJhdWQiOiIzcTY2NTJxN2hqc2NxZjI0OW84ZmtqcjlpYyIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTU1NTk5NzIxLCJuYW1lIjoib2xpdmVyIG1jcGhlZWx5IiwicGhvbmVfbnVtYmVyIjoiKzQ0NzgxNTQzNzY0OSIsImV4cCI6MTU1NTYwMzMyMSwiaWF0IjoxNTU1NTk5NzIxLCJlbWFpbCI6Im8ubWNwaGVlbHlAZ21haWwuY29tIn0.OeCCjnyRWLqdZvOuS4S7Hu6XuPVhHOe31VsqxUgtlnOCHwRxHGNYz49T0cmYD2HyyNm1Tn-UPkT7yt6qtDqe9egKtyDC-mxCNrOG0Xf_DHchCZVYDN4lGxC529_zMod5Kqw4KgAdgsT1jO9XwX6dSsOw3u5TqKAqJFoY-kzPF3PqN1Itk-goWT5OyNalimGd9iE1d1eN7MBmYSqoZEgyZ_EUqwbD02sStk-AEa2x8JAl5EtUzfQoUjh2yp2Dstsw1kvVxU1xxVo98EmpS1sPqsQz4hplxqzuK-zmW1xLwRmM0N-7u8iRbCR9w83yJlYzm5YoJHMbPV-vf6JTPnQJHw&access_token=eyJraWQiOiJ1c2ZGMXcyMldMc3FKdVZjeHdOY0hvYW0xS0VDSEhZbjNMZlN6UzhQTFlzPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJjZGNjZjVlNy1hNGU1LTQwNmUtOWYyNy01Y2IxOTJiZjgwMjMiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIHBob25lIG9wZW5pZCBwcm9maWxlIGVtYWlsIiwiYXV0aF90aW1lIjoxNTU1NTk5NzIxLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0yLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtMl81bnA5cndmNlIiLCJleHAiOjE1NTU2MDMzMjEsImlhdCI6MTU1NTU5OTcyMSwidmVyc2lvbiI6MiwianRpIjoiYzk3YzAwMzYtOGI3NC00ODhjLTljOTEtNmU4ZTU2NjlmZjYxIiwiY2xpZW50X2lkIjoiM3E2NjUycTdoanNjcWYyNDlvOGZranI5aWMiLCJ1c2VybmFtZSI6ImNkY2NmNWU3LWE0ZTUtNDA2ZS05ZjI3LTVjYjE5MmJmODAyMyJ9.GHa0Wtm4qFXUkQI2SADbrLaPgjiM3i2tGZWeJ2mhBEsaFJJQUo8vDVvXMTCPPcso3Oxa_j7m7KnRY83qwl4tSVY4Aq2iJAnePwlQsUWdfDBgwW38kGDpitWz4IZN8iRKwiv8oaOMqSqV6G8TACT-qu_9iJ0lozqSFrHaYXc8FuU_IF_iIRCacSNnjPkDvGD_gD19YM_uU9QFgjuxA6RTWtkI6FSMmDfSe_Gt0MuC7WfXhbhbf6mn2kLau6szCeCiP36d4DLj39fTjf29JtzI2EZvf-VVO0gXTNvoaW1uANYyYcYvwC8c1gy4WSZRcj55kZq2AQ9Q1sM60RmjSg5TKw&expires_in=3600&token_type=Bearer
`
  try {
    var token = matchFirstRegex(/id_token=.*/g, urlParams.toString());
    // format json to get product
    var jsondata = JSON.stringify({
      jwt: token.toString()
    });

    var xhr = createCORSRequest('POST', url);
    if (!xhr) {
      alert('CORS not supported');
      return;
    }

    // Response handlers.
    xhr.onload = function() {
      var response = xhr.response;
      if (response){
        // write to local storage
        // change login in to logout
      }
      console.log(response);
    };

    xhr.onerror = function() {
      alert('Error: An errror occured whilst loading the page.');
    };

    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(jsondata);
  } catch (err){
    if (!err instanceof TypeError){
     throw err.message;
   }
  }

}
