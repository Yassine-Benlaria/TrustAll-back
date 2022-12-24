const mongoose = require("mongoose")

const planSchema = new mongoose.Schema({
    title: { type: String, required: true },
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
    },
    price_baridi_mob: { type: String, required: true },
    decription: { type: String, required: true },
}, {
    timestamps: true
})

module.exports = mongoose.model("Plan", planSchema)