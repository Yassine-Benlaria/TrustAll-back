const mongoose = require("mongoose");

//Notification schema
const notificationSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
}, { timestamps: { createdAt: true, updatedAt: false }, _id: false })


module.exports = mongoose.model("Notification", notificationSchema)