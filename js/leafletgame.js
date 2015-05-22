var points=0;
var position;
var Esri_WorldTopoMap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
});
var map = L.map('map').setView([51.50874, 11.60156],4);
map.addLayer(Esri_WorldTopoMap);

map.touchZoom.disable();
map.doubleClickZoom.disable();
map.scrollWheelZoom.disable();


map.on('click', function(e) {
  L.marker(e.latlng).addTo(map).bindPopup(e.latlng+"<button id='confirm'>confirm</button>").openPopup();
  position=e.latlng;
});

function confirm() {
  var laux = new L.LatLng(locations[level][0], locations[level][1]);
  points+=position.distanceTo(laux)*level;
}

function left1(){
  var location = new L.LatLng(49.61071, -0.08789);
  map.panTo(location);
}
function right1(){
  var location = new L.LatLng(49.95122, 23.02734);
  map.panTo(location); 
}

$('#leftmap').click(function(){
  left1();
});

$('#rightmap').click(function(){
  right1();
});


function drawImage(src){
  console.log("c:"+src[0]);
  $('#locationphoto').css("backgroundImage", "url(" + src[1]+ ")");
}
function endgame(){
  $('#locationphoto').css("backgroundImage", "none");
  $('#locationphoto').css("background", "white");
  $('#locationphoto').append("<div id='points' class='centrame'> <h2>points: "+points+"</h2></div>");
}

