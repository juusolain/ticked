window.Auth = require('./modules/auth');

if(require('electron-is-dev')){
  window.server = 'http://localhost:5000';
}else{
  window.server = 'https://ticked-server.herokuapp.com';
}

document.onreadystatechange = function () {
    if (document.readyState == "complete") {
      window.$ = require('jquery');
    }
}