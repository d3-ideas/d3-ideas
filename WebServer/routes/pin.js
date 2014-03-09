/* 
* Post for pins - acts as middle layer between the web client and the storage server
* takes a post and sends it to the storage system
*/
var http = require('http');

//route for /pin GET
exports.pin = function (req, res) {
    
    if (typeof req.session.username !== 'undefined') {
        res.render('pin', { title: 'TagIt', username: req.session.username});
    } else {
        res.redirect('/');
    }
};

//route for /pin POST
exports.addPin = function (req, res) {
    var ourContent = JSON.stringify({'application': 'Tagit Test',
            'location': {'type': 'Point',
                      'coordinates': [parseFloat(req.body.lat), parseFloat(req.body.lon)]},
            'userID': req.session.userID,
            'tags': ['tag1', 'tag2', 'tag3']  //placeholder for app defined tags
            }),
        
        options = {
            hostname: 'localhost',
            port: 3001,
            path: '/pins',
            method: 'POST',
            headers: {'content-type': 'application/json',
                    'content-length': ourContent.length}
        },
        origres = res,
        ourPost = http.request(options, function (res) {
            res.setEncoding('utf8');

            res.on('data', function (chunk) {
                origres.json(JSON.parse(chunk));
            });
        });

    ourPost.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    // write data to request body
    ourPost.write(ourContent);
    ourPost.end();
};

//route for /pins GET
//Performs GET request to storage to get pins for the user
exports.getPins = function (req, res) {
    var returnData,
        north = Number(req.query.viewBoundary.north),
        south = Number(req.query.viewBoundary.south),
        east = Number(req.query.viewBoundary.east),
        west = Number(req.query.viewBoundary.west);
    var dReq = JSON.stringify({'application': 'Tagit Test',
                               'userID': req.session.userID,
                               'filter': '',
                               'searchArea': {'type': 'Polygon', 'coordinates': [[[north,east],[south,east],[south,west],[north,west],[north,east]]]}}),
        options = {
            hostname: 'localhost',
            port: 3001,
            path: '/pins/within',
            method: 'GET',
            headers: {'content-type': 'application/json',
                    'content-length': dReq.length}
        },
        oRes = res,
        dGet = http.request(options, function (dRes) {
            dRes.setEncoding('utf8');
            dRes.on('data', function (chunk) {
                if (typeof returnData !== 'undefined') {
                    returnData += chunk;
                } else {
                    returnData = chunk;
                }
            });
            
            dRes.on('end', function () {
                if (typeof returnData !== 'undefined') {
                    returnData = JSON.parse(returnData);
                    if (returnData.status == 'error') {
                        res.json({status: 'error', 'reason': returnData.reason});
                    } else {
                        res.json(returnData);
                    }
                } else {
                    console.log('returnData is undefined');
                    res.json({status: 'error', 'reason': 'returnData is undefined'});
                }
            });
        });
    dGet.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    dGet.write(dReq);
    dGet.end();
};