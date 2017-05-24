'use strict';
var JwtStrategy = require('passport-jwt')
	.Strategy,
	ExtractJwt = require('passport-jwt')
	.ExtractJwt,
	config = require('config'); // get db config file

module.exports = function (passport, Customers) {
	var opts = {};
	opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
	opts.secretOrKey = config.jwtSecret;
	passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
		var currDate = new Date(),
			validTo = new Date(jwt_payload.validTo);
		if (currDate <= validTo) {
			Customers.findOne({
				email: jwt_payload.email
			}).populate({
				path: 'role_id',
				select: '-_id type'
			}).exec(function (err, customer) {
				if (err) {
					return done(err, false);
				}
				if (customer) {
					done(null, customer);
				} else {
					done(null, false);
				}
			});
		} else {
			done(null, false);
		}
	}));
};