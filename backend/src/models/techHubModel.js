const mongoose = require("mongoose");

const techHubSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true
        },
        description: {
            type: String,
            required: true,
        },
        subscriberCount: {
            type: Number,
            default: 0
        },
        image: {
            type: String,
            default: ""
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("TechHub", techHubSchema);