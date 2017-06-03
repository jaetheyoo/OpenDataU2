var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();

// add mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://heroku_qgxgxvd5:rd36qa6741uts9agflu7vqgpsr@ds161551.mlab.com:61551/heroku_qgxgxvd5');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var kitties = db.once('open',function() {
	var userSchema = mongoose.Schema( {
		name: String
	});

	userSchema.methods.speak = function () {
		var greeting = this.name 
			? "Meow name is " + this.name
			: "I am nameless";
		console.log(greeting);
	}

	var User = mongoose.model('User', userSchema);

	var silence = new User({ name: 'Silence' });
	console.log(silence.name);
	// we're connected! 

	var fluffy = new User({ name: 'floof'});
	fluffy.speak();

	var buffy = new User({name: 'notmyname'});
	buffy.save(function(err,buffy) {
		if (err) return console.error(err);
		buffy.speak();
	})

	fluffy.save(function (err, fluffy) {
		if (err) return console.error(err);
		fluffy.speak();
	})

	User.find(function (err, users) {
		if (err) return console.error(err);
		console.log(users);
	})
	User.find({name: 'notmyname'}, kitties);
})

console.log(kitties);

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/cool', function(request, response) {
  response.send(cool());
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


