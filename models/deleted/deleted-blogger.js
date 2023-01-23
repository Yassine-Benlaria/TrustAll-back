const mongoose = require("mongoose");

//Status schema
const bloggerStatusSchema = new mongoose.Schema({
    verified: {
        type: Boolean,
        default: false
    },
}, { timestamps: false, _id: false })

//Deleted Agent schema
const DeletedBloggerSchema = new mongoose.Schema({

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
    status: {
        type: bloggerStatusSchema,
        default: {
            verified: false,
        }
    },
    salt: { type: String },
    hashed_password: {
        type: String,
    }
}, { timestamps: true });

module.exports = mongoose.model("DeletedBlogger", DeletedBloggerSchema);