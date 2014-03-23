var latlon,
    map,
    lMenuVisible,
    bMenuVisible,
    selectedMarker = null,
    viewPins;

var addPinToggle = function () {
    $('#left-menu-pin').toggleClass('on');
    if ($('#comments-block').css('float') != 'right' && $('#comments-block').hasClass('open')){
        bMenuToggle();
    }
    return true;  
};
var addPinOff = function () {
    $('#left-menu-pin').removeClass('on');
    return true; 
}

var getComments = function () {
    var comments,
        pins = viewPins.map(function (location) {
            return location._id;
        });
    console.log(pins);
    
    $.getJSON('/comment', {'pinIDs': pins})
        .done(function (data) {
            console.log(data);
            if (data.status !== 'error') {
                var i;
                if (Array.isArray(data.tags)) {
                    comments = data.tags.map(function (tag) {
                        return '<div class="comment">' + tag.tag + '</div>';
                    });
                    
                    $('#comments').append(comments.join());
                }
            } else {
                //console.log('error-'+data.reason);
                console.log('error');
            }
        })
        .fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            console.log("Request Failed: " + err);
        });

    return true;
};

var submitCommentClick = function () {
    var comment = $("#newComment").val();
    console.log({'pinID': selectedMarker.getAttribute('pinID'), 'comment': comment});
   
    $.post('/comment', {'pinID': selectedMarker.getAttribute('pinID'), 'comment': comment}, function (data) {
        if (data.status === 'success') {
            //get latest pins?
            console.log('You have succedded'+data);                
        } else {
            console.log('You have failed!'+data);
        }
    });
};

var lMenuToggle = function () {
    $('#left-menu-block').toggleClass('extended');
    bMenuHide();
    addPinOff();
};

$(document).on('click', '.comment-item', function(){
    var target = this;
    var targetID = $(target).data('commentid');
    if (!$(target).find('.comment-options').hasClass('active')) {
        $('.comment-options').removeClass('active').slideUp();
        $(target).children('.comment-options').addClass('active').slideDown();
    }
} );

$(document).on('click', '.left-menu-item.closed .left-menu-item-title', function(){
    var target = this;
    $('.left-menu-item.open .left-menu-item-list').slideUp();
    $('.left-menu-item.open').removeClass('open').addClass('closed');
    
    $(this).parent().children('.left-menu-item-list').slideDown();
    $(this).parent().removeClass('closed').addClass('open');
});

function clearCommentOptions() {
    $('.comment-options').removeClass('active').slideUp();
}

var bMenuToggle = function () {
    $('#comments-block').toggleClass('open');
    clearCommentOptions();
    
/*    if (!bMenuVisible) {
        $('#bMenu').css('height', '400px');
        $('#bMenuHandle').css('bottom', '400px');

        //check to see if comments are already loaded
        if ($('#comments').children().length === 0) {
            getComments();
        }
        bMenuVisible = true;
    } else {
        $('#bMenu').css('height', '0px');
        $('#bMenuHandle').css('bottom', '0px');
        bMenuVisible = false;
    }
*/
};

var bMenuShow = function () {
    if (!bMenuVisible) bMenuToggle();
    addPinOff();
};

var bMenuHide = function () {
    if (bMenuVisible) {
        bMenuToggle();
        clearCommentOptions();
    }
};

var mapClick = function (name, source, args) {
    console.log('mapclick');
    console.log(source);
    console.log(args);
    selectedMarker = null;
    //hide comments
    $('#addComment').slideUp();
    bMenuHide();
    
    if ($('#left-menu-pin').hasClass('on')) {
        $('#left-menu-pin').toggleClass('on');
        $.post('/pin', { 'lat': args.location.lat, 'lon': args.location.lon }, function (data) {
            console.log(data);
            if (data.status === 'success') {
                var marker = new mxn.Marker(args.location);
                marker.click.addHandler(markerClick);
                marker.setAttribute('pinID', data.pin);
                map.addMarker(marker);
            }
        });        
    }
};

var markerClick = function (name, source, args) {
    selectedMarker = source;
    console.log('markerclick');
    
    //need to filter comments to only this marker
    $('#addComment').slideDown();
    bMenuShow();
};

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
    
            var viewBondary = map.getBounds(),
                north = viewBondary.getNorthEast().lat,
                east = viewBondary.getNorthEast().lon,
                south = viewBondary.getSouthWest().lat,
                west = viewBondary.getSouthWest().lon;
    
            $.getJSON('/pins', {viewBoundary: {'north': north, 'east': east, 'south': south, 'west': west}})
                .done(function (data) {
                    if (data.status !== 'error') {
                        var i,
                            marker;
                        for (i in data) {
                            if (data.hasOwnProperty(i)) {
                                viewPins = data;
                                marker = new mxn.Marker(new mxn.LatLonPoint(data[i].location.coordinates[0], data[i].location.coordinates[1]));
                                marker.click.addHandler(markerClick);
                                marker.setAttribute('pinID', data[i]._id);
                                map.addMarker(marker);
                            }
                        }
                    } else {
                        console.log('error-' + data.reason);
                    }
                })
                .fail(function ( jqxhr, textStatus, error ) {
                    var err = textStatus + ", " + error;
                    console.log( "Request Failed: " + err );
                });
        });
    }
});