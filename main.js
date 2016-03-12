var express = require('express');
var mysql = require('./dbFitness.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/',function(req,res,next){
	var context = {};
	mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields) {
		if(err) {
			next(err);
			return;
		}
		context.rows = rows;
		context.results = JSON.stringify(rows);
		res.render('home', context);
	});
});

app.get('/update',function(req,res,next){
	var context = {};
	mysql.pool.query('SELECT * FROM workouts WHERE id=?', req.query['id'],function(err, rows, fields) {
		if(err) {
			next(err);
			return;
		}
		context = rows[0];
		context.dateYear = context.date.getFullYear();
		context.dateMonth = context.date.getMonth() + 1;
		if (context.dateMonth < 10) {
			context.dateMonth = "0" + context.dateMonth;
		}
		context.dateDate = context.date.getDate();
		context.dateFormat = context.dateYear + "-" + context.dateMonth + "-" + context.dateDate;
		console.log(context);
		res.render('update',context);
	});
});

app.post('/',function(req,res,next){
	if(req.body['type']=='Delete') {
		console.log("Delete Type Recieved");
		mysql.pool.query('DELETE FROM workouts WHERE id=?',req.body['id'], function(err, results) {
			if (err) {
				res.type("text/plain");
				res.send(JSON.stringify({SQL_ERROR:'The SQL DELETE query failed'}));
			}
			res.type("text/plain");
			res.send(results);
		});
	}
	else if(req.body['type']=='Insert') {
		console.log("Insert Type Recieved");
		mysql.pool.query('INSERT INTO workouts (`name`,`reps`,`weight`,`date`,`lbs`) VALUES (?,?,?,?,?)',
			[req.body['name'], req.body['reps'], req.body['weight'], req.body['date'], req.body['weightUnit']],
			function(err, results) {
			if (err) {
				res.type("text/plain");
				res.send(JSON.stringify({SQL_ERROR:'The SQL INSERT query failed'}));
			}
			res.type("text/plain");
			res.send(results);
		});
	}
	else {
		console.log('Invalid POST Recieved - Unknown "Type"');
		res.send(null);
	}
});

/* Test function to load table with data */
app.get('/load-table',function(req,res,next){
	var context = {};
	mysql.pool.query("INSERT INTO workouts (`name`) VALUES (?)",'Test',function(err){
		context.results = "Table loaded";
		res.render('home',context);
	})
});

/* Provided Reset Table Routine */
app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err){ 
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    mysql.pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('home',context);
    })
  });
});

app.use(function(req,res){
  res.status(404);
  res.render('404_-_Not_Found');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500_-_Internal_Server_Error');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});