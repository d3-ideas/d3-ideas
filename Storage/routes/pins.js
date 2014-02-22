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
        
        var gjv = require('geojson-validation');
        
        var location = req.body.location; 
        var username = req.body.username;
        var pintime = new Date();
        var application = req.body.application;
        
        if(!gjv.isPoint(location)){
            res.send({'error':'The pin location was invalid.'});
            return;
        }
        
        if(!checkApp(location, db)){
            res.send({'error':'The application was invalid.'});
            return;
        }
        
        var collection = db.get('pins');
    
        collection.insert({
            'Location' : location,
            'UserName' : username,
            'PinTime' : pintime,
            'Application' : application
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

	
checkApp = function(findapp, db){
    return function(req, res){
        var apps = db.get('apps');
 
        apps.insert({'application':findapp});
 
        apps.findOne({application:findapp}, function(err,foundapp){
            console.log('foundapp: ' + foundapp.application);
            if(foundapp.application == findapp) res.send(true);
            else res.send(false);
        });        
    }    
}
