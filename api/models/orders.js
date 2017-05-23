'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,

    OrdersSchema = new Schema({
        customer_id: {
            type: Schema.Types.ObjectId,
            required: true
        },
        items: [{
            _id: {
                type: Schema.Types.ObjectId,
                required: true
            },
            count: {
                type: Number,
                required: true,
                default: 1
            },
            price: {
                type: Number,
                require: true
            }
        }]
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

OrdersSchema.virtual('total_count').get(function () {
    var items = this.items,
        total_count = 0;
    for (var i = 0; i < items.length; i++) {
        total_count += items[i].count;
    }
    return total_count;
});
OrdersSchema.virtual('total_price').get(function () {
    var items = this.items,
        total_price = 0;
    for (var i = 0; i < items.length; i++) {
        total_price += items[i].price;
    }
    return total_price;
});
OrdersSchema.virtual('items.info', {
    ref: 'Products',
    localField: 'items._id',
    foreignField: '_id'
});

module.exports = mongoose.model('Orders', OrdersSchema);