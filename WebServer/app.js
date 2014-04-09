/**
 * Module dependencies.
 */
var express = require('express');
//require for mongodb logging
var expressWinston = require('express-winston');
var winston = require('winston');
var MongoDB = require('winston-mongodb').MongoDB;
//
var routes = require('./routes');
var register = require('./routes/register');
var pin = require('./routes/pin');
var comments = require('./routes/comments');
var login = require('./routes/login');
var main = require('./routes/main');
var logout = require('./routes/logout');
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
//app.use(expressWinston.logger({
//    transports: [
//        new winston.transports.MongoDB({
//            'db': 'Logs',
//            'collection': 'wslog',
//            'host': 'localhost',
//            'port': 27017
//        })
//    ]
//}));
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
        //one day=24 * 60 * 60 * 1000
    cookie: {maxAge: 24 * 60 * 60 * 1000 * 365}
}));
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.index);
app.get('/register', register.registerGet);
app.post('/register', register.registerPost);
app.get('/login', login.loginGet);
app.post('/login', login.loginPost);
app.get('/pin', pin.pin);
app.post('/pin', pin.addPin);
app.get('/pins', pin.getPins);
app.get('/logout', logout.logout);
app.get('/main', main.main);
app.get('/updatePin', pin.updatePinGet);
app.post('/comment', comments.addComment);
app.get('/comment', comments.getComments);
app.post('//cgi-bin', function(req, res){
	console.log('got here');
	res.send('no');
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
/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});
