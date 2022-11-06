const mongoose = require("mongoose");
const crypto = require("crypto");
const { v1: uuidv1 } = require("uuid");
const { truncate } = require("fs");

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
})


//Client schema
const clientSchema = new mongoose.Schema({
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
    daira: {
        type: String,
        required: true
    },
    commune: {
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
        required: true,
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
clientSchema
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
clientSchema.methods = {
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
module.exports = mongoose.model("Client", clientSchema);