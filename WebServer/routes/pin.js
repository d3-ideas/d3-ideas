module.exports = function (socket) {
    /* 
    * Post for pins - acts as middle layer between the web client and the storage server
    * takes a post and sends it to the storage system
    */
    var routes = {},
		http = require('http');

    //route for /pin GET
    routes.pin = function (req, res) {
        if (typeof req.session.username !== 'undefined') {
            res.render('pin', { title: 'TagIt', username: req.session.username});
        } else {
            res.redirect('/');
        }
    };

    //route for /pin POST
    routes.addPin = function (req, res) {
        var ourContent = JSON.stringify({
            'application': 'Tagit Test',
            'location': {'type': 'Point',
                'coordinates': [parseFloat(req.body.lat), parseFloat(req.body.lon)]},
            'userID': req.session.userID,
            'tags': ['tag1', 'tag2', 'tag3']  //placeholder for app defined tags
        });
        socket.emit('addPin', ourContent);
    };

    //route for /pins GET
    routes.getPins = function (req, res) {
        var returnData,
            north = Number(req.query.viewBoundary.north),
            south = Number(req.query.viewBoundary.south),
            east = Number(req.query.viewBoundary.east),
            west = Number(req.query.viewBoundary.west),
            dReq = JSON.stringify({'application': 'Tagit Test',
                                   'userID': req.session.userID,
                                   'filter': '',
                                   'searchArea': {'type': 'Polygon', 'coordinates': [[[north, east], [south, east], [south, west], [north, west], [north, east]]]}});
        socket.emit('getPinsWithin', dReq);
        socket.on('getPinsWithin', function () {
            if (typeof returnData !== 'undefined') {
                returnData = JSON.parse(returnData);
                if (returnData.status === 'error') {
                    res.json({status: 'error', 'reason': returnData.reason});
                } else {
                    res.json(returnData);
                }
            } else {
                console.log('returnData is undefined');
                res.json({status: 'error', 'reason': 'returnData is undefined'});
            }
        });
    };
    return routes;
};