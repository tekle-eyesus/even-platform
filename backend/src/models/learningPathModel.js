const mongoose = require("mongoose");

const learningPathStepSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
    rationale: {
      type: String,
      default: "Read this step to build on the ideas before it.",
    },
    reflectionPrompt: {
      type: String,
      default: "What is one idea from this story you could apply?",
    },
  },
  { _id: false },
);

const learningPathSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    goal: { type: String, required: true, trim: true },
    techHub: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TechHub",
      required: true,
    },
    steps: {
      type: [learningPathStepSchema],
      validate: (steps) => steps.length > 0,
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    estimatedMinutes: { type: Number, default: 1 },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

learningPathSchema.index({ status: 1, techHub: 1 });

module.exports = mongoose.model("LearningPath", learningPathSchema);
