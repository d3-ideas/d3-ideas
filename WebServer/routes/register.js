exports.registerGet = function (req, res) {
    res.render('register', { title: 'Registration' });
    console.log(req.session.username);
};

exports.registerPost = function (req, res) {
    req.session.username=req.body.username;
    console.log(req.body.username);
    console.log(req.session);
    res.json({status: 'approved'});
    //res.json({status: 'error', reason:'Sorry, that user already exists.'});
    //res.json({status: 'error', reason:"Shit's on fire, yo"});
};