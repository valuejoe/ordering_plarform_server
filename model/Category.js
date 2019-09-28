const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    id: {
        type: Number,
        require: true,
        max: 256
    },
    name: {
        type: String,
        require: true,
        max: 256
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Category", categorySchema);
