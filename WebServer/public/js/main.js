var latlon,
    map,
    lMenuVisible,
    bMenuVisible;

var getComments = function(){
    var commentsfromjson = {comments:['Cool','I got laid here!']};
    //console.log(Array.isArray(commentsfromjson.comments));
    //var acomments = commentsfromjson.comments.map(function(comment){
    //});
    return '<div class="comment">test1</div><div class="comment">test1</div>';
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

$(document).ready(function () {
    map = new mxn.Mapstraction('map', 'googlev3');
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
                east = viewBondary.getNorthEast().lng,
                south = viewBondary.getSouthWest().lat,
                west = viewBondary.getSouthWest().lng;
    
            $.getJSON('/pins', {viewBoundary:{'north':north, 'east':east, 'south':south, 'west':west}}, function (data) {
                if (data.status != 'error'){
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
                } else {console.log('error-'+data.reason);};
            });    
        }, function (data) {
            console.log(data);
        });
    }
    
    lMenuVisible = false;
    bMenuVisible = false;
});