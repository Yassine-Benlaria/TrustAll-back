const mongoose = require("mongoose");

const payedSchema = new mongoose.Schema({
    client: { type: Boolean },
    agent: { type: Boolean },
    auth_agent: { type: Boolean },
    type: String
}, { timestamps: false, _id: false });

//Command schema
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
        -01 => Processing
        -02 => Contacting car owner
        -03 => Assignement to client-side Agent
        -04 => Payment in process
        -05 => Assignement to seller-side Agent
        -06 => Command in progress (verification in process)
        -07 => Done
        */
        default: "01"
    },
    payed: {
        type: payedSchema,
        default: {
            client: false,
            agent: false,
            auth_agent: false
        }
    }
}, { timestamps: true });

module.exports = mongoose.model("Command", commandSchema);