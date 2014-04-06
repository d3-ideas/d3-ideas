var express = require('express');
var app = express();
var exec = require('child_process').exec,
	child;
app.get('*', function(req, res){
	console.log(req.url);
	res.send('Hello World');
});
app.post('*', function(req, res){
	res.send('thanks');
	child=exec('cd .. && git pull',
		function (error, stdout, stderr){
			console.log('stdout: ' + stdout);
			console.log('stderr: ' + stderr);
			if (error !== null) {
				console.log('exec error: ' + error);
			}
		});
	
});
app.listen(4242);

