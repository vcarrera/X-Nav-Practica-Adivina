var Esri_WorldTopoMap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
})

var city = L.icon({
  iconUrl: 'images/City-Parliament-icon.png',
  iconSize:     [20, 20], // size of the icon
  iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
  popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
});

var map = L.map('map').setView([51.50874, 11.60156],4);
map.addLayer(Esri_WorldTopoMap);

map.touchZoom.disable();
map.doubleClickZoom.disable();
map.scrollWheelZoom.disable();


map.on('click', function(e) {
  L.marker(e.latlng).addTo(map).bindPopup(e.latlng+"<button id='confirm'>confirm:"+e.latlng+"</i></button>").openPopup();
});

function confirm() {

}

function left(){
  map.setView([49.61071, -0.08789],4);  
}
function right(){
  map.setView([49.61071, 19.33594],4);  
}