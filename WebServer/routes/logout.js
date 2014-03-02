exports.logout = function (req, res) {
    console.log(req.session.username + ' logged out.');
    res.clearCookie('app.sess');
    res.redirect('/');
}