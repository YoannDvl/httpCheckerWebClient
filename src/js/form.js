"use strict";

var submitCheck = function(){
  var form = document.forms["checkForm"];
  console.log(form.url.value);

  if(!self.fetch) return true;
   fetch('/api/check', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({url: form.url.value})
    })
    .then(function(response) {
      console.log("then");
      return response.blob();
    });
	
  return false;
};
