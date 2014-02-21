exports.addUser = function(db){
    return function(req, res){
        console.log('adding user');
        
        var username = req.body.username; 
        var password = req.body.password;
        var createdOn =req.body.createdOn;
        var AddedOn = Date.now()
        
        var collection = db.get('users');
    
        collection.insert({
            "username" : username,
            "password" : password,
            "createdOn" : createdOn,
            "AddedOn" : AddedOn
        }, function (err,doc){
            if (err) {
                res.send({'error':'An error has occurred adding your user'});
            } else {
                console.log('Successfully added user');
                res.send(doc);
            }
        });
    };
}