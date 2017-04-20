var express = require('express');
var bodyParser = require('body-parser');
var mysql      = require('mysql');
var request = require('request');
var Entities = require('html-entities').AllHtmlEntities;
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
	  user     : 'homestead',
	  password : 'secret',
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

	connection.query('SELECT * from users order by id desc', function(err, rows, fields) {
	  if (!err) {
	    var end = new Date();
    	let data=[];
	    for (var i = rows.length - 1; i >= 0; i--) {
	    	if (rows[i].email == 'emptimd@gmail.com') {
    			data = {position: i+1};
    			break;
	    	}
	    }

    	res.end("Hello");
	    // res.send({count: rows.length});
    	// res.send({data: end.getTime()-start.getTime()});

		}
	  else
	    console.log('Error while performing Query.');
	});

	// connection.end();
	// res.send(200);
});

app.get('/parse', function(req, res) {
	// console.log(process.memoryUsage());
	request.get('https://yandex.ru/pogoda/kishinev', function (error, response, body) {
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

var server = app.listen(3001, function () {
	console.log('Api started');
});

server.on('close', function() {
    connection.end();
})