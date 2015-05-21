var Stamen_Watercolor = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png', {
  subdomains: 'abcd',
  minZoom: 1,
  maxZoom: 16,
  ext: 'png'
});


var city = L.icon({
  iconUrl: 'images/City-Parliament-icon.png',
  iconSize:     [20, 20], // size of the icon
  iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
  popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
});

var map = L.map('map2').setView([51.50874, 11.60156],4);
map.addLayer(Stamen_Watercolor);

map.touchZoom.disable();
map.doubleClickZoom.disable();
map.scrollWheelZoom.disable();


map.on('click', function(e) {
  L.marker(e.latlng).addTo(map).bindPopup(e.latlng+"<button id='confirm'>confirm:"+e.latlng+"</i></button>").openPopup();
});

function confirm() {

}

function endgame(){
    L.marker(e.latlng,{icon: city}).addTo(map);
}

function left(){
  map.setView([49.61071, -0.08789],4);  
}
function right(){
  map.setView([49.61071, 19.33594],4);  
}