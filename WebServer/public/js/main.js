var latlon,
    map,
    markers = new L.FeatureGroup(),
    selectedMarkerID = null,
    viewPins;

var addPinToggle = function () {
    $('#left-menu-pin').toggleClass('on');
    if ($('#comments-block').css('float') !== 'right' && $('#comments-block').hasClass('open')) {
        bMenuToggle();
    }
    return true;
};

var addPinOff = function () {
    $('#left-menu-pin').removeClass('on');
    return true;
};

var getComments = function () {
    console.log('start getComments');
    var comments,
        pins;
    
    if (viewPins) {
        console.log(viewPins);
        pins = viewPins.map(function (location) {
            return location._id;
        });

        $.getJSON('/comment', {'pinIDs': pins})
            .done(function (data) {
                console.log(data);
                if (data.status !== 'error') {
                    var i;
                    if (Array.isArray(data.tags)) {
                        console.log('getComments isArray');
                        comments = data.tags.map(function (tag) {
                           // var tagDate = moment(tag.createdOn);
                            return '<div class="comment-item" data-commentid="' + tag._id + '" data-pinid="' + tag.pin + '">' +
                                    '<p>' + tag.tag + '</p>' +
                                    '<p>' + moment(tag.createdOn).fromNow() + '</p>' + 
                                    '<div class="comment-options"><span>Options here...</span></div></div>';
                        });
                        
                        console.log(comments);
                        $('#comments-content').html(comments.join(''));
                    }
                } else {
                    console.log('error'+data);
                }
            })
            .fail(function (jqxhr, textStatus, error) {
                var err = textStatus + ", " + error;
                console.log("Request Failed: " + err);
            });
    } else {
        console.log('getComments nopins');
        $('#comments-content').html('');
    }
    return true;
};

var submitCommentClick = function () {
    var comment = $("#newComment").val();
   
    $.post('/comment', {'pinID': selectedMarkerID, 'comment': comment}, function (data) {
        if (data.status === 'success') {
            //get latest pins?
            console.log('You have succedded' + data);                
        } else {
            console.log('You have failed!' + data);
        }
    });
};

var lMenuToggle = function (menuTarget) {
    if ($('#left-menu-block').hasClass('extended')) {
        if ($('#'+menuTarget+'-block').hasClass('active')) {
            $('#left-menu-block').removeClass('extended');
            $('.left-menu-item').removeClass('active');
        }
        else {
            $('.left-menu-item').toggleClass('active');
        }
    }
    else {
        $('#left-menu-block').addClass('extended');
        $('#'+menuTarget+'-block').addClass('active');
        bMenuHide();
        addPinOff();
    }
};
var markerSelected = function (pinID) {
    selectedMarkerID = pinID;
    markers.eachLayer(function(marker) {
        if(marker.pinID !== selectedMarkerID){
            marker.setOpacity(.3);
        } else marker.setOpacity(1);
    });
    
    $('#addComment').slideDown();
    $('.comment-options').removeClass('active').slideUp();
};

var markerDeSelected = function () {
    selectedMarkerID = null;
    markers.eachLayer(function(marker) {
        marker.setOpacity(1);
    });

    $('#addComment').slideUp();
    $('.comment-options').removeClass('active').slideUp();
}

var markerToggle = function (pinID) {
    if (pinID && (selectedMarkerID !== pinID)) {
        markerSelected(pinID);
    } else {
        markerDeSelected();
    }
};

$(document).on('click', '.comment-item', function () {
    var target = this,
        targetID = $(target).data('commentid'),
        pinID = $(target).data('pinid');

    if (!$(target).find('.comment-options').hasClass('active')) {
        markerSelected(pinID);
        $(target).children('.comment-options').addClass('active').slideDown();
        
    }
});

$(document).on('click', '.left-menu-item.closed .left-menu-item-title', function () {
    var target = this;
    $('.left-menu-item.open .left-menu-item-list').slideUp();
    $('.left-menu-item.open').removeClass('open').addClass('closed');
    
    $(this).parent().children('.left-menu-item-list').slideDown();
    $(this).parent().removeClass('closed').addClass('open');
});

function clearCommentOptions() {
    $('.comment-options').removeClass('active').slideUp();
};

var bMenuToggle = function () {
    $('#comments-block').toggleClass('open');
    clearCommentOptions();
};

var addMarker = function (id, lat, lon) {
    var marker = new L.marker([lat, lon]);
    marker.on('click', markerClick);
    marker.pinID = id;
    markers.addLayer(marker);
    map.addLayer(markers);
};

var mapClick = function (event) {
    selectedMarkerID = null;
    markerToggle();
    
    //hide comments
    $('#addComment').slideUp();
    
    if ($('#left-menu-pin').hasClass('on')) {
        $('#left-menu-pin').toggleClass('on');
        $.post('/pin', { 'lat': event.latlng.lat, 'lon': event.latlng.lng }, function (data) {
            console.log(data);
            if (data.status === 'success') {
                addMarker(data.pin, event.latlng.lat, event.latlng.lng);
            }
        });        
    }
};

var mapDblClick = function(event){
    console.log('start mapDblClick');
}

//executes after the map is zoomed in/out, moved, or re-sized
var mapMoveEnd = function(event){
    console.log('start mapMoveEnd');
    console.log(event);
    markers.clearLayers();
    getPins();
    selectedMarkerID = null;    
}

//when a marker is clicked or tabbed to and enter is pressed
var markerClick = function (event) {
    markerToggle (event.target.pinID);
};

//get the pins for the visible area
var getPins = function () {
    console.log('start getPins');
    var viewBondary = map.getBounds(),
        north = viewBondary.getNorth(),
        east = viewBondary.getEast(),
        south = viewBondary.getSouth(),
        west = viewBondary.getWest();

    viewPins = null;
    $.getJSON('/pins', {viewBoundary: {'north': north, 'east': east, 'south': south, 'west': west}})
        .done(function (data) {
            console.log('getPins .done');
            if (data.status !== 'error') {
                var i,
                    marker;
                for (i in data) {
                    if (data.hasOwnProperty(i)) {
                        viewPins = data;
                        addMarker(data[i]._id, data[i].location.coordinates[0], data[i].location.coordinates[1]);
                    }
                }

                getComments();
            } else {
                console.log('error-' + data.reason);
            }
        })
        .fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            console.log("getPins Failed: " + err);
        });
    console.log('end getPins');
};
