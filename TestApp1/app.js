var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

server.listen(80);

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/names.html');
});

function getNames (callback){
    var theReturn = '<h1>Here are names</h1>';
    callback(theReturn);
};

app.get('/giveMeNames', function(req, res){
    getNames (function(theData){
        console.log('got http request for names');
        res.send(theData);
    });
});

io.sockets.on('connection', function (socket) {
    socket.on('giveMeNames', function (data){
        getNames(function(theData){
            console.log('got socket request for names');
            socket.emit('namesHere', {'data': theData});
        });
    });
});