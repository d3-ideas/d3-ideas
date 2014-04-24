var http = require('http'),
	findHashTags = require('find-hashtags'),
	ourTags = [],
	_ = require('underscore');

function updateTags(newTags) {
	ourTags = _.union(ourTags,newTags);
	ourTags = ourTags.sort();
	console.log("ourTags: " + ourTags);
}

function parseComment(storageTag) {
	var thisComment = {
		_id: storageTag._id,
		pin: storageTag.pin,
		createdOn: storageTag.createdOn,
		username: null,
		comment: storageTag.tag,
		tags: findHashTags(storageTag.tag)
	};

	if (thisComment.tags !== null) {
		thisComment.tags = thisComment.tags.sort();
		updateTags(thisComment.tags);
	}
	return thisComment;
}

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
                    var data = JSON.parse(returnData),
						comment;

                    if (data.status === 'success') {
                        comment = {
							_id: data.tags[0]._id,
							pin: data.tags[0].pin,
							createdOn: data.tags[0].tag.createdOn,
							username: data.tags[0].username,
							comment: data.tags[0].tag,
							tags: findHashTags(data.tags[0].tag)
						};
                        
						if (comment.tags !== null) {
							comment.tags = theTags.sort();
							updateTags(comment.tags);
						}
                        res.json(comment);
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
	//console.log(theTags);
};

exports.getComments = function (req, res) {

    var ourContent = JSON.stringify({'application': 'Tagit Test',
        'pinIDs': req.query.pinIDs,
        'userID': req.session.userID,
        'filter': ''
        }),
        returnData,
		comments,
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
				returnData = JSON.parse(returnData);
                comments = returnData.tags.map(parseComment);
                res.json(comments);
            });
        });

    ourGet.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    // write data to request body
    ourGet.write(ourContent);
    ourGet.end();
};