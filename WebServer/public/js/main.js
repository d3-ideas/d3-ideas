var latlon,
    map,
    lMenuVisible,
    bMenuVisible,
    selectedMarker,
    lMenuVisible = false,
    bMenuVisible = false;

var mapClick = function(name, source, args) {
    console.log('mapclick');
    console.log(name);
    console.log(source);
    console.log(args);
    selectedMarker = null;
    //hide comments
    //hide div for add comments
    bMenuHide();
}

var markerClick = function(name, source, args) {
    selectedMarker = source;
    console.log('markerclick');
    console.log(name);
    console.log(source);
    console.log(args);
    //need to filter comments to only this marker
    //show div for add comments
    bMenuShow();
}

var getComments = function(){
    
    var comments = {comments:['Cool','So how many characters can you actually get within a 140 character limit?  Evidently it is more than I thought!  Wow I can keep typing still']};
    
    var markupcomments = comments.comments.map(function(comment){
        return '<div class="comment">' + comment + '</div>'
    });
    return markupcomments.join('');
}

var lMenuToggle = function () {
    if (!lMenuVisible){
        $('#lMenu').css('width','300px');
        $('#lMenuHandle').css('left','300px');
        lMenuVisible = true;
    } else {
        $('#lMenu').css('width','0px');
        $('#lMenuHandle').css('left','0px');
        lMenuVisible = false;
    };
};

var bMenuToggle = function () {
    if (!bMenuVisible){
        $('#bMenu').css('height','400px');
        $('#bMenuHandle').css('bottom','400px');

        //check to see if comments are already loaded
        if ($('#bMenu').children().length == 0) {
            $('#bMenu').append(getComments);
        }
        bMenuVisible = true;
    } else {
        $('#bMenu').css('height','0px');
        $('#bMenuHandle').css('bottom','0px');
        bMenuVisible = false;
    };
};

var bMenuShow = function(){
    if (!bMenuVisible) bMenuToggle();
}

var bMenuHide = function(){
    if (bMenuVisible) bMenuToggle();
}

$(document).ready(function () {
    map = new mxn.Mapstraction('map', 'googlev3');
    map.click.addHandler(mapClick);
    map.addControls({
        pan: true,
        zoom: 'small',
        map_type: true
    });
    //map.addSmallControls();
    //p.addLargeControls();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (data) {
            latlon = new mxn.LatLonPoint(data.coords.latitude, data.coords.longitude);
            map.setCenterAndZoom(latlon, 15);
    
            var viewBondary = map.getBounds();
            var north = viewBondary.getNorthEast().lat,
                east = viewBondary.getNorthEast().lon,
                south = viewBondary.getSouthWest().lat,
                west = viewBondary.getSouthWest().lon;
    
            $.getJSON('/pins', {viewBoundary:{'north':north, 'east':east, 'south':south, 'west':west}}, function (data) {
                if (data.status != 'error'){
                    var i;
                    for (i in data) {
                        if (data.hasOwnProperty(i)) {
                            var marker = new mxn.Marker(new mxn.LatLonPoint(data[i].location.coordinates[0], data[i].location.coordinates[1]));
                            marker.click.addHandler(markerClick);
                            map.addMarker(marker);
                        }
                    }
                } else {console.log('error-'+data.reason);};
            });    
        }, function (data) {
            console.log(data);
        });
    }
    
});