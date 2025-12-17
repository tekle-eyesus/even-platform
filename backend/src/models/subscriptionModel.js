const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
    {
        subscriber: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        channel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        techHub: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TechHub"
        }
    },
    { timestamps: true }
);

// --- SOLID DATA INTEGRITY ---
// Ensure a user cannot subscribe to the same Author twice
subscriptionSchema.index({ subscriber: 1, channel: 1 }, { unique: true, partialFilterExpression: { channel: { $exists: true } } });

// Ensure a user cannot subscribe to the same Tech Hub twice
subscriptionSchema.index({ subscriber: 1, techHub: 1 }, { unique: true, partialFilterExpression: { techHub: { $exists: true } } });

module.exports = mongoose.model("Subscription", subscriptionSchema);