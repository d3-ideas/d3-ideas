/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var register = require('./routes/register');
var pin = require('./routes/pin');
var login = require('./routes/login');
var http = require('http');
var path = require('path');

var app = express();
var MongoStore = require('connect-mongo')(express);

// all environments
app.set('port', process.env.PORT || 80);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('zuperzecret here'));
app.use(express.session({
    key: 'app.sess',
    store: new MongoStore({
        db: 'Sessions',
        host: 'localhost',
        port: 27017
    }),
    secret: 'zuperzecret here',
    cookie: {maxAge:new Date(Date.now()+24*60*60)}
}));
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/register', register.registerGet);
app.post('/register', register.registerPost);
app.get('/login', login.loginGet);
app.post('/login', login.loginPost);
app.get('/pin', pin.pin);
app.post('/pin', pin.addPin);

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
