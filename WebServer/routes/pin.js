/* 
* Post for pins - acts as middle layer between the web client and the storage server
* takes a post and sends it to the storage system
*/
var http = require('http');

exports.pin = function(req, res){
  res.render('pin', { title: 'TagIt' });
};

exports.addPin = function (req, res){
        console.log(req.body);

        var ourContent=JSON.stringify({'application':'Tagit Test','location':{'type':'Point','coordinates':[req.body.lat,req.body.lon]},'username':'sheetzam','pintime':new Date()});

        var options = {
                hostname: 'localhost',
                port: 3001,
                path: '/pins',
                method: 'POST',
                headers: {'content-type':'application/json',
                        'content-length':ourContent.length}
        };

        var origres = res;
        var ourPost = http.request(options, function(res) {
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');

            res.on('data', function (chunk) {
                console.log('BODY: ' + chunk);
            });

            //return success to the client
            origres.send(200);
        });

        ourPost.on('error', function(e) {
                console.log('problem with request: ' + e.message);
        });

        // write data to request body
        ourPost.write(ourContent);
        ourPost.end();
};
