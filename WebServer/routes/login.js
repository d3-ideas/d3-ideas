var http = require('http');

exports.loginGet = function (req, res) {
    //Should we check session state and pass through if they user already has a valid session?
    
    res.render('login', { title: 'TagIt - Login' });
};

exports.loginPost = function (req, res) {
    
    //calcuate our hashed password
    var crypto = require('crypto'),
        shaSum = crypto.createHash('md5'),
        password = req.body.password + 'd4bacon';
    
    shaSum.update(password);

    var returnData,
        hashedPassword = shaSum.digest('hex'),
        ourContent = JSON.stringify({'username': req.body.username,
                                    'password': hashedPassword}),
        options = {
            hostname: 'localhost',
            port: 3001,
            path: '/users',
            method: 'GET',
            headers: {'content-type': 'application/json',
                        'content-length': ourContent.length}
        },
        ourReq = http.request(options, function (returnRes) {
            if (returnRes.statusCode === 200) {
                returnRes.setEncoding('utf8');

                returnRes.on('data', function (chunk) {
                    if (typeof returnData !== 'undefined') {
                        returnData += chunk;
                    } else {
                        returnData = chunk;
                    }
                });
                returnRes.on('end', function () {
                    var data = JSON.parse(returnData);
                    if (data.status === 'success') {
                        console.log('user ' + req.body.username + ' logged in.');
                        //put back any session variables we need.
                        req.session.username = req.body.username;
                        req.session.userID = data.userID;
                        //return success to the client
                        res.json({'status': 'success'});
                    } else {
                        console.log('there was an error');
                        console.log(data);
                        res.json({'status': 'error', 'reason': data.reason});
                    }
                });
            } else {
                res.json({'status': 'error', 'reason': 'failed to get user'});
            }
        });
    
    ourReq.on('error', function (e) {
        res.json({status: 'error', 'reason': e.message});
    });

    // write data to request body
    ourReq.write(ourContent);
    ourReq.end();
};