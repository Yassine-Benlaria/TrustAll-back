const mongoose = require("mongoose");
const crypto = require("crypto");
const { v1: uuidv1 } = require("uuid");

//Admin schema
const deletedAdminSchema = new mongoose.Schema({
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
    city: {
        type: String,

    },
    birth_date: {
        type: Date,

    },
    role: {
        type: String,
        require: true,
        default: "sub_admin"
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
    },
    salt: { type: String },
    hashed_password: {
        type: String,

    }
}, { timestamps: true });


//export the model
module.exports = mongoose.model("DeletedAdmin", deletedAdminSchema);