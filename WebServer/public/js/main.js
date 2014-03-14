var latlon,
    map,
    lMenuVisible,
    bMenuVisible,
    selectedMarker = null,
    //change these variables into functions
    lMenuVisible = false,
    bMenuVisible = false;

var mapClick = function(name, source, args) {
    console.log('mapclick');
    console.log(source);
    selectedMarker = null;
    //hide comments
    $('#addComment').css('display','none');
    bMenuHide();
}

var markerClick = function(name, source, args) {
    selectedMarker = source;
    console.log('markerclick');
    
    //need to filter comments to only this marker
    $('#addComment').css('display','inherit');
    bMenuShow();
}

var getComments = function(){
    
    var comments = {comments:['Cool','So how many characters can you actually get within a 140 character limit?  Evidently it is more than I thought!  Wow I can keep typing still']};
    
    var markupcomments = comments.comments.map(function(comment){
        return '<div class="comment">' + comment + '</div>'
    });
    return markupcomments.join('');
}

var submitCommentClick = function(){
    var comment = $("#newComment").val();
    console.log({'pinID': selectedMarker.getAttribute('pinID'), 'comment': comment});
   
    $.post('/comment',{'pinID': selectedMarker.getAttribute('pinID'), 'comment': comment}, function (data) {
            if (data.status === 'success') {
                //get latest pins?
console.log('You have succedded'+data);                
            } else {
console.log('You have failed!'+data);
            }
        });
};

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
        if ($('#comments').children().length == 0) {
            $('#comments').append(getComments);
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
        zoom: 'large',
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
                            marker.setAttribute('pinID',data[i]._id);
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