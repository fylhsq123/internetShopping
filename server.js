var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	morgan = require('morgan'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	jwt = require('jwt-simple'),
	cors = require('cors'),
	config = require('./api/config/conf'), // get config file
	port = process.env.PORT || 3000,
	Customers = require('./api/models/customers'),
	CountriesCities = require('./api/models/countriesCities');

mongoose.Promise = global.Promise;

// get request parameters
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

// log to console
app.use(morgan('combined'));

// Use the passport package in our application
app.use(passport.initialize());

app.use(cors());

// connect to database
mongoose.connect(config.database);

// pass passport for configuration
require('./api/config/passport')(passport, Customers);

// global controller
// app.post('/*', function(req, res, next) {
//     console.log("test");
//     res.header('Access-Control-Allow-Origin', '*');
//     next();
// });

// Customer Routes
var customersRoutes = require('./api/routes/customers');
customersRoutes(app, passport);

// Countries and Cities Routes
var countriesCitiesRoutes = require('./api/routes/countriesCities');
countriesCitiesRoutes(app, passport);

app.use(function (req, res) {
	res.status(404).send({
		url: "'" + req.originalUrl + "' not found"
	});
});

app.listen(port, function () {
	console.log('RESTful API server started on: ' + port);
});
