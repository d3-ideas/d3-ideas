var http = require('http');

exports.loginGet = function(req, res){
    //Should we check session state and pass through if they user already has a valid session?
    
    res.render('login', { title: 'TagIt' });
};

exports.loginPost = function(req, res){
    req.session.username=req.body.username;
    console.log('loginPost'+req.body);
    var ourContent = JSON.stringify({'username': req.body.username,
                                    'password': req.body.password});
    
    res.json({status: 'approved'});//just retrurn ok for testing
    
    /*var options = {
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
        origres.json({status: 'error' + e.message});
    });

    // write data to request body
    ourPost.write(ourContent);
    ourPost.end(); */
};