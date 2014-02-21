exports.registerGet = function (req, res) {
    res.render('register', { title: 'Registration' });
};

exports.registerPost = function (req, res) {
    console.log(req.body);
    res.json({status: 'approved'});
    //res.json({status: 'error', reason:'Sorry, that user already exists.'});
    //res.json({status: 'error', reason:"Shit's on fire, yo"});
};