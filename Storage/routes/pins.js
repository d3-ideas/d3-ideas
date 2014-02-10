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