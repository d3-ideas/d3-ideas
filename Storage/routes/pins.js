var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;
var db;

MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, conn) {
    if(err) throw err;
    console.log("Connected to db");
    db = conn;
});

exports.findAllPins = function(req, res){
    db.collection('pins', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addPin = function(req, res){
    var pin = req.body;
    console.log('Adding pin: ' + JSON.stringify(pin));
    db.collection('pins', function(err, collection) {
        collection.insert(pin, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}