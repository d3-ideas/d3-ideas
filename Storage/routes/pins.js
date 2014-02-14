var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;
//var db;

//MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, conn) {
//    if(err) throw err;
//    console.log("Connected to db");
//    db = conn;
//});

//exports.findAllPins = function(req, res){
//    db.collection('pins', function(err, collection) {
//        collection.find().toArray(function(err, items) {
//            res.send(items);
//        });
//    });
//};

exports.addPin = function(db){
    return function(req, res)
    
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
                //console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
    }
    
}