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

    var hashedPassword = shaSum.digest('hex');
    var ourContent = JSON.stringify({'username': req.body.username,
                                    'password': hashedPassword,
                                    'createdOn': Date.now()}),
        options = {
                hostname: 'localhost',
                port: 3001,
                path: '/users',
                method: 'POST',
                headers: {'content-type':'application/json',
                        'content-length':ourContent.length}
        },

        origres = res,
        ourPost = http.request(options, function(res) {
            res.setEncoding('utf8');

            res.on('data', function (chunk) {
                console.log('BODY: ' + chunk);
            });

            //return success to the client
            origres.json({status: 'approved'});
        });
    

    ourPost.on('error', function (e) {
        console.log('problem with request: ' + e.message);
        origres.json({status: 'error' + e.message});
    });

    // write data to request body
    ourPost.write(ourContent);
    ourPost.end();
};