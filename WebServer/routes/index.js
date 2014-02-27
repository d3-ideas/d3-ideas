/*
 * GET home page.
 */
var http = require('http');

exports.index = function (req, res) {
    if (typeof req.session.username !== 'undefined') {
        res.redirect('/Pin');
    } else {
        res.render('index', { title: 'TagIt' });
    }
};