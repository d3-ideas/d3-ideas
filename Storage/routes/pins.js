function addTag(db, tagobject, callback) {
    var cTags = db.get('tags'),
        resultTags = new Array(0),
        tags = tagobject.tags,
        i;
    
    function tagAdded(err, tag){
        if (err){
            console.log(err); 
            resultTags.push({'error': err});
        }
        else{
            resultTags.push(tag);
        }
        
        if(resultTags.length == tags.length){
            console.log('Tags Done : ' + resultTags);
            callback(resultTags);
        }
    }
    
    for (i in tags) {
        if (tags.hasOwnProperty(i)) {
            cTags.insert({
                'pin': tagobject.pinID,
                'tag': tags[i],
                'createdOn': tagobject.createdOn,
                'username': tagobject.userID,
                'application': tagobject.application
            }, tagAdded);
        }
    }
}


// Find all the pins in the db
// returns an array of pins.
exports.findAllPins = function (db, data, callback) {
    var cPins = db.get('pins');

    cPins.find({}, {}, function (err, pins) {
        if(err){
            callback({'error': err}, {});
        }
        else{
            callback(undefined, pins);
        }
    });
};


// Find all the pins within a specified polygon
// returns an array of pins.
exports.findPinsWithin = function (db, data, callback) {
	if (typeof data !== 'object'){
		var newData = JSON.parse(data);
	}
	else {
		newData = data;
	}
    var cPins = db.get('pins'),
        polyFind = newData.searchArea,
        gjv = require('geojson-validation');
            
    if (!gjv.isPolygon(polyFind)) {
        callback({'status': 'error',
                  'reason': 'The searchArea polygon was not valid.'}, {});
        return;
    }
        
    cPins.find({'location': { $geoWithin: { $geometry: polyFind } } },
        {},
        function (err, pins) {
            if (err) {
                callback({'status': 'error',
                          'reason': err});
                console.log('findPinsWithin failed - ' + err);
            }
            callback(undefined, pins);
    });
};

exports.addPin = function (db, data, callback) {
    if (typeof data !== 'object'){
		var data = JSON.parse(data);
	}
 
    var gjv = require('geojson-validation'), 
        location = data.location,
        userID = data.userID,
        pinTime = new Date(), 
        application = data.application,
        tags = data.tags,
        cApps = db.get('apps'),
        cPins = db.get('pins'),
        newPin = {'location': location,
                  'userID': userID,
                  'createdOn': pinTime,
                  'application': application};
 
    if (!gjv.isPoint(location)) {
        callback({'status': 'error',
                  'reason': 'The pin location was invalid.'}, {});
        return;
    }

// *** Uncomment the next line to insert the application pin (only need to do this once)        
    //cApps.insert({'application':application});
        
    cApps.findOne({'application': application}, function (err, foundapp) {
        if (!foundapp) {
            callback({'status': 'error',
                      'reason': 'The application was invalid.'}, {});
        } else {
            application = foundapp._id;
            
            cPins.findOne({'location': location, 'application': application}, function (err, foundpin) {
                if (!foundpin) {
                    cPins.insert(newPin, function (err, doc) {
                        if (err) {
                            callback({'status': 'error',
                                      'reason': 'An error has occurred adding your pin'}, {});
                        } else {
                            if (Array.isArray(tags)) {
                                var tagPin = {'userID': userID,
                                              'createdOn': pinTime,
                                              'application': application,
                                              'tags': tags,
                                              'pinID': doc._id};
                                addTag(db, tagPin, function (tagresult) {
                                    callback(undefined, {'status': 'success',
                                              'pin': doc._id,
                                              'tags': tagresult});
                                });
                            }
                            console.log('Successfully added pin');
                        }
                    });
                } else {
                    if (Array.isArray(tags)) {
                        var tagPin = {'userID': userID,
                                    'createdOn': pinTime,
                                    'application': application,
                                    'tags': tags,
                                    'pinID': foundpin._id};
                        addTag(db, tagPin, function (tagresult) {
                            callback(undefined, {'status': 'success',
                                      'pin': foundpin._id,
                                      'tags': tagresult});
                        });
                    }
                        console.log('Successfully added tags to existing pin');
                }
            });   
        }
    });
};

exports.updatePin = function (db, data, callback) {
	if (typeof data !== 'object'){
		data = JSON.parse(data);
	}
        
    var location = data.location,
        userID = data.userID,
        pintime = new Date(),
        pinID = data.pinID,
        application = data.application,
        tags = data.tags,
        cApps = db.get('apps');

    cApps.findOne({'application': application}, function (err, foundapp) {
        if (!foundapp) {
            callback({'status': 'error',
                      'reason': 'The application was invalid.'}, []);
        } else {
            application = foundapp._id;
                
            if (Array.isArray(tags)) {
                var newPin = {'userID': userID,
                            'createdOn': pintime,
                            'application': application,
                            'tags': tags,
                            'pinID': pinID};
                addTag(db, newPin, function (result) {
                    callback(undefined, {'status': 'success',
                                  'pin': pinID,
                                  'tags': tags}); 
                });
            }
        }
    });
};

exports.getTags = function (db, data, callback) {
    var pinID = data.pinIDs,
        application = data.application,
        filter = data.filter,
        cApps = db.get('apps'),
        cTags = db.get('tags'),
        tagQuery;

    cApps.findOne({'application': application}, function (err, foundapp) {
        if (!foundapp) {
            callback({'status': 'error',
                      'reason': 'The application was invalid.'}, []);
        } else {
            application = foundapp._id;
                
            if (filter) {
                tagQuery = {'pin': {$in: pinID}, 'application': application, 'tag': filter};
            } else {
                tagQuery = {'pin': {$in: pinID}, 'application': application};
            }
                    
             cTags.find(tagQuery, {sort:{createdOn:-1}}, function (err, pinTags) {
                 if (!pinTags) {
                     callback({'status': 'error',
                               'reason': 'The pin was invalid.'}, []);
                 } else {
                     callback(undefined, {'status': 'success',
                               'pin': pinID,
                               'tags': pinTags});
             
                 }
             });
        }
    });
};

exports.deleteTag = function (db, data, callback) {
	if (typeof data !== 'object'){
		data = JSON.parse(data);
	}

    var tagID = data.tagIDs,
        application = data.application,
        cApps = db.get('apps'),
        cTags = db.get('tags'),
        tagQuery;

    cApps.findOne({'application': application}, function (err, foundapp) {
        if (!foundapp) {
            callback({'status': 'error',
                      'reason': 'The application was invalid.'}, []);
        } else {
            application = foundapp._id;
                
            tagQuery = {'_id': {$in: tagID}, 'application': application};
                    
            cTags.find(tagQuery, function (err, pinTags) {
                if (!pinTags) {
                    callback({'status': 'error',
                           'reason': 'The pin was invalid.'}, undefined);
                } else {
                    callback(undefined, {'status': 'success',
                               'pin': pinID,
                               'tags': pinTags});
             
                }
            });
        }
    });
};