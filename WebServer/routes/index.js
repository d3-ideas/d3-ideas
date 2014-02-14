
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'd3-ideas' });
};

exports.pin = function (req, res){
	var options = {
		hostname: 'localhost',
		port: 3001,
		path: '/pins',
		method: 'POST'
	};

	var req = http.request(options, function(res) {
		console.log('STATUS: ' + res.statusCode);
		console.log('HEADERS: ' + JSON.stringify(res.headers));
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			console.log('BODY: ' + chunk);
		});
	});

	req.on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});

// write data to request body
req.write('data\n');
req.write('data\n');
req.end();
	res.render('pin', { foo: 'bar' });
};
