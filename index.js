var cool = require('cool-ascii-faces');
var express = require('express');
var bodyParser = require('body-parser')

var app = express();
app.use(bodyParser.urlencoded({extended: true}));

// add mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://heroku_qgxgxvd5:rd36qa6741uts9agflu7vqgpsr@ds161551.mlab.com:61551/heroku_qgxgxvd5');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open',function() {
	var Schema = mongoose.Schema;
	var userSchema = new Schema( {
		username: String,
		password: String,
		skills: [String]
	})

	userSchema.statics.findByName = function(name, cb) {
		return this.find({name: new RegExp(name, 'i')}, cb);
	};
    
    
	var User = mongoose.model('User', userSchema);
    
    var user1 = new User({ username: 'bob'});
    
    User.findByName('bob', function(err, users) {
        console.log(users);
    })
})

//set up schemas



app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
    var cursor = db.collection('quotes').find();
    db.collection('quotes').find().toArray(function(err, results) {
        console.log(results)
    })
    response.render('pages/index');
});

app.get('/cool', function(request, response) {
    response.send(cool());
});

app.post('/register', function(req, res) {
    console.log("SUG");
    console.log(req.body);
    res.send(cool());
})

app.post('/quotes', (req, res) => {
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  })
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


