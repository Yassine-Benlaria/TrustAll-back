const mongoose = require("mongoose");

//Client schema
const commandSchema = new mongoose.Schema({
    client_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    car_name: {
        type: String,
        required: true
    },
    car_year: Date,
    commune_id: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "Vehicle Information"
    }
}, { timestamps: true });

module.exports = mongoose.model("Command", commandSchema);