var http = require('http');

exports.registerGet = function (req, res) {
    res.render('register', { title: 'Registration' });
    console.log(req.session.username);
};

exports.registerPost = function (req, res) {
<<<<<<< HEAD
    req.session.username=req.body.username;
    console.log(req.body.username);
    console.log(req.session);
    res.json({status: 'approved'});
    //res.json({status: 'error', reason:'Sorry, that user already exists.'});
    //res.json({status: 'error', reason:"Shit's on fire, yo"});
=======
    console.log(req.body);
    var ourContent = JSON.stringify({'username': req.body.username,
                                    'password': req.body.password,
                                    'createdon': Date.now()});
    
    var options = {
                hostname: 'localhost',
                port: 3001,
                path: '/users',
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
            origres.json({status: 'approved'});
    });
    

    ourPost.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

    // write data to request body
    ourPost.write(ourContent);
    ourPost.end();    
>>>>>>> 1941a5d5f47707c672f274a471184ce273a4c675
};