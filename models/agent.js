const mongoose = require("mongoose");
const crypto = require("crypto");
const { v1: uuidv1 } = require("uuid");


//Client status schema
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
    }
})

//Agent schema
const agentSchema = new mongoose.Schema({
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
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    identity_document: {
        type: String,
        default: "None"
    },
    img: {
        type: Boolean,
        default: false
    },
    // confirmation_code: {
    //     type: String,
    // },
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
        required: true
    }
}, { timestamps: true });


// virtual field
agentSchema
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
agentSchema.methods = {
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
module.exports = mongoose.model("Agent", agentSchema);