const mongoose = require("mongoose")

const reportSchema = new mongoose.Schema({
    car_information: {
        car_brand: {
            type: String,
        },
        car_model: {
            type: String,
        },
        manufacture_year: {
            type: String,
        },
        kilometer_number: {
            type: String,
        },
        car_brand: {
            type: String,
        },
        vin: {
            type: String,
        },
        car_plate: {
            type: String,
        },
        gazoline_type: {
            type: String,
        },
        car_color: {
            type: String,
        },

    },
    interior: {
        internal_order: { status: { type: Boolean }, description: { type: String } },
        seats: { status: { type: Boolean }, description: { type: String } },
        airBags: { status: { type: Boolean }, description: { type: String } },
        floorMats: { status: { type: Boolean }, description: { type: String } },
        windows: { status: { type: Boolean }, description: { type: String } },
        AC: { status: { type: Boolean }, description: { type: String } },
        Radio: { status: { type: Boolean }, description: { type: String } },
        Screen: { status: { type: Boolean }, description: { type: String } }
    },
    exterior: {
        external_structure: { status: { type: Boolean }, description: { type: String } },
        exterior_lights: { status: { type: Boolean }, description: { type: String } },
        Tires: { status: { type: Boolean }, description: { type: String } },
        Wiper_Blades: { status: { type: Boolean }, description: { type: String } },
        Dents: { status: { type: Boolean }, description: { type: String } },
    },
    mechanical: {
        engine_transmission: { status: { type: Boolean }, description: { type: String } },
        differential: { status: { type: Boolean }, description: { type: String } },
        engine_cooling_system: { status: { type: Boolean }, description: { type: String } },
        fluid_leaks: { status: { type: Boolean }, description: { type: String } },
        Brake_Arms_Shock_absorbs: { status: { type: Boolean }, description: { type: String } },
        AC_system: { status: { type: Boolean }, description: { type: String } },
        electricity_system: { status: { type: Boolean }, description: { type: String } },
        computer_system_scanned: { status: { type: Boolean }, description: { type: String } },
    },

}, { timestamps: true })


module.exports = mongoose.model("Report", reportSchema)