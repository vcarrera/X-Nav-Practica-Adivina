var sound=false;
var ready=false;
var juegosjson=["Capitales","Banderas", "Comida"];
var state;
var photo= [];
var gametime;
var level=0;
var count=0;
var interval;
var typeofgame;
var difficult;
var start=false;
var markers;
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

var select  = ss_soundbits("../audio/Item Shop_1.mp3");

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
  $.getJSON('juegos/'+apigames+'.json', function(d){
    for(var i=0; i<d.features.length; i++) {  
      loadPhoto(d.features[i]);
    };
  });
}

function loadPhoto(location){
  var apiflickr='http://api.flickr.com/services/feeds/photos_public.gne?tags=';
  $.getJSON( apiflickr+location.properties.tag+'&tagmode=any&format=json&jsoncallback=?', function(d1){
    console.log("a:"+location.geometry.coordinates);
    photo.push([location.properties.tag, d1.items[0].media.m,location.properties.name, location.geometry.coordinates]);
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
  switch($('#typegame :selected').text()){
    case "Flags":
      loadLocations(juegosjson[1]);
      typeofgame=1;
      break;
    case "Food":
      loadLocations(juegosjson[2]);
      typeofgame=2;
      break;
    default:
      loadLocations(juegosjson[0]);
      typeofgame=0;
  };
};

function jumptogame(){
  window.location = '#game';
}
function jumptomenu(){
  window.clearInterval(interval);
  window.location = '#menu';
}
function jumptomap2(){
  window.location = 'map2';
}
function nextphoto(){
  drawImage(photo[level++]);
}

function nextphoto2(){
  drawImage2(photo[++count]);
}

function prevphoto2(){
  drawImage2(photo[--count]);
}

function levelnext(){
  if (level < photo.length){ 
    if (ready){
      if (start)
	map.removeLayer(markers);
      nextphoto();
      localStorage.setItem("phase", level+1);
      $("#level").html(level+' / '+photo.length);
      clearInterval(interval);
      interval=setInterval(function() {levelnext()}, gametime);
      jumptogame();
    }
  }else{
    endgame();
  } 
}
function stargame(gametime){
  localStorage.setItem("phase", 1);
  localStorage.setItem("gametime", gametime);
  $("#points").html("0");
  level=0;
  levelnext();
  jumptogame();
  clearInterval(interval);
  interval=setInterval(function() {levelnext()}, gametime);
}
  
function endgame(){
  $('#locationphoto').css("backgroundImage", "none");
  window.location = '#solve';
  level=0;
  localStorage.setItem("phase", 0);
  clearInterval(interval);
  drawImage2(photo[0]);
  salve();
}

function salve(){
  var gamename=juegosjson[typeofgame]+" "+level;
  var date=new Date();
  console.log(juegosjson[typeofgame]+" "+level+"->"+points);
  state={
	  "points":points,
	  "level" : level,
	  "difficult" : difficult,
	  "photos": photo,
	  "name":date
  };
  history.pushState(state ,null,"game=" + juegosjson[typeofgame]+" "+level);
  $("#modehistoy").append("<button onclick='revert("+history.length+");'>"+gamename+" "+difficult+" "+date+ " "+points+" points</button>");
}

function revert(index){
  history.go(index-history.length-1);
  points=state.points;
  level=state.level;
  difficult=state.difficult;
  photo=state.photos;
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
    gametime=18000;
    difficult="easy";
    stargame(gametime);
  });
  $('#medium').click(function(){
    gametime=12000;
    difficult="medium";
    stargame(gametime);
  });
  $('#hard').click(function(){
    gametime=6000; 
    difficult="hard";
    stargame(gametime);
  });
  $('#continue').click(function(){
    var phase = parseInt(localStorage["phase"]);
    var previotime =parseInt( localStorage["gametime"]);
    if (phase > 0){
      photo = JSON.parse(localStorage["photo"]);
      level=phase-1;
      jumptogame();
    }else
      alert("NEED A ACTIVE GAME");
  }); 
  $("#salve").click(function(){
    salve();
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
  markers=L.marker(e.latlng).addTo(map).bindPopup(e.latlng+"<button id='confirm' onclick='confirm();'>confirm</button>").openPopup();
  position=e.latlng;
  start=true;
});

function confirm() {
  var locationpos=photo[level-1][3];
  console.log (locationpos);
  var laux = new L.LatLng(locationpos[0], locationpos[1]);
  var distance = position.distanceTo(laux);
  points+=distance*level;
  $("#points").html(Math.round(points));
  $("#distance").html (Math.round(distance/1000));
  levelnext();
};

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

$('#nextphoto').click(function(){
  if (count < photo.length-1)
    nextphoto2();
});
$('#backphoto').click(function(){
  if (count > 0)
    prevphoto2();
});

function drawImage(src){
  console.log("c:"+src[0]);
  $('#locationphoto').css("backgroundImage", "url(" + src[1]+ ")");
}

function drawImage2(src){
  console.log("c:"+src[0]);
  $('#locationphoto2').html('<figure><img src=' + src[1] + '/><figcaption>'+src[2]+'</figcaption></figure>');
  var laux = new L.LatLng(photo[count][3][0], photo[count][3][1])
  solution(laux);
}

/*
 * MAPA SOLUCION
 *=================================================================================================
 */
var pointstart=false;
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

var map2 = L.map('map2').setView([51.50874, 11.60156],3);
map2.addLayer(Stamen_Watercolor);

map2.touchZoom.disable();
map2.doubleClickZoom.disable();
map2.scrollWheelZoom.disable();

function solution(point){
    if (pointstart)
      map2.removeLayer(markers);
    pointstart=true;
    markers=L.marker(point,{icon: city}).addTo(map2);
    map2.panTo(point);
}

map2.on('click', function(e) {
    window.location = '#solve';
});
