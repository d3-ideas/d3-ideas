var latlon,
    map;

var onSuccess = function (data) {
        latlon = new mxn.LatLonPoint(data.coords.latitude, data.coords.longitude);
        var marker = new mxn.Marker(latlon);
        map.addMarker(marker);
        map.setCenterAndZoom(latlon, 15);
        $('#Latitude').text('Latitude: ' + data.coords.latitude);
        $('#Longitude').text('Longitude: ' + data.coords.longitude);
        $('#accuracy').text("Accuracy: " + data.coords.accuracy + " meter circle");
    },
    onError = function (data) {
        console.log(data);
    },
    addPin = function () {
        $.post('/pin', { 'lat': latlon.lat, 'lon': latlon.lon }, function (data) {
            //Show temporary notification of success
            $('#PinResult').html('<div id="PinSucess">You have successfully pinned this location.</div>');
            $('#PinSucess').fadeOut(3000, function () {
            //do something here.
            });
        });
    };

$(document).ready(function () {
    map = new mxn.Mapstraction('map', 'openlayers');
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
    
    $.getJSON('/pins', function (data) {
        var i;
        for (i in data.locations) {
            if (data.locations.hasOwnProperty(i)) {
                map.addMarker(
                    new mxn.Marker(
                        new mxn.LatLonPoint(data.locations[i].Location.coordinates[0], data.locations[i].Location.coordinates[1])
                    )
                );
            }
        }
    });
});