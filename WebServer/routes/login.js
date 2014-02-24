var http = require('http');

exports.loginGet = function(req, res){
    //Should we check session state and pass through if they user already has a valid session?
    
    res.render('login', { title: 'TagIt' });
};

exports.loginPost = function(req, res){
    req.session.username=req.body.username;
    var ourContent = JSON.stringify({'username': req.body.username,
                                    'password': req.body.password});
    
    //res.json({status: 'approved'});//just return ok for testing
    
    var options = {
                hostname: 'localhost',
                port: 3001,
                path: '/users/login',
                method: 'POST',
                headers: {'content-type':'application/json',
                        'content-length':ourContent.length}
    };

    var origres = res;
    var ourReq = http.request(options, function(res) {
        if (res.statusCode == 200){ 
            res.setEncoding('utf8');

            res.on('data', function (chunk) {
                var data = JSON.parse(chunk);
                if (data.status == 'success'){
                    console.log('success');
                    //return success to the client
                    origres.json({'status': 'success'});
                } else {
                    origres.json({'status': 'error', 'reason': data.reason});        
                }
            });


        } else {
            origres.json({'status': 'error', 'reason': 'failed to get user'});
        }
    });
    
    ourReq.on('error', function(e) {
        origres.json({status: 'error', 'reason': e.message});
    });

    // write data to request body
<<<<<<< HEAD
    ourPost.write(ourContent);
    ourPost.end(); 
=======
    ourReq.write(ourContent);
    ourReq.end(); 
>>>>>>> Add validation of user credentials
};