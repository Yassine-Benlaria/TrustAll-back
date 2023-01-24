const mongoose = require("mongoose");
const crypto = require("crypto");
const { v1: uuidv1 } = require("uuid");

//Status schema
const bloggerStatusSchema = new mongoose.Schema({
    verified: {
        type: Boolean,
        default: false
    },
    online: {
        type: Boolean,
    },
}, { timestamps: false, _id: false })

const bloggerSchema = new mongoose.Schema({
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
    birth_date: {
        type: Date,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    img: {
        type: String,
        default: ""
    },
    //token for password resetting
    resetToken: String,
    resetTokenExpiration: Date,
    confirmation_code: {
        type: String,
    },
    status: {
        type: bloggerStatusSchema,
        default: {
            verified: false,
        }
    },
    id_uploaded: { type: Boolean, default: false },
    identity_document: {
        type: { type: String },
        front_url: { type: String },
        back_url: { type: String },
        selfie_url: { type: String },
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
bloggerSchema
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
bloggerSchema.methods = {
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


module.exports = mongoose.model("Blogger", bloggerSchema);