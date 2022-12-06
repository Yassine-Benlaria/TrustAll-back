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
    car_year: String,
    commune_id: {
        type: String,
        required: true
    },
    seller_phone: {
        type: String,
        required: true
    },
    seller_name: {
        type: String
    },
    plan_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        /*
        -car informarion
        -contacting car owner
        -confirming
        -payment
        -In progress
        -Done
        */
        default: "Car Information"
    }
}, { timestamps: true });

module.exports = mongoose.model("Command", commandSchema);