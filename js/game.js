var apiflickr='http://api.flickr.com/services/feeds/photos_public.gne?tags=';
var result=["octopus in a garage","statue in the park" ,"marcian", "tourist"];
var juegosjson=["Capitales","Banderas", "Comida"];
var photo= [];
var data=[];

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


$(document).ready(function() {
    switch($('#typegame :selected').text()){
      case "Flags":
	apigames=juegosjson[2];
	break;
      case "Food":
	apigames=juegosjson[3];
	break;
      default::
	apigames=juegosjson[1];
    }
    $.getJSON('../juegos/'+apigames+'.json', function(d){
      $.each( d, function( key, tag) {
	$.getJSON( apiflickr+tag.properties.name+'&tagmode=any&format=json&jsoncallback=?', function(d1){
	    photo.push(d1.pop().media.m);
	});
      });
      
     });
  });