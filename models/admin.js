const mongoose = require("mongoose");
const crypto = require("crypto");
const { v1: uuidv1 } = require("uuid");


//Admin schema
const adminSchema = new mongoose.Schema({
    first_name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
    },
    last_name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        trim: true,
        required: true,
    },
    city: {
        type: String,
        required: true
    },
    birth_date: {
        type: Date,
        required: true
    },
    img: {
        type: String,
        default: ""
    },
    //token for password resetting
    resetToken: String,
    resetTokenExpiration: Date,
    //identity_document: {},
    // img: {
    //     data: Buffer,
    //     contentType: String
    // },
    // confirmation_code: {
    //     type: String,
    // },
    // verified: {
    //     type: Boolean,
    //     default: false
    // },
    role: {
        type: String,
        require: true,
        default: "sub_admin"
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
    },
    //for changing the email
    newEmail: String,
    newEmailConfirmation: String,
    newEmailConfirmationExpiration: Date,
    //hashed password
    salt: { type: String },
    hashed_password: {
        type: String,
        required: true
    }
}, { timestamps: true });

// virtual field
adminSchema
    .virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = uuidv1();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

// schema methods
adminSchema.methods = {
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    encryptPassword: function(password) {
        if (!password) return '';
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
        } catch (err) {
            return '';
        }
    }
};

//export the model
module.exports = mongoose.model("Admin", adminSchema);