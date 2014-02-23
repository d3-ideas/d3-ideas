exports.addUser = function (db) {
    return function (req, res) {
        console.log('adding user');
        
        var username = req.body.username,
            password = req.body.password,
            createdOn = req.body.createdOn,
            AddedOn = Date.now(),
            collection = db.get('users');
    
        collection.insert({
            "username" : username,
            "password" : password,
            "createdOn" : createdOn,
            "AddedOn" : AddedOn
        }, function (err, doc) {
            if (err) {
                res.send({'error': 'An error has occurred adding your user ' + req.body.username});
            } else {
                console.log('Successfully added user ' + req.body.username);
                res.send(doc);
            }
        });
    };
};
exports.checkUser = function (db) {
    return function (req, res) {
        console.log('checking user');
    };
};