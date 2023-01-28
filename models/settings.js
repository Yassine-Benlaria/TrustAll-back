const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({

    social_media: {
        facebook: String,
        instagram: String,
        twitter: String,
        email: String,
        whatsapp: String
    },
    terms: { ar: String, fr: String, en: String },
    about_us: { ar: String, fr: String, en: String },
    location: { ar: String, fr: String, en: String },
    phone: String,
    FAQs: {
        ar: [{ question: String, answer: String }],
        fr: [{ question: String, answer: String }],
        en: [{ question: String, answer: String }]
    }
}, { timestamps: true, unique: true });

module.exports = mongoose.model("Settings", settingsSchema);