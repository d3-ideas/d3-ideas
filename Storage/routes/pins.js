function addTag(db, tagobject, callback) {
    var ctags = db.get('tags'),
        success = true,
        tags = tagobject.tags,
        i;

    for (i in tags) {
        if (tags.hasOwnProperty(i)){
            ctags.insert({
                'pin': tagobject.pinID,
                'tag': tags[i],
                'createdOn': tagobject.createdOn,
                'username': tagobject.userID,
                'application': tagobject.application
            }, function (err, tag) {
                if (err) {
                    console.log(err);
                    success = false;
                }
            });
        }
    } 
    //maybe we return true if it worked, false if it didn't?
    callback(success);
}

exports.findAllPins = function (db) {
    return function (req, res) {
        var collection = db.get('pins'),
            stream = collection.find({}, {}, function (err, pins) {
                res.json(pins);
            });
    };
};

exports.findPinsWithin = function (db) {
    return function (req, res) {
        var collection = db.get('pins'),
            polyFind = req.body.searchArea,
            gjv = require('geojson-validation');
            
        if (!gjv.isPolygon(polyFind)) {
            res.json({'status': 'error',
                      'reason': 'The searchArea polygon was not valid.'});
            return;
        }
        
        collection.find(
            {'location': { $geoWithin: { $geometry: polyFind } } },
            {},
            function (err, pins) {
                if (err) {
                    res.json({'status': 'error',
                            'reason': err});
                    console.log('findPinsWithin failed - ' + err);
                }
                res.json(pins);
            }
        );
    };
};

exports.addPin = function (db) {
    return function (req, res) {
        
        console.log(req.body);
        
        var gjv = require('geojson-validation'),
            location = req.body.location,
            userID = req.body.userID,
            pintime = new Date(),
            application = req.body.application,
            tags = req.body.tags,
            tagresult,
            apps = db.get('apps'),
            newPin = {'location': location,
                      'userID': userID,
                      'createdOn': pintime,
                      'application': application};
 

        if (!gjv.isPoint(location)) {
            res.json({'status': 'error',
                      'reason': 'The pin location was invalid.'});
            return;
        }

// Uncomment the next line to insert the application pin (only need to do this once)        
        //apps.insert({'application':application});
        
        apps.findOne({'application': application}, function (err, foundapp) {
            if (!foundapp) {
                res.json({'status': 'error',
                          'reason': 'The application was invalid.'});
            } else {
                application = foundapp._id;
                var collection = db.get('pins');
    
                collection.insert({
                    'location': location,
                    'userID': userID,
                    'createdOn': pintime,
                    'application': application
                }, function (err, doc) {
                    if (err) {
                        res.json({'status': 'error',
                                  'reason': 'An error has occurred adding your pin'});
                    } else {
                        if (Array.isArray(tags)) {
                            var newPin = {'userID': userID,
                                        'createdOn': pintime,
                                        'application': application,
                                        'tags': tags,
                                        'pinID': doc._id};
                            addTag(db, newPin, function(result){
                                //maybe some logic here to check the result?
                                //result will have the context of variables in addTag
                                res.json({'status': 'success',
                                          'pin': doc,
                                          'tags': tagresult}); //You have pinned your location
                            });
                        }
                        console.log('Successfully added pin');
                    };
                });
            }
        });
    };
}

exports.updatePin = function (db) {
    return function (req, res) {
        console.log(req.body);
        
        var location = req.body.location,
            userID = req.body.userID,
            pintime = new Date(),
            pinID = req.body.pinID,
            application = req.body.application,
            tags = req.body.tags,
            apps = db.get('apps');

        apps.findOne({'application': application}, function (err, foundapp) {
            if (!foundapp) {
                res.json({'status': 'error',
                          'reason': 'The application was invalid.'});
            } else {
                application = foundapp._id;
                
                if (Array.isArray(tags)) {
                    var newPin = {'userID': userID,
                                'createdOn': pintime,
                                'application': application,
                                'tags': tags,
                                'pinID': pinID};
                    addTag(db, newPin, function(result){
                        //maybe some logic here to check the result?
                        //result will have the context of variables in addTag
                        res.json({'status': 'success',
                                  'pin': pinID,
                                  'tags': tags}); //You have pinned your location
                    });
                }
            };
        });
    };
};

exports.getTags = function (db) {
    return function (req, res) {
        console.log(req.body);
        
        var pinID = req.body.pinIDs,
            application = req.body.application,
            apps = db.get('apps'),
            tags = db.get('tags');

        apps.findOne({'application': application}, function (err, foundapp) {
            if (!foundapp) {
                res.json({'status': 'error',
                          'reason': 'The application was invalid.'});
            } else {
                application = foundapp._id;
                
                tags.find({'pin': {$in: pinID}}, function (err, pinTags) {
                    if (!pinTags) {
                        res.json({'status': 'error',
                                  'reason': 'The pin was invalid.'});
                    } else {
                        res.json({'status': 'success',
                                  'pin': pinID,
                                  'tags': pinTags});
                
                    }
                });
            };
        });
    };
};