var sound=false;
var juegosjson=["Capitales","Banderas", "Comida"];
var photo= [];
var locations=[];
var gametime;

//sound
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
}


//cargar fotos y localizaciones
function loadLocations(apigames){
  $.getJSON('../juegos/'+apigames+'.json', function(d){
    for(var i=0; i<d.features.length; i++) {  
      console.log("a:"+d.features[i].geometry.coordinates);
      locations.push(d.features[i].geometry.coordinates);
      console.log("b:"+d.features[i].properties.tag);
      loadPhoto(d.features[i].properties.tag);
    };
  });
}

function loadPhoto(location){
  var apiflickr='http://api.flickr.com/services/feeds/photos_public.gne?tags=';
  $.getJSON( apiflickr+location+'&tagmode=any&format=json&jsoncallback=?', function(d1){
	  photo.push(d1.items[0].media.m);
	  console.log("c: "+location+": "+d1.items[0].media.m);
  });
}

//seleccionar el tipo de juego
function selectgame(){
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

//ir a mapa de juego
function jumptogame(){
  window.location = '#game';
}


$(document).ready(function() {
  var psound = localStorage["sound"];  
  sound=psound=="true";
  if (sound);
  selectgame();
  $('#typegame').change(function() {
    selectgame();
  });
  $('#easy').click(function(){
    gametime=10;
    localStorage.setItem("phase", 1);
    jumptogame();
  });
  $('#medium').click(function(){
    gametime=5;
    localStorage.setItem("phase", 1);
    jumptogame();
  });
  $('#hard').click(function(){
    gametime=3; 
    localStorage.setItem("phase", 1);
    jumptogame();
  });
  $('#continue').click(function(){
    var phase = localStorage["phase"];
    if (phase > 0)
      jumptogame();
    else
      alert("NEED PLAY A GAME FIRST");
  }); 
});



