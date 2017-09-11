/*
Name: Brian Allison
Date: 6/10/2017
Course: CS290
Description: DB interactions and UI
*/

var express = require('express');
var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 5600);
app.use(express.static('public'));

app.get('/',function(req,res,next){
	res.render('home');
});

app.get('/gentable',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.tab = JSON.stringify(rows);
	res.send(context);
  });
});


app.get('/add',function(req,res,next){
  var context = {};
  mysql.pool.query("INSERT INTO workouts (`name`, `reps`, `weight`, `date`, `lbs`) VALUES (?, ?, ?, ?, ?)", [req.query.n, req.query.r, req.query.w, req.query.d, req.query.l], 
	function(err, result){
	  if(err){
      next(err);
      return;
    }
	//empty response sent because /gentable is used to regenerate values
    //does not work without empty response, probably because it
	//tells the browser whether the request was successful
	res.send();
  });
});

app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err){ //replace your connection pool with the your variable containing the connection pool
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

app.get('/edit',function(req,res,next){
  var context = {};
  mysql.pool.query("UPDATE workouts SET name=? WHERE id=? ", [req.query.n, req.query.r, req.query.w, req.query.d, req.query.l, req.query.id],
    function(err, result){
    if(err){
      console.log(err);
      return;
    }
    res.render('home');
  });
});


app.get('/remove',function(req,res,next){
  var context = {};
  mysql.pool.query("DELETE FROM `workouts` WHERE id=?", [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    res.send();
  });
});


app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});

