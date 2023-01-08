const mongoose = require("mongoose");

//Client status schema
const clientStatusSchema = new mongoose.Schema({
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
}, { _id: false })

//Client schema
const deletedClientSchema = new mongoose.Schema({
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
    commune_id: {
        type: String,
        required: true
    },
    img: {
        type: Boolean,
        default: false
    },
    confirmation_code: {
        type: String,

    },
    status: {
        type: clientStatusSchema,

        default: {
            verified: false,
            active: true,
        }
    },
    salt: { type: String },
    hashed_password: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("DeletedClient", deletedClientSchema);