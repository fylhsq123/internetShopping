'use strict';

var mongoose = require('mongoose'),
    config = require('config'),
    Schema = mongoose.Schema;

var ProductsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    subcategory_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Categories',
        refPath: '_id'
    },
    seller_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Customers'
    },
    count_bought: {
        type: Number,
        default: 0
    },
    count_sold: {
        type: Number,
        default: 0
    },
    price_bought: {
        type: Number,
        default: 0
    },
    price_sold: {
        type: Number,
        default: 0
    },
    dwh_deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: {
        createdAt: 'dwh_created_date',
        updatedAt: 'dwh_modified_date'
    },
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});

ProductsSchema.virtual('is_available').get(function () {
    return this.count_bought - this.count_sold > 0 ? true : false;
});
ProductsSchema.virtual('image_url').get(function () {
    return this.image ? 'http://' + config.server.address + ':' + config.server.port + '/sources/' + this.image : "";
});

ProductsSchema.virtual('category', {
    ref: 'Categories',
    localField: 'subcategory_id',
    foreignField: '_id'
});

ProductsSchema.virtual('seller', {
    ref: 'Customers',
    localField: 'seller_id',
    foreignField: '_id'
});

module.exports = mongoose.model('Products', ProductsSchema);