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

app.get('/map', function(request, response) {
    response.render('pages/map');
})

app.get('/cool', function(request, response) {
    response.send(cool());
});

app.get('/login', function(request, response) {
    response.render('pages/login');
})

// tries to register user
// if you fail, kicks you to re-registration page with error alert
app.post('/register', function(req, res) {
    if (!req.body.password) {
        var error = "FOOL: NO PASSWORD"
        res.render('pages/index.ejs', {message: error});
    } else {
        db.collection('users').save(req.body, (err, result) => {
            if (err) return console.log(err);
            console.log('saved to database')
            console.log(req.body);
            res.redirect('/login')
        })
    }
})

// tries to log the user in
app.post('/login', function( req, res ) {
    console.log(req.body.username);
    var user = db.collection('users').find({ username: req.body.username}).toArray(function(err, result) {
        if (err) return;
        if (result.length===0) {
            // USER NOT FOUND
            console.log("USER NOT FOUND")
            var error = "User not found";
            res.render('pages/login', {message: error})
        } else if (result[0].password!=req.body.password) {
            // WRONG PASS
            console.log("WRONG PASSWORD");
            var error = "Wrong Password";
            res.render('pages/login', {message: error})
        } else {
            // SUCCESS
            console.log("SUCCESSFUL LOGIN");
            res.render('pages/volunteer');
        }
    });
//            
//            if (req.body.password === user[0].password) {
//                console.log("SUCCESS");
//            } else {
//                console.log("FAILURE");
//            }
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


