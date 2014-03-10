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

        function addTag(newTag) {
            var ctags = db.get('tags');
            
            if (!newTag) {
                ctags.insert({
                    'pin': this._id,
                    'tag': newTag,
                    'createdOn': this.pinTime,
                    'username': this.userID
                }, function (err, tag) {
                    if (err) {
                        return {'status': 'error',
                                'reason': 'An error has occurred adding your tag'};
                    } else {
                        return {'status': 'success',
                                'tag': tag};
                    }
                });
            } else {
                return {'status': 'error',
                      'reason': 'The tag was invalid.'};
            }
        }
        
        var gjv = require('geojson-validation'),
            location = req.body.location,
            userID = req.body.userID,
            pintime = new Date(),
            application = req.body.application,
            tags = req.body.tags,
            tagresult,
            apps = db.get('apps');
 

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
                            tagresult = tags.map(addTag, doc);
                        }
                        
                        console.log('Successfully added pin');
                        res.json({'status': 'success',
                                  'pin': doc,
                                  'tags': tagresult}); //You have pinned your location
                    }
                });
            }
        });
    };
};

exports.updatePin = function (db) {
    return function (req, res) {
        console.log(req.body);
        res.json({'status' : 'success'});
    };
};