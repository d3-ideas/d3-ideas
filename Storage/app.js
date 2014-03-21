//Module dependencies.
var express = require('express');
var pins = require('./routes/pins');
var users = require('./routes/users');
var http = require('http');
var path = require('path');

var app = express();
var io = require('socket.io').listen(app);

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

app.get('/pins', pins.findAllPins(db));
//app.get('/pins/:id', pins.findById);
app.post('/pins', pins.addPin(db));
app.get('/pins/within', pins.findPinsWithin(db));
app.post('/updatePin', pins.updatePin(db));
app.get('/tags', pins.getTags(db));

app.get('/users', users.checkUser(db));
app.post('/users', users.addUser(db));

io.sockets.on('connection', function (socket) {
    socket.on('getPinsAll', function (data) {
        console.log(data);
        pins.findAllPins(db, data)  // will need to modify the findAllPins arguments
        
        // do I emit a response?
    });
    
    // other function calls
});



http.createServer(app).listen(app.get('port'), function () {
    console.log('          / \\');
    console.log('         / 3 \\');
    console.log('        /     \\');
    console.log('       /       \\');
    console.log('      /   d 3   \\');
    console.log('     /   ideas   \\');
    console.log('    /             \\');
    console.log('   /               \\');
    console.log('  / 1             2 \\');
    console.log(' /___________________\\');
    console.log('Express server listening on port ' + app.get('port'));
    console.log('Press ctrl+c to exit');
});