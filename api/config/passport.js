var JwtStrategy = require('passport-jwt').Strategy,
	ExtractJwt = require('passport-jwt').ExtractJwt,
	config = require('../config/conf'); // get db config file

module.exports = function (passport, Customers) {
	var opts = {};
	opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
	opts.secretOrKey = config.jwtSecret;
	passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
		Customers.findOne({
			email: jwt_payload.email
		}, function (err, customer) {
			if (err) {
				return done(err, false);
			}
			if (customer) {
				done(null, customer);
			} else {
				done(null, false);
			}
		});
	}));
};
