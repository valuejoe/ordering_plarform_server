const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    order: [{ title: String, count: Number, cost: Number }],
    costSum: Number,
    countSum: Number,
    expired: {
        type: Date,
        default: Date.now,
        index: { unique: true, expires: "1day" }
    }
});

const completedOrderSchema = new mongoose.Schema({
    order: [{ title: String, count: Number, cost: Number }],
    costSum: Number,
    countSum: Number,
    completedAt: {
        type: Date,
        default: Date.now
    },
    orderAt: Date
});

module.exports.Order = mongoose.model("Order", orderSchema);
module.exports.CompletedOrder = mongoose.model(
    "CompletedOrder",
    completedOrderSchema
);
