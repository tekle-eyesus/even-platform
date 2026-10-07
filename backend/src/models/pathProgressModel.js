const mongoose = require("mongoose");

const pathProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    path: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LearningPath",
      required: true,
    },
    completedSteps: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    ],
    currentStep: { type: Number, default: 0 },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

pathProgressSchema.index({ user: 1, path: 1 }, { unique: true });

module.exports = mongoose.model("PathProgress", pathProgressSchema);
