window.auth = require('./modules/auth');
document.onreadystatechange = function () {
    if (document.readyState == "complete") {
      window.$ = require('jquery');
    }
}