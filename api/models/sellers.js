'use strict';
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var SellersSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String
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
					/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(v) :
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
	}
}, {
	timestamps: {
		createdAt: 'dwh_created_date',
		updatedAt: 'dwh_modified_date'
	}
});

module.exports = mongoose.model('Sellers', SellersSchema);
