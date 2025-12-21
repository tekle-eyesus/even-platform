const mongoose = require("mongoose");

const commentClapSchema = new mongoose.Schema(
    {
        comment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { timestamps: true }
);

// Prevent duplicate claps from the same user on the same comment
commentClapSchema.index({ comment: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("CommentClap", commentClapSchema); s