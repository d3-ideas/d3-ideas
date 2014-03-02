var latlon,
    map;

var onSuccess = function (data) {
        latlon = new mxn.LatLonPoint(data.coords.latitude, data.coords.longitude);
        var marker = new mxn.Marker(latlon);
        map.addMarker(marker);
        map.setCenterAndZoom(latlon, 15);
    },
    onError = function (data) {
        console.log(data);
    };


$(document).ready(function () {
    map = new mxn.Mapstraction('map', 'openlayers');
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
    
/*    $.getJSON('/pins', function (data) {
        var i;
        for (i in data) {
            if (data.hasOwnProperty(i)) {
                map.addMarker(
                    new mxn.Marker(
                        new mxn.LatLonPoint(data[i].location.coordinates[0], data[i].location.coordinates[1])
                    )
                );
            }
        }
    });*/
});