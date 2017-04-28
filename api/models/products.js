'use strict';

var mongoose = require('mongoose'),
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
        rel: 'Categories'
    },
    seller_id: {
        type: Schema.Types.ObjectId,
        required: true,
        rel: 'Customers'
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
    }
});

ProductsSchema.virtual('is_available').get(function () {
    return this.count_bought - this.count_sold > 0 ? true : false;
});

module.exports = mongoose.model('Products', ProductsSchema);