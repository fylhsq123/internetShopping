'use strict';

var mongoose = require('mongoose'),
	bcrypt = require('bcrypt'),
	Schema = mongoose.Schema;

var CustomerSchema = new Schema({
	_id: {
		type: Schema.Types.ObjectId,
		auto: true
	},
	first_name: {
		type: String,
		required: [true, "Please path you name"]
	},
	last_name: {
		type: String,
		required: [true, "Please path you last name"]
	},
	personal_key: {
		type: Number,
		required: [true, "Please path you personal number"],
		default: new Date()
			.getTime()
	},
	phone_number: {
		type: String,
		validate: {
			validator: function (v) {
				return /\d+/.test(v);
			},
			message: '{VALUE} is not a valid phone number!'
		},
		required: [true, 'Phone number is required']
	},
	email: {
		type: String,
		validate: {
			validator: function (v) {
				return v.length ?
					/\S+@\S+/.test(v) :
					true;
			},
			message: "Invalid email"
		}
	},
	address: {
		type: String,
		required: [true, "Address is required"]
	},
	city: {
		type: String,
		required: [true, "City is required"]
	},
	country: {
		type: Schema.Types.ObjectId,
		required: [
			true, "Country code is required"
		],
		ref: 'CountriesCities',
		default: "58f0d7c6716e0f67441b0b05"
	},
	zip_code: {
		type: String,
		required: [true, "Zip-code is required"]
	},
	date_of_birth: {
		type: Date
	},
	password: {
		type: String,
		required: true
	},
	dwh_online: {
		type: Boolean,
		default: false
	},
	dwh_deleted: {
		type: Boolean,
		default: false
	},
	role_id: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'Roles',
		default: "58fdf368746c70e8a1759a55"
	}
}, {
	timestamps: {
		createdAt: 'dwh_created_date',
		updatedAt: 'dwh_modified_date'
	}
});

CustomerSchema.pre('save', function (next) {
	var user = this;
	if (this.isModified('password') || this.isNew) {
		bcrypt.genSalt(10, function (err, salt) {
			if (err) {
				return next(err);
			}
			bcrypt.hash(user.password, salt, function (err, hash) {
				if (err) {
					return next(err);
				}
				if (user.isNew) {
					var d = new Date();
					user.personal_key = d.getTime();
					user._id = mongoose.Types.ObjectId();
				}
				user.password = hash;
				next();
			});
		});
	} else {
		return next();
	}
});

CustomerSchema.methods.comparePassword = function (passw, cb) {
	bcrypt.compare(passw, this.password, function (err, isMatch) {
		if (err) {
			return cb(err);
		}
		cb(null, isMatch);
	});
};

module.exports = mongoose.model('Customers', CustomerSchema);
