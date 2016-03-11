var express = require('express');
var mysql = require('./dbFitness.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);
app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());

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

app.post('/',function(req,res,next){
	console.log("POST");
	console.log(req.body);
	res.send("Return from POST");
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