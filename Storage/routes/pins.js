exports.findAllPins = function (db) {
    return function (req, res) {
        var collection = db.get('pins'),
            stream = collection.find({}, {}, function (err, pins) {
                res.json(pins);
            });
    };
};

exports.addPin = function (db) {
    return function (req, res) {
        
        console.log(req.body);
        
        var gjv = require('geojson-validation'),
            location = req.body.location,
            username = req.body.username,
            pintime = new Date(),
            application = req.body.application,
            apps = db.get('apps');
 

        if (!gjv.isPoint(location)) {
            res.send({'error': 'The pin location was invalid.'});
            return;
        }

// Uncomment the next line to insert the application pin (only need to do this once)        
//        apps.insert({'Application':application});
        
        apps.findOne({'Application': application}, function (err, foundapp) {
            if (!foundapp) {
                res.send({'error': 'The application was invalid.'});
            } else {
                application = foundapp._id;
                var collection = db.get('pins');
    
                collection.insert({
                    'Location': location,
                    'UserName': username,
                    'PinTime': pintime,
                    'Application': application
                }, function (err, doc) {
                    if (err) {
                        res.send({'error': 'An error has occurred adding your pin'});
                    } else {
                        console.log('Successfully added pin');
                        res.send(doc); //You have pinned your location
                    }
                });
            }
        });
    };
};