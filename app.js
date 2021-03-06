var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var db = require('./db.js');
var bcrypt = require('bcrypt')

app.use(express.static('assets'));
app.use(bodyParser.json({limit: '20mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '20mb'}));


ledstatus = "green";
location = "unknown";

app.post('/login', function (req, res) {
		db ('users').select().where({email: req.body.email})
			.then(function(data) {
			if(data.length) {
				bcrypt.compare(req.body.password, data[0].password)
				.then(function (hashRes) {
					if (hashRes) {
						res.send('correct login information')
					}
					else {
						res.send('incorrect login information')
					}
				});
			
				
				
			}
			else { 
				res.send('email doesnt exist')
			}
	});
});

app.post('/signup', function(req,res) {
	if (req.body.password) {
		bcrypt.hash(req.body.password, 10).
		then(function (hash) {
			db('users').insert({
					email: req.body.email, password: hash
				})
			.then(function (data) { 
				res.send(data)
			});
		});
	}
});
	
app.get('/', function (req, res) {
    res.sendfile('assets/index.html');
});

app.get('/gifs', function (req, res) {
    res.sendfile('assets/gifs.html');
});

app.get('/breaker', function (req, res) {
    res.sendfile('assets/blockbreaker.html');
});

app.get('/motion', function(req, res) {
	console.log("Motion detected");
	request("https://maker.ifttt.com/trigger/web_button_is_pressed/with/key/l9uHDHqqI570kbcVJ9_jFummpIxMaD069ZRJXvCHLuW", function (error, response, body) {
		console.log('E-mail sent');
		res.send(200);
	});
	
});

app.get('/ledstatus', function(req, res) {
	res.send({ledstatus: ledstatus});
});



app.post('/location', function(req, res) {
	location = req.body.location;
	console.log("Location changed to", location);
	res.send(200);
});

app.get('/location', function(req, res) {
	res.send({"location": location});
});

app.post('/ledstatus', function(req, res) {
	if (ledstatus === "green") {
		ledstatus = "red";
	} else {
		ledstatus = "green";
	}
	res.sendfile('assets/index.html')
});

var port = process.env.PORT || 3000;

var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
});


