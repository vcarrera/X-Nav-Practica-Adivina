//FLICKER 
var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
$.getJSON( flickerAPI, {
  tags: tag,
  tagmode: "any",
  format: "json"
})
$(document).ready(function() {
    var apiflickr='http://api.flickr.com/services/feeds/photos_public.gne?tags=';
    $('#search').click(function(){
        $('#images').html('');
        $.getJSON( apiflickr+$('#tag').val() + '&tagmode=any&format=json&jsoncallback=?', function(d){
	        $.each(d.items, function(i,item) {
                $('#images').append('<figure><img src=' + item.media.m + '/><figcaption>'+item.title.substring(0, 11)+'</figcaption></figure>');
	        });
        });
    });
});