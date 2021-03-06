'use strict';
var
	// load modules
	express = require('express'),
	bodyParser = require('body-parser'),
	morgan = require('morgan'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	cors = require('cors'),
	cookieParser = require('cookie-parser'),
	// load global event emitter
	events = require('./common/global-event-emitter'),
	// get config file
	config = require('config'),
	// initialization
	app = express(),
	// get models
	customersModel = require('./api/models/customers'),
	countriesCitiesModel = require('./api/models/countriesCities'),
	categoriesModel = require('./api/models/categories'),
	rolesModel = require('./api/models/roles'),
	productsModel = require('./api/models/products'),
	ordersModel = require('./api/models/orders'),
	// get routes
	customersRoutes = require('./api/routes/customers'),
	countriesCitiesRoutes = require('./api/routes/countriesCities'),
	categoriesRoutes = require('./api/routes/categories'),
	productsRoutes = require('./api/routes/products'),
	commonRoutes = require('./api/routes/common'),
	ordersRoutes = require('./api/routes/orders'),

	http = require('http').Server(app),
	io = require('socket.io')(http);

mongoose.Promise = require('bluebird');

// Use CORS
app.use(cors());

// get request parameters
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

// set cookie parser
app.use(cookieParser());

if (config.util.getEnv('NODE_ENV') !== 'test') {
	// log to console
	app.use(morgan('combined'));
}

// Use the passport package in our application
app.use(passport.initialize());

// connect to database
mongoose.connect(config.database);

// pass passport for configuration
require('./config/passport')(passport, customersModel);

// Customer Routes
customersRoutes(app, passport);

// Countries and Cities Routes
countriesCitiesRoutes(app);

// Categories Routes
categoriesRoutes(app);

// Products Routes
productsRoutes(app, passport);

// Common Routes
commonRoutes(app);

// Orders Routes
ordersRoutes(app, passport);

// Event listener on creating new product
io.on('connection', function (socket) {
	socket.join('new_products');
});
events.on(config.eventNameForNewProduct, function (data) {
	if (data.socket_id) {
		io.sockets.connected[data.socket_id].broadcast.to('new_products').emit(config.eventNameForNewProduct, data);
	} else {
		io.to('new_products').emit(config.eventNameForNewProduct, data);
	}
});
// app.route('/').get(function (req, res) {
// 	res.sendFile(__dirname + '/index.html');
// });

// Error handlers
function logErrors(err, req, res, next) {
	console.error('\x1b[31m\x1b[1m%s\x1b[0m', "[ERROR]: ", err.err ? err.err.message ? err.err.message : err.err : err);
	next(err);
}

function clientErrorHandler(err, req, res, next) {
	res.status(500)
		.send({
			"success": false,
			"response": {
				"msg": err.msg || err.message
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
http.listen(config.server.port, config.server.address, function () {
	console.log('RESTful API server started on: ' + (config.server.host()));
});

// for Mocha tests
module.exports = app;