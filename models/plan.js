const mongoose = require("mongoose")

const planSchema = new mongoose.Schema({
    car_information: {
        type: Array
    },
    interior: {
        type: Array
    },
    exterior: {
        type: Array
    },
    mechanical: {
        type: Array
    },
    price: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Plan", planSchema)