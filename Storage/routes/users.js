exports.addUser = function (db) {
    return function (req, res) {
        console.log('adding user');
//        console.log(req.body);
        
        var username = req.body.username,
            password = req.body.password,
            createdOn = req.body.createdOn,
            AddedOn = Date.now(),
            users = db.get('users');
    
        //see if we already have that user

        users.findOne({'UserName': req.body.username}, function (err, result) {
            if (!result) {
                //if not, insert
                users.insert({
                    "UserName" : username,
                    "Password" : password,
                    "CreatedOn" : createdOn,
                    "AddedOn" : AddedOn
                }, function (err, doc) {
                    if (err) {
                        console.log(err);
                        res.send({'error': 'An error has occurred adding your user ' + req.body.username});
                    } else {
                        console.log('Successfully added user ' + req.body.username);
                        console.log(doc._id);
                        res.json({"_id": doc._id});
                    }
                });
            } else {
                res.json({'error': 'The username is already taken'});
            }
        });
    };
};

exports.checkUser = function (db) {
    return function (req, res) {
        console.log('checking user');
        console.log(req.body);
        var users = db.get('users'),
            username = req.body.username,
            password = req.body.password;
        
        users.findOne({$and: [{'UserName': username, 'Password': password}]}, function (err, userPasswordOK) {
            if (userPasswordOK) {
                console.log(userPasswordOK);
                res.json({'status': 'success', 'userID': userPasswordOK._id});
            } else {
                users.findOne({'UserName': username}, function (err, userExists) {
                    if (userExists) {
                        res.json({'status': 'error', 'reason': 'The password was invalid.'});
                    } else {
                        res.json({'status': 'error', 'reason': 'The user login was invalid.'});
                    }
                });
            }
        });
    };
};