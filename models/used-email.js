const mongoose = require("mongoose");

const usedEmailSchema = new mongoose.Schema({
    email: { type: String, required: true }
}, {
    timestamps: false
});

module.exports = mongoose.model("UsedEmail", usedEmailSchema);