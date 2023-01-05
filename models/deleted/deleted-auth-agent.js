const mongoose = require("mongoose");
const crypto = require("crypto");
const { v1: uuidv1 } = require("uuid");



//Status schema
const authAgentStatusSchema = new mongoose.Schema({
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
    }
}, {
    _id: false
})

//AuthAgent schema
const DeletedAuthAgentSchema = new mongoose.Schema({
    created_by: {
        type: String,

    },
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
    birth_date: {
        type: Date,

    },
    email: {
        type: String,
        trim: true,

        unique: true,
    },
    phone: {
        type: String,
        trim: true,

    },
    city: {
        type: String,

    },
    communes: {
        type: Array,
    },
    img: {
        type: Boolean,
        default: false
    },
    status: {
        type: authAgentStatusSchema,
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

module.exports = mongoose.model("DeletedAuthAgent", DeletedAuthAgentSchema);