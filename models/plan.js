const mongoose = require("mongoose")

const planSchema = new mongoose.Schema({
    title: { type: String, required: true },
    car_information: { type: Array },
    interior: { type: Array },
    exterior: { type: Array },
    mechanical: { type: Array },
    price: { type: Number, required: true },
    price_baridi_mob: { type: Number, required: true },
    description: {
        ar: { type: String, required: true },
        fr: { type: String, required: true },
        en: { type: String, required: true }
    },
    video: Boolean
}, {
    timestamps: true
})

module.exports = mongoose.model("Plan", planSchema)