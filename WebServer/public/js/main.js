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

var addmenu = function (txt, func) {
    console.log(txt);
    var newcontrol = document.createElement("a");
    newcontrol.className = 'googlecontrol';
    newcontrol.appendChild(document.createTextNode(txt));
    newcontrol.onclick = function () {
        $('#map').toggleClass('fullscreen_menu');
    };
    map.currentElement.appendChild(newcontrol);
};

$(document).ready(function () {
    map = new mxn.Mapstraction('map', 'googlev3');
    map.addControls({
        pan: true,
        zoom: 'small',
        map_type: true
    });
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
    
    addmenu('Menu', '');
    
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