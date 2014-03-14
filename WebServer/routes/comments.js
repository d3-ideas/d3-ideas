var http = require('http');

//accept a post to update a pin
exports.addComment = function (req, res) {
    console.log(req.body);

    var returnData,
        ourContent = JSON.stringify({'application': 'Tagit Test',
            'pinID': req.body.pinID,
            'userID': req.session.userID,
            'tags': [req.body.comment]  //or is this a tag? I dunno
            }),
        
        options = {
            hostname: 'localhost',
            port: 3001,
            path: '/updatePin',
            method: 'POST',
            headers: {'content-type': 'application/json',
                    'content-length': ourContent.length}
        },
        ourPost = http.request(options, function (postRes) {
            if (postRes.statusCode === 200) {
                postRes.setEncoding('utf8');

                postRes.on('data', function (chunk) {
                    if (typeof returnData !== 'undefined') {
                        returnData += chunk;
                    } else {
                        returnData = chunk;
                    }
                });
            
                postRes.on('end', function () {
                    var data = JSON.parse(returnData);
                    if (data.status === 'success') {
                        //return success to the client
                        res.json({'status': 'success'});
                    } else {
                        console.log('there was an error');
                        console.log(data);
                        res.json({'status': 'error', 'reason': data.reason});
                    }
                });
            } else {
                res.json({'status': 'error', 'reason': 'failed to get comment'});
            }
        });
    
    ourPost.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    // write data to request body
    ourPost.write(ourContent);
    ourPost.end();

};

exports.getComments = function (req, res) {
    console.log(req.body);

    var ourContent = JSON.stringify({'application': 'Tagit Test',
        'pinIDs': req.body.pinIDs,
        'userID': req.session.userID,
        'filter': ''
        }),
        
        options = {
            hostname: 'localhost',
            port: 3001,
            path: '/Tags',
            method: 'GET',
            headers: {'content-type': 'application/json',
                    'content-length': ourContent.length}
        },
        ourPost = http.request(options, function (postRes) {
            postRes.setEncoding('utf8');

            postRes.on('data', function (chunk) {
                res.json(JSON.parse(chunk));
            });
        });

    ourPost.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    // write data to request body
    ourPost.write(ourContent);
    ourPost.end();
};