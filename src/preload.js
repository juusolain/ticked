const useLocalhost = true;
window.jwtDecode = require('jwt-decode');
window.Store = require('electron-store')
window.axios = require('axios')

if(require('electron-is-dev') && useLocalhost){
  window.server = 'http://localhost:5000';
}else{
  window.server = 'https://ticked-server.herokuapp.com';
}

document.onreadystatechange = function () {
    if (document.readyState == "complete") {
      window.$ = require('jquery');
      window.$.event.special.destroyed = {
        remove: function(o) {
          if (o.handler) {
            o.handler()
          }
        }
      }
      console.log(flatpickr);
    }
}