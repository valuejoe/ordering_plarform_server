const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
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
