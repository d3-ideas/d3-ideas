var latlon,
    map,
    bMenuVisible,
    selectedMarkerID = null,
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
                        //return '<div class="comment">' + tag.tag + '</div>';
                        return '<div class="comment-item" data-commentid="' + tag._id + '">' +
                                '<p>' + tag.tag + '</p>' + 
                                '<div class="comment-options"><span>Options here...</span></div></div>';
                    });
                    
                    $('#comments-content').append(comments.join(''));
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
    console.log({'pinID': selectedMarkerID, 'comment': comment});
   
    $.post('/comment', {'pinID': selectedMarkerID, 'comment': comment}, function (data) {
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

var addMarker = function (id, lat, lon){
    var marker = new L.marker([lat, lon]);
    marker.on('click', markerClick);
    marker.pinID = id;
    map.addControl(marker);
    console.log(marker);
};

var mapClick = function (event) {
    console.log('mapclick');
    console.log(event);
    selectedMarkerID = null;
    
    //hide comments
    $('#addComment').slideUp();
    bMenuHide();
    
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

var markerClick = function (event) {
    selectedMarkerID = event.target.pinID;

    //need to filter comments to only this marker
    $('#addComment').slideDown();
    bMenuShow();
};

