exports.findAllPins = function(db){
    return function(req, res){
        var collection = db.get('pins');
        collection.find({}, {}, function(err, pins) {
            res.send(pins);
        });
    };
};

exports.addPin = function(db){
    return function(req, res){
        
        console.log(req.body);
        
        var location = req.body.location; 
        var username = req.body.username;
        var pintime = req.body.pintime;
    
        var collection = db.get('pins');
    
        collection.insert({
            "location" : location,
            "username" : username,
            "pintime" : pintime
        }, function (err,doc){
            if (err) {
                res.send({'error':'An error has occurred adding your pin'});
            } else {
                console.log('Successfully added pin');
                res.send(doc); //You have pinned your location
            }
        });
    }
};
