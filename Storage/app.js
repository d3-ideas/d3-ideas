//Module dependencies.
var express = require('express');
var pins = require('./routes/pins');
var http = require('http');
var path = require('path');

var app = express();

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
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/pins', pins.findAllPins);
//app.get('/pins/:id', pins.findById);
app.post('/pins', pins.addPin(db));
//app.put('/pins/:id', pins.updatePin);
//app.delete('/pins/:id', pins.deletePin);

http.createServer(app).listen(app.get('port'), function(){
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