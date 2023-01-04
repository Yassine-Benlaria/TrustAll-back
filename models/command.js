const mongoose = require("mongoose");

//Client schema
const commandSchema = new mongoose.Schema({
    client_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    //seller information
    seller_name: {
        type: String
    },
    seller_phone: {
        type: String,
        required: true
    },
    commune_id: {
        type: String,
        required: true
    },
    //car information
    car_name: {
        type: String,
        required: true
    },
    car_year: String,
    //auth_agents
    auth_agent_seller: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    auth_agent_client: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    //agents
    agent_seller: {
        type: mongoose.Schema.Types.ObjectId,
    },
    agent_client: {
        type: mongoose.Schema.Types.ObjectId,
    },
    //plan
    plan_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        /*
        -Processing
        -Contacting car owner
        -Payment in process
        -Command in progress
        -Done
        */
        default: "Car Information"
    }
}, { timestamps: true });

module.exports = mongoose.model("Command", commandSchema);