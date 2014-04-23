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

var getCommentHTML = function (comment) {
    return  '<div class="comment-item" data-commentid="' + comment._id + '" data-pinid="' + comment.pin + '">' +
                                '<p>' + comment.comment + '</p>' +
                                '<p>' + moment(comment.createdOn).fromNow() + '</p>' + 
                                '<div class="comment-options"><span>Options here...</span></div></div>';
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
                var i;
                if (Array.isArray(data)) {
                    console.log('getComments isArray');
                    comments = data.map(function (comment) {
                        return getCommentHTML(comment);
                    });
                        
                    console.log(comments);
                    $('#comments-content').html(comments.join(''));
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
   
    $.post('/comment', {'pinID': selectedMarkerID, 'comment': comment})
        .done(function (data) {
            //get latest pins?
            console.log('post /comment succedded');                
            console.log(data);
            $('#comments-content').prepend(getCommentHTML(data));
            $("#newComment").val('');
            console.log(selectedMarkerID);
        })
        .fail(function() {
            console.log('post /comment failed!');
            console.log(data);
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
    
    console.log($('.comment-item[data-pinid="'+pinID+'"]'));
    $('.comment-item[data-pinid="'+pinID+'"]').show();
    $('.comment-item[data-pinid!="'+pinID+'"]').hide();
};

var markerDeSelected = function () {
    selectedMarkerID = null;
    markers.eachLayer(function(marker) {
        marker.setOpacity(1);
    });

    $('#addComment').slideUp();
    $('.comment-options').removeClass('active').slideUp();
    $('.comment-item').show();
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
