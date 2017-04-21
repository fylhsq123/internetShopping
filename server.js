var
	// load modules
	express = require('express'),
	bodyParser = require('body-parser'),
	morgan = require('morgan'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	jwt = require('jwt-simple'),
	cors = require('cors'),
	// get config file
	config = require('./api/config/conf'),
	// parameters and initialization
	port = process.env.PORT || 3000,
	app = express(),
	// get models
	customersModel = require('./api/models/customers'),
	countriesCitiesModel = require('./api/models/countriesCities'),
	// get routes
	customersRoutes = require('./api/routes/customers'),
	countriesCitiesRoutes = require('./api/routes/countriesCities');

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

// Use CORS
app.use(cors());

// connect to database
mongoose.connect(config.database);

// pass passport for configuration
require('./api/config/passport')(passport, customersModel);

// Customer Routes
customersRoutes(app, passport);

// Countries and Cities Routes
countriesCitiesRoutes(app, passport);

// Error handlers
function logErrors(err, req, res, next) {
	console.error(err.error.message);
	next(err);
}

function clientErrorHandler(err, req, res, next) {
	console.log(err);
	res.status(500)
		.send({
			"success": false,
			"response": {
				"msg": err.msg
			}
		});

}
app.use(logErrors);
app.use(clientErrorHandler);

// handle requests with wrong address
app.use(function (req, res) {
	res.status(404)
		.send({
			url: "'" + req.originalUrl + "' not found"
		});
});

// start server
app.listen(port, function () {
	console.log('RESTful API server started on: ' + port);
});
