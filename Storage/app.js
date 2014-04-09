//Module dependencies.
var express = require('express');
var pins = require('./routes/pins');
var users = require('./routes/users');
var http = require('http');
var path = require('path');

var app = express();
var io = require('socket.io').listen(3002, 'localhost');

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/Tagit');


// all environments
app.set('port', process.env.PORT || 3001);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('zuperzecret here'));
app.use(express.session());
app.use(app.router);


// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

//app.get('/pins/:id', pins.findById);
app.get('/users', users.checkUser(db));
app.post('/users', users.addUser(db));



app.get('/pins/within', function(req, res){
    //console.log(req.body);
    pins.findPinsWithin(db, req.body, function(error,result){
        if (typeof error !== 'undefined'){
            res.send({'error': error});
        }
        else {
            res.send(result);
        }
    });
});

app.get('/pins', function(req, res){
    //console.log(req.query);
    pins.findAllPins(db, req.query, function(error, result){
        if (typeof error !== 'undefined'){
            res.send({'error': error.error});
        }
        else {
            res.send(result);
        }
    });
});

app.post('/pins', function(req, res){
    //console.log(req.body);
    pins.addPin(db, req.body, function(error,result){
        if (typeof error !== 'undefined'){
            res.send({'error': error});
        }
        else {
            res.send(result);
        }
    });
});

app.post('/updatePin', function(req, res){
    //console.log(req.body);
    pins.updatePin(db, req.body, function(error,result){
        if (typeof error !== 'undefined'){
            res.send({'error': error});
        }
        else {
            res.send(result);
        }
    });
});

app.get('/tags', function(req, res){
    //console.log(req.body);
    pins.getTags(db, req.body, function(error,result){
		//console.log(error);
		//console.log(typeof error);
        if (typeof error !== 'undefined'){
            res.send({'error': error});
        }
        else {
            res.send(result);
        }
    });
});


io.sockets.on('connection', function (socket) {

    socket.on('getPinsAll', function (data) {
        //console.log(data);
        pins.findAllPins(db, data, function(error, res){
            if (typeof error !== 'undefined'){
                socket.emit('getPinsAll', {'error': error});
            }
            else {
                socket.emit('getPinsAll', {'data': res});
            }
        });        
    });

    socket.on('getPinsWithin', function (data) {
		console.log('in getPinsWithin');
        console.log(data);
        pins.findPinsWithin(db, data, function(error, res){
           if (typeof error !== 'undefined'){
                socket.emit('getPinsWithin', {'error':error});
            }
            else {
                socket.emit('getPinsWithin', {'data': res});
            }
        });        
    });

    socket.on('addPin', function (data) {
        //console.log(data);
        pins.addPin(db, data, function(error, res){
            if (typeof error !== 'undefined'){
                socket.emit('addPin', {'error':error});
            }
            else {
                socket.emit('addPin', {'data': res});
            }
        });        
    });

    socket.on('updatePin', function (data) {
        //console.log(data);
        pins.updatePin(db, data, function(error, res){
            if (typeof error !== 'undefined'){
                socket.emit('updatePin', {'error':error});
            }
            else {
                socket.emit('updatePin', {'data': res});
            }
        });        
    });

    socket.on('getTags', function (data) {
        //console.log(data);
        pins.getTags(db, data, function(error, res){
            if (typeof error !== 'undefined'){
                socket.emit('getTags', {'error':error});
            }
            else {
                socket.emit('getTags', {'data': res});
            }
        });        
    });
    
});



http.createServer(app).listen(app.get('port'), function () {
    console.log('          / \\');
    console.log('         / 3 \\');
    console.log('        /     \\');
    console.log('       /       \\');
    console.log('      /   d 4   \\');
    console.log('     /   ideas   \\');
    console.log('    /             \\');
    console.log('   /               \\');
    console.log('  / 1             2 \\');
    console.log(' /___________________\\');
    console.log('Express server listening on port ' + app.get('port'));
    console.log('Press ctrl+c to exit');
});