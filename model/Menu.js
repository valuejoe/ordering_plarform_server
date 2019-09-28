const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        max: 256
    },
    cost: {
        type: Number,
        require: true,
        max: 256
    },
    category: {
        type: String,
        require: true,
        max: 256
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Menu", menuSchema);
