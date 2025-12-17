const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
    {
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        type: {
            type: String,
            enum: ["like", "dislike"],
            required: true
        }
    },
    { timestamps: true }
);

// Ensure a user has only ONE interaction doc per post
likeSchema.index({ post: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Like", likeSchema);