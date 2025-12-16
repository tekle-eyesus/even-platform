const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true
        },
        content: {
            type: String,
            required: true
        },
        summary: {
            type: String,
            // This will be populated by AI later, but can be manually edited
            default: ""
        },
        coverImage: {
            type: String,
            default: ""
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        techHub: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TechHub",
            required: true
        },
        tags: {
            type: [String],
            default: []
        },
        status: {
            type: String,
            enum: ["draft", "published"],
            default: "published"
        },
        readTime: {
            type: Number,
            default: 1
        }
    },
    { timestamps: true }
);

// Optimize queries
postSchema.index({ author: 1 });
postSchema.index({ techHub: 1 });

module.exports = mongoose.model("Post", postSchema);