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
})

//AuthAgent schema
const authAgentSchema = new mongoose.Schema({
    created_by: {
        type: String,
        required: true
    },
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
    birth_date: {
        type: Date,
        required: true
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
    //identity_document: {},
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
    //token for password resetting
    resetToken: String,
    resetTokenExpiration: Date,
    // confirmation_code: {
    //     type: String,
    // },
    // verified: {
    //     type: Boolean,
    //     default: false
    // },
    salt: { type: String },
    hashed_password: {
        type: String,
        required: true
    }
}, { timestamps: true });


// virtual field
authAgentSchema
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
authAgentSchema.methods = {
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
module.exports = mongoose.model("AuthAgent", authAgentSchema);