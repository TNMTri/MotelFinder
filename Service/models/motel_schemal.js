var mongoose = require('mongoose');
var schema = mongoose.Schema;
var object_id = schema.ObjectId;

var motel_schema = new schema({
    _id: object_id,
    title: String,
    detail: String,
    phone1: String,
    phone2: String,
    address: [],
    date: Date,
    area: String,
    prices: String,
    electricity_prices: String,
    water_prices: String,
    status : Boolean
});

var motel = mongoose.model('motel', motel_schema);
module.exports = {motel: motel};