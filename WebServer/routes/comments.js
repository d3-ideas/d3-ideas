var http = require('http'),
	findHashTags = require('find-hashtags'),
	ourTags = [];


//accept a post to update a pin
exports.addComment = function (req, res) {

    var returnData,
		theTags = findHashTags(req.body.comment),
        ourContent = JSON.stringify({
			'application': 'Tagit Test',
            'pinID': req.body.pinID,
            'userID': req.session.userID,
            'tags': [req.body.comment]
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
					console.log('\\/ addComment return from storage engine \\/');
					console.log(data);
                    if (data.status === 'success') {
                        //return the comment id to the client
                        res.json({'status': 'success'});
                    } else {
                        console.log('there was an error');
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
	console.log(theTags);
};

exports.getComments = function (req, res) {

    var ourContent = JSON.stringify({'application': 'Tagit Test',
        'pinIDs': req.query.pinIDs,
        'userID': req.session.userID,
        'filter': ''
        }),
		theTags,
        returnData,
        options = {
            hostname: 'localhost',
            port: 3001,
            path: '/tags',
            method: 'GET',
            headers: {'content-type': 'application/json',
                    'content-length': ourContent.length}
        },
        ourGet = http.request(options, function (postRes) {
            postRes.setEncoding('utf8');

            postRes.on('data', function (chunk) {
                if (typeof returnData !== 'undefined') {
                    returnData += chunk;
                } else {
                    returnData = chunk;
                }
            });

            postRes.on('end', function () {
				returnData=JSON.parse(returnData);
				for (i in returnData.tags){
					returnData.tags[i].tags=findHashTags(returnData.tags[i].tag);
					if (returnData.tags[i].tags !== null){
						returnData.tags[i].tags=returnData.tags[i].tags.sort();
					}
				}
                res.json(returnData);
            });
        });

    ourGet.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    // write data to request body
    ourGet.write(ourContent);
    ourGet.end();
};
