
/*
 * GET home page.
 */
var http = require('http');

exports.index = function(req, res){
  res.render('index', { title: 'd3-ideas' });
};

exports.pin = function (req, res){
	console.log(req.body);
	var options = {
		hostname: 'localhost',
		port: 3001,
		path: '/pins',
		method: 'POST',
		header: {'content-type':'application/json'}
	};

	var ourPost = http.request(options, function(res) {
		console.log('STATUS: ' + res.statusCode);
		console.log('HEADERS: ' + JSON.stringify(res.headers));
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			console.log('BODY: ' + chunk);
		});
	});

	ourPost.on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});

	// write data to request body
	ourPost.write(JSON.stringify({'location':[req.body.lat,req.body.long],'username':'sheetzam','pintime':new Date()}));
	ourPost.end();
};
