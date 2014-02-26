var http = require('http');

exports.registerGet = function (req, res) {
    res.render('register', { title: 'Tagit - Registration' });
    console.log(req.session.username);
};

exports.registerPost = function (req, res) {
    req.session.username = req.body.username;
    var crypto = require('crypto'),
        shaSum = crypto.createHash('md5'),
        password = req.body.password + 'd4bacon';
    
    shaSum.update(password);

    var returnData,
        hashedPassword = shaSum.digest('hex'),
        ourContent = JSON.stringify({'username': req.body.username,
                                    'password': hashedPassword,
                                    'createdOn': Date.now()}),
        options = {
            hostname: 'localhost',
            port: 3001,
            path: '/users',
            method: 'POST',
            headers: {'content-type': 'application/json',
                    'content-length': ourContent.length}
        },

        ourPost = http.request(options, function (returnRes) {
            returnRes.setEncoding('utf8');

            returnRes.on('data', function (chunk) {
                if (typeof returnData !== 'undefined') {
                    returnData += chunk;
                } else {
                    returnData = chunk;
                }
            });
            returnRes.on('end', function () {
                returnData = JSON.parse(returnData);
                if (typeof returnData.error !== 'undefined') {
                    res.json({status: 'error', 'reason': returnData.error});
                } else {
                    req.session.userID = returnData.userID;
                    //return success to the client
                    res.json({status: 'approved'});
                }
            });

        });
    

    ourPost.on('error', function (e) {
        console.log('problem with request: ' + e.message);
        res.json({status: 'error' + e.message});
    });

    // write data to request body
    ourPost.write(ourContent);
    ourPost.end();
};