var Esri_WorldTopoMap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
});
var map = L.map('map').setView([51.50874, 11.60156],4);
map.addLayer(Esri_WorldTopoMap);

map.touchZoom.disable();
map.doubleClickZoom.disable();
map.scrollWheelZoom.disable();


map.on('click', function(e) {
  L.marker(e.latlng).addTo(map).bindPopup(e.latlng+"<button id='confirm'>confirm</button>").openPopup();
});

function confirm() {

}

function left(){
  map.setView([49.61071, -0.08789],4);  
}
function right(){
  map.setView([49.61071, 19.33594],4);  
}