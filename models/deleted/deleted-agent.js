const mongoose = require("mongoose");


//Status schema
const agentStatusSchema = new mongoose.Schema({
    verified: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: true
    },
    online: {
        type: Boolean,
    },
}, { _id: false })

//Deleted Agent schema
const DeletedAgentSchema = new mongoose.Schema({

    first_name: {
        type: String,
        trim: true,

        maxlength: 32,
    },
    last_name: {
        type: String,
        trim: true,

        maxlength: 32,
    },
    email: {
        type: String,
        trim: true,


    },
    phone: {
        type: String,
        trim: true,

    },
    birth_date: {
        type: Date,

    },
    auth_agent_ID: {
        type: mongoose.Schema.Types.ObjectId,
    },
    identity_document: {
        type: String,
        default: "None"
    },
    img: {
        type: Boolean,
        default: false
    },

    status: {
        type: agentStatusSchema,
        default: {
            verified: false,
            active: true,
        }
    },
    salt: { type: String },
    hashed_password: {
        type: String,
    }
}, { timestamps: true });

module.exports = mongoose.model("DeletedAgent", DeletedAgentSchema);