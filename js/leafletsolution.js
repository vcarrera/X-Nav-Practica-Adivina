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

var map2 = L.map('map2').setView([51.50874, 11.60156],4);
map2.addLayer(Stamen_Watercolor);

map2.touchZoom.disable();
map2.doubleClickZoom.disable();
map2.scrollWheelZoom.disable();


map2.on('click', function(e) {
  L.marker(e.latlng).addTo(map2).bindPopup(e.latlng+"<button id='confirm'>confirm</button>").openPopup();
});

function confirm() {

}

function solution(){
    L.marker(e.latlng,{icon: city}).addTo(map2);
}

function left(){
  map2.setView([49.61071, -0.08789],4);  
}
function right(){
  map2.setView([49.61071, 19.33594],4);  
}