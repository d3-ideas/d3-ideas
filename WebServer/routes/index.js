
/*
 * GET home page.
 */
var http = require('http');

exports.index = function(req, res){
  res.render('index', { title: 'd3-ideas' });
};
