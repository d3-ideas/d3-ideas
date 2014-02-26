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

    var hashedPassword = shaSum.digest('hex'),
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
        origres = res,
        
        ourReq = http.request(options, function (res) {
            if (res.statusCode === 200) {
                res.setEncoding('utf8');

                res.on('data', function (chunk) {
                    var data = JSON.parse(chunk);
                    if (data.status === 'success') {
                        console.log('user ' + req.body.username + ' logged in.');
                        //return success to the client
                        origres.json({'status': 'success'});
                        //put back any session variables we need.
                        req.session.username = req.body.username;
                        req.session.userID = data.userID;
                    } else {
                        console.log('there was an error');
                        console.log(data);
                        origres.json({'status': 'error', 'reason': data.reason});
                    }
                });
            } else {
                origres.json({'status': 'error', 'reason': 'failed to get user'});
            }
        });
    
    ourReq.on('error', function (e) {
        origres.json({status: 'error', 'reason': e.message});
    });

    // write data to request body
    ourReq.write(ourContent);
    ourReq.end();
};