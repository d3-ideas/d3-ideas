var latlon,
    map;

onSuccess=function(data){
    latlon = new mxn.LatLonPoint(data.coords.latitude, data.coords.longitude);
    var marker = new mxn.Marker(latlon);
    map.addMarker(marker);
    map.setCenterAndZoom(latlon, 15);
    $('#Latitude').text('Latitude: '+data.coords.latitude);
    $('#Longitude').text('Longitude: '+data.coords.longitude);
    $('#accuracy').text("Accuracy: "+data.coords.accuracy+" meter circle");
};

onError=function(data){
    console.log(data);
};

addPin=function(){
    $.post('/pin', { 'lat':latlon.lat, 'lon':latlon.lon }, function(data){
        //Show temporary notification of success
        $('#PinResult').html('<div id="PinSucess">You have successfully pinned this location.</div>');
        $('#PinSucess').fadeOut(3000, function(){
        //do something here.
        });
    });
};

$(document).ready(function () {
    map = new mxn.Mapstraction('map', 'openlayers'); 
    if(navigator.geolocation)
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    
    map.addMarker(new mxn.Marker(new mxn.LatLonPoint(38.9949249,-77.0416414)));
    
    $.getJSON('\pins', function (data) {
        console.log(data);
console.log(data.length);
    for (var i=0, len=data.length; i < len; i++) {
        console.log(data[i]);
    }

    });
});