var result=["octopus in a garage","statue in the park" ,"marcian", "tourist"];
var resultado=["pulpo en un garaje","estatua en el parque", "marciano", "turista"];
var type=["Capital","Food", "Flags"];

function swapPhoto(href) {
  var req = new XMLHttpRequest();
  req.open("GET",
           "http://vcarrera.github.io/X-Nav-Practica-Adivina/gallery/" +
             href.split("/").pop(),
           false);
  req.send(null);
  if (req.status == 200) {
    document.getElementById("gallery").innerHTML = req.responseText;
    setupHistoryClicks();
    return true;
  }
  return false;
}

function addClicker(link) {
  link.addEventListener("click", function(e) {
    if (swapPhoto(link.href)) {
      history.pushState(null, null, link.href);
      e.preventDefault();
    }
  }, true);
}



window.onload = function() {
  if (!supports_history_api()) { return; }
  setupHistoryClicks();
  window.setTimeout(function() {
    window.addEventListener("popstate", function(e) {
      swapPhoto(location.pathname);
    }, false);
  }, 1);
}
