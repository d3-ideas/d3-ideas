var http = require('http');

exports.main = function (req, res) {
    res.render('main', { title: 'TagIt' });
};

