var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

server.listen(80);

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/names.html');
});

function getNames (count, callback){
    console.log(count);
    var theReturn = '<h1>Here are names</h1>' + count;
    if (true){ //db call for example
        //it all worked well
        callback(undefined, theReturn);
    }
    else {
        var theError='something went wrong';
        callback(theError, false);
    }
};

app.get('/giveMeNames', function(req, res){
    console.log(req.query);
    getNames (req.query.count, function(error, theData){
        //checking for an error should be implemented.
        console.log('got http request for names');
        res.send(theData);
    });
});

io.sockets.on('connection', function (socket) {
    socket.on('giveMeAge', function (data){
        console.log(data);
        getAge(data.count, function(error, theData){
            if (typeof error !== 'undefined'){
                socket.emit('namesHere', {'error': error.error});
            }
            else {
                console.log('got socket request for names');
                socket.emit('namesHere', {'data': theData});
            }
        });
    });
    socket.on('giveMeNames', function (data){
        console.log(data);
        getNames(data.count, function(theData){
            console.log('got socket request for names');
            socket.emit('namesHere', {'data': theData});
        });
    });
});