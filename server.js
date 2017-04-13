var express = require('express');
var bodyParser = require('body-parser');
var mysql      = require('mysql');
var request = require('request');
const cheerio = require('cheerio');

// var cluster = require('cluster');
// if (cluster.isMaster) {
//     cluster.fork();
//     cluster.fork();
//     cluster.fork();
//     cluster.fork();
// } else {
// 	var connection = mysql.createPool({
// 	  connectionLimit: 10,
// 	  host     : 'localhost',
// 	  user     : 'root',
// 	  password : 'user',
// 	  database : 'linkquidator'
// 	});
// }

var connection = mysql.createPool({
	  connectionLimit: 10,
	  host     : 'localhost',
	  user     : 'root',
	  password : 'user',
	  database : 'linkquidator'
	});



var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var artists = [
	{
		id: 1,
		name: 'valera1'
	},
	{
		id: 2,
		name: 'valera2'
	},
	{
		id: 3,
		name: 'valera3'
	}
];

app.get('/', function(req, res) {
	res.send('Hello dude!');
});

app.get('/artists', function(req, res) {
	res.send(artists);
});

app.post('/artists', function(req, res) {
	artists.push({
		id: Date.now(),
		name: req.body.name
	});

	res.send(req.body);
});

app.get('/artists/:id', function(req, res) {
	// res.send(artists);

	let artist = artists.find(function(artist) {
		return artist.id === Number(req.params.id)
	});

	res.send(artist);
});

app.get('/db', function(req, res) {
	var start = new Date();
	// connection.connect();

	connection.query('SELECT * from users', function(err, rows, fields) {
	  if (!err) {
	    var end = new Date();
    	res.send({data: end.getTime()-start.getTime()});

		}
	  else
	    console.log('Error while performing Query.');
	});

	// connection.end();
	// res.send(200);
});

app.get('/parse', function(req, res) {
	// console.log(process.memoryUsage());
	request('https://yandex.ru/pogoda/kishinev1', function (error, response, body) {
	  // console.log('error:', error); // Print the error if one occurred
	  // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
	  // console.log('body:', body); // Print the HTML for the Google homepage.

	  const $ = cheerio.load(body);
	  // var a = $('a');
	  var $anchor_texts=[];
	  // for (var i = 0, len = a.length; i < len; i++) {
	  //   $anchor_texts.push(a[i].text())
	  // }

	  $('a').each(function(){
	  	// console.log(this);
	  	// console.log($(this).attr('href'));
	  	// res.send($('a',this).attr('class'));
        $anchor_texts.push({
            title:$(this).text(),
            url:$(this).attr('href')
        });
      });

      // console.log(process.memoryUsage());

	  res.send($anchor_texts);
	});
});

var server = app.listen(3040, function () {
	console.log('Api started');
});

server.on('close', function() {
    connection.end();
})