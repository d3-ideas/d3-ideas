/* 
* Post for pins - acts as middle layer between the web client and the storage server
* takes a post and sends it to the storage system
*/
var http = require('http');

exports.pin = function(req, res){
    res.render('pin', { title: 'TagIt' , username:req.session.username});
};

exports.addPin = function (req, res){
    var ourContent=JSON.stringify({'application':'Tagit Test','location':{'type':'Point','coordinates':[parseFloat(req.body.lat),parseFloat(req.body.lon)]},'username':req.session.username,'pintime':new Date()});


    var options = {
            hostname: 'localhost',
            port: 3001,
            path: '/pins',
            method: 'POST',
            headers: {'content-type':'application/json',
                    'content-length':ourContent.length}
    };

    var origres = res;
    var ourPost = http.request(options, function(res) {
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            //do something with data
        });

        //return success to the client
        origres.send(200);
    });

    ourPost.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

    // write data to request body
    ourPost.write(ourContent);
    ourPost.end();
};

//Performs GET request to storage to get pins for the user
exports.getPins = function (req, res){
    var dReq = JSON.stringify({'application':'Tagit Test', 
                               'username':req.session.username,
                               'filter':''});
    var options = {
            hostname: 'localhost',
            port: 3001,
            path: '/pins',
            method: 'GET',
            headers: {'content-type':'application/json',
                    'content-length':dReq.length}
    };
    
    var oRes = res;
    var dGet = http.request(options, function (dRes){
        dRes.setEncoding('utf8');
        
        dRes.on('data', function (data){
            console.log(data);
            oRes.json(data);
        });
    });
                
    dGet.on('error', function (e){
        console.log('problem with request: ' + e.message);
    });
    
    dGet.write(dReq);
    dGet.end();
};

