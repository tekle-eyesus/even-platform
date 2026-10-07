const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const LearningPath = require("../models/learningPathModel");
const PathProgress = require("../models/pathProgressModel");
const Post = require("../models/postModel");
const TechHub = require("../models/techHubModel");

const populatePath = (query) =>
  query
    .populate("techHub", "name slug description")
    .populate(
      "steps.post",
      "title slug summary coverImage readTime author techHub tags",
    );

const listLearningPaths = asyncHandler(async (req, res) => {
  const { hub, difficulty } = req.query;
  const filter = { status: "published" };

  if (hub) filter.techHub = hub;
  if (difficulty) filter.difficulty = difficulty;

  const paths = await populatePath(
    LearningPath.find(filter).sort({ createdAt: -1 }),
  );

  return res
    .status(200)
    .json(new ApiResponse(200, paths, "Learning paths fetched successfully"));
});

const getLearningPath = asyncHandler(async (req, res) => {
  const path = await populatePath(
    LearningPath.findOne({ _id: req.params.pathId, status: "published" }),
  );

  if (!path) throw new ApiError(404, "Learning path not found");

  return res
    .status(200)
    .json(new ApiResponse(200, path, "Learning path fetched successfully"));
});

const createLearningPath = asyncHandler(async (req, res) => {
  const { techHubId, goal, difficulty = "beginner" } = req.body;

  if (!techHubId || !goal?.trim()) {
    throw new ApiError(400, "Tech Hub and learning goal are required");
  }

  const hub = await TechHub.findById(techHubId);
  if (!hub) throw new ApiError(404, "Tech Hub not found");

  const posts = await Post.find({ techHub: techHubId, status: "published" })
    .sort({ views: -1, createdAt: -1 })
    .limit(5)
    .select("_id readTime title");

  if (posts.length === 0) {
    throw new ApiError(
      400,
      "This Tech Hub does not have published stories yet",
    );
  }

  const steps = posts.map((post, index) => ({
    post: post._id,
    order: index + 1,
    rationale:
      index === 0
        ? "Start here to establish the foundation for your goal."
        : "Continue here to build on the ideas from the previous step.",
    reflectionPrompt: `What is one idea from “${post.title}” you could apply to your goal?`,
  }));

  const path = await LearningPath.create({
    title: `${hub.name}: ${goal.trim()}`,
    description: `A focused reading path to help you make progress toward ${goal.trim()}.`,
    goal: goal.trim(),
    techHub: techHubId,
    steps,
    difficulty,
    estimatedMinutes: posts.reduce(
      (total, post) => total + (post.readTime || 1),
      0,
    ),
    createdBy: req.user._id,
  });

  const populatedPath = await populatePath(LearningPath.findById(path._id));
  return res
    .status(201)
    .json(
      new ApiResponse(201, populatedPath, "Learning path created successfully"),
    );
});

const getMyLearningPaths = asyncHandler(async (req, res) => {
  const progress = await PathProgress.find({ user: req.user._id })
    .sort({ updatedAt: -1 })
    .populate({
      path: "path",
      match: { status: "published" },
      populate: { path: "techHub", select: "name slug" },
    });

  return res.status(200).json(
    new ApiResponse(
      200,
      progress.filter((item) => item.path),
      "Your learning paths fetched successfully",
    ),
  );
});

const updatePathProgress = asyncHandler(async (req, res) => {
  const { pathId } = req.params;
  const { stepId, completed = true } = req.body;
  const path = await LearningPath.findOne({ _id: pathId, status: "published" });

  if (!path) throw new ApiError(404, "Learning path not found");
  if (!stepId || !path.steps.some((step) => step.post.toString() === stepId)) {
    throw new ApiError(400, "Step does not belong to this learning path");
  }

  let progress = await PathProgress.findOne({
    user: req.user._id,
    path: pathId,
  });
  if (!progress)
    progress = new PathProgress({ user: req.user._id, path: pathId });

  const stepIndex = path.steps.findIndex(
    (step) => step.post.toString() === stepId,
  );
  const completedSet = new Set(
    progress.completedSteps.map((id) => id.toString()),
  );

  if (completed) completedSet.add(stepId);
  else completedSet.delete(stepId);

  progress.completedSteps = path.steps
    .filter((step) => completedSet.has(step.post.toString()))
    .map((step) => step.post);
  progress.currentStep = path.steps.findIndex(
    (step) => !completedSet.has(step.post.toString()),
  );
  if (progress.currentStep === -1) progress.currentStep = path.steps.length;
  progress.completedAt =
    progress.completedSteps.length === path.steps.length
      ? progress.completedAt || new Date()
      : null;

  await progress.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        progress,
        completedStepIndex: stepIndex,
        totalSteps: path.steps.length,
      },
      "Learning path progress updated",
    ),
  );
});

const getPathProgress = asyncHandler(async (req, res) => {
  const path = await LearningPath.findOne({
    _id: req.params.pathId,
    status: "published",
  });
  if (!path) throw new ApiError(404, "Learning path not found");

  const progress = await PathProgress.findOne({
    user: req.user._id,
    path: path._id,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      progress || {
        user: req.user._id,
        path: path._id,
        completedSteps: [],
        currentStep: 0,
        completedAt: null,
      },
      "Learning path progress fetched",
    ),
  );
});

module.exports = {
  listLearningPaths,
  getLearningPath,
  createLearningPath,
  getMyLearningPaths,
  updatePathProgress,
  getPathProgress,
};
