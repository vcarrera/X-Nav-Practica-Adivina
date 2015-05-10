//FLICKER 
var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
$.getJSON( flickerAPI, {
  tags: tag,
  tagmode: "any",
  format: "json"
})