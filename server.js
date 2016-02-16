var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var mongoose   = require('mongoose');

// Auth handler
var jwt    = require('jsonwebtoken');
var config = require('./config');

// Routes inclusion
var users   = require('./routes/users');
var home   	= require('./routes/home');
var api   	= require('./routes/api');



// Configuration
mongoose.connect(config.database);
app.set('superSecret', config.secret);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));

// Set routes
app.use('/', home);
app.use('/users', users);
app.use('/api', api);


module.exports = app;
