var sound=false;
var ready=false;
var juegosjson=["Capitales","Banderas", "Comida"];
var photo= [];
var locations=[];
var gametime=null;
var level=0;
/*
 * sound
 *=================================================================================================
 */
var audiotypes={
        "mp3": "audio/mpeg",
        "mp4": "audio/mp4",
        "ogg": "audio/ogg",
        "wav": "audio/wav"
}
function ss_soundbits(sound){
    var audio_element = document.createElement('audio')
    if (audio_element.canPlayType){
        for (var i=0; i<arguments.length; i++){
            var source_element = document.createElement('source')
            source_element.setAttribute('src', arguments[i])
            if (arguments[i].match(/\.(\w+)$/i))
                source_element.setAttribute('type', audiotypes[RegExp.$1])
            audio_element.appendChild(source_element)
        }
        audio_element.load()
        audio_element.playclip=function(){
            audio_element.pause()
            audio_element.currentTime=0
            audio_element.play()
        }
        return audio_element
    }
} 

var select  = ss_soundbits("../audio/magical_1_0.ogg");

function changesound(){
    sound=!sound;
    localStorage.setItem("sound", sound);
    if (sound)
      $("#audio").html('<i class="fa fa-volume-up"></i>');
    else
      $("#audio").html('<i class="fa fa-volume-off"></i>');
}


/*
 * comunicaciones con el servidor
 *=================================================================================================
 */
function loadLocations(apigames){
  $.getJSON('../juegos/'+apigames+'.json', function(d){
    for(var i=0; i<d.features.length; i++) {  
      loadPhoto(d.features[i]);
    };
  });
}

function loadPhoto(location){
  var apiflickr='http://api.flickr.com/services/feeds/photos_public.gne?tags=';
  $.getJSON( apiflickr+location.properties.tag+'&tagmode=any&format=json&jsoncallback=?', function(d1){
    console.log("a:"+location.geometry.coordinates);
    locations.push(location.geometry.coordinates);
    photo.push([location.properties.tag, d1.items[0].media.m]);
    console.log("b: "+location.properties.tag+": "+d1.items[0].media.m);
    ready=true;
    localStorage.setItem("photo", JSON.stringify(photo));
  });
}


/*
 * tipos de juego
 *=================================================================================================
 */
function selectgame(){
  photo= [];
  locations=[];
  switch($('#typegame :selected').text()){
    case "Flags":
      loadLocations(juegosjson[1]);
      break;
    case "Food":
      loadLocations(juegosjson[2]);
      break;
    default:
      loadLocations(juegosjson[0]);
  };
};



function jumptogame(){
  window.location = '#game';
}

function levelnext(){
  if (level < photo.length){ 
    if (ready)
      drawImage(photo[level++]);
    localStorage.setItem("phase", level+1);
  }else{
    endgame();
  } 
}

function endgame(){
  $('#locationphoto').css("backgroundImage", "none");
  window.location = '#solve';
  level=0;
  localStorage.setItem("phase", 0);
}

$(document).ready(function() {
  selectgame();
  var psound = localStorage["sound"];  
  sound=psound=="true";
  $("#audio").click(function() {
    changesound();
  });
  $('#typegame').change(function() {
    selectgame();
  });
  $('#easy').click(function(){
    gametime=10000;
    localStorage.setItem("phase", 1);
    localStorage.setItem("gametime", gametime);
    level=0;
    setInterval(levelnext(), gametime);
    jumptogame();
  });
  $('#medium').click(function(){
    gametime=5000;
    localStorage.setItem("phase", 1);
    localStorage.setItem("gametime", gametime);
    level=0;
    jumptogame();
  });
  $('#hard').click(function(){
    gametime=3000; 
    localStorage.setItem("phase", 1);
    localStorage.setItem("gametime", gametime);
    level=0;
    setInterval(levelnext(), gametime);
    jumptogame();
  });
  $('#continue').click(function(){
    var phase = parseInt(localStorage["phase"]);
    var previotime =parseInt( localStorage["gametime"]);
    if (phase > 0){
      photo = JSON.parse(localStorage["photo"]);
      level=phase-1;
      setInterval(levelnext(), previotime);
      jumptogame();
    }else
      alert("NEED A ACTIVE GAME");
  }); 
  $('#help').click(function(){
      window.location = '#menu';
  });
});

/*
 * MAPA JUEGO
 *=================================================================================================
 */
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
  if (sound)
    select.playclip();
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
  $('#locationphoto2').html('<figure><img src=' + src[1] + '/><figcaption>'+src[0]+'</figcaption></figure>');
}

/*
 * MAPA SOLUCION
 *=================================================================================================
 */
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

