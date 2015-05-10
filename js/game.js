var result=["octopus in a garage","statue in the park" ,"marcian", "tourist"];
var resultado=["pulpo en un garaje","estatua en el parque", "marciano", "turista"];
var type=["Capital","Food", "Flags"];

var greenIcon = L.icon({
    iconUrl: 'leaf-green.png',
    shadowUrl: 'leaf-shadow.png',

    iconSize:     [38, 95], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});


//FLICKER 
var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
$.getJSON( flickerAPI, {
  tags: tag,
  tagmode: "any",
  format: "json"
})