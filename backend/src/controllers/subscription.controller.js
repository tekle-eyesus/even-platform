const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const Subscription = require("../models/subscriptionModel");
const TechHub = require("../models/techHubModel");
const User = require("../models/UserModel");

// @desc    Toggle Subscription to a Tech Hub (Join/Leave)
// @route   POST /api/v1/subscriptions/hubs/:hubId
// @access  Protected
const toggleHubSubscription = asyncHandler(async (req, res) => {
    const { hubId } = req.params;

    // Check if Hub exists
    const hub = await TechHub.findById(hubId);
    if (!hub) {
        throw new ApiError(404, "Tech Hub not found");
    }

    // Check if already subscribed
    const existingSubscription = await Subscription.findOne({
        subscriber: req.user._id,
        techHub: hubId
    });

    if (existingSubscription) {
        // Unsubscribe
        await Subscription.findByIdAndDelete(existingSubscription._id);

        await TechHub.findByIdAndUpdate(hubId, { $inc: { subscriberCount: -1 } });

        return res.status(200).json(
            new ApiResponse(200, { subscribed: false }, "Unsubscribed from Tech Hub successfully")
        );
    } else {
        await Subscription.create({
            subscriber: req.user._id,
            techHub: hubId
        });

        // Increment subscriber count
        await TechHub.findByIdAndUpdate(hubId, { $inc: { subscriberCount: 1 } });

        return res.status(200).json(
            new ApiResponse(200, { subscribed: true }, "Subscribed to Tech Hub successfully")
        );
    }
});

// @desc    Toggle Subscription to an Author (Follow/Unfollow)
// @route   POST /api/v1/subscriptions/users/:userId
// @access  Protected
const toggleAuthorSubscription = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    //  Prevent subscribing to self
    if (userId.toString() === req.user._id.toString()) {
        throw new ApiError(400, "You cannot subscribe to yourself");
    }

    // Check if Author exists
    const author = await User.findById(userId);
    if (!author) {
        throw new ApiError(404, "Author not found");
    }

    // Check if already subscribed
    const existingSubscription = await Subscription.findOne({
        subscriber: req.user._id,
        channel: userId
    });

    if (existingSubscription) {
        // Unsubscribe
        await Subscription.findByIdAndDelete(existingSubscription._id);

        return res.status(200).json(
            new ApiResponse(200, { subscribed: false }, "Unfollowed author successfully")
        );
    } else {
        // Subscribe
        await Subscription.create({
            subscriber: req.user._id,
            channel: userId
        });

        return res.status(200).json(
            new ApiResponse(200, { subscribed: true }, "Followed author successfully")
        );
    }
});

// @desc    Get list of Hubs the current user follows
// @route   GET /api/v1/subscriptions/me/hubs
// @access  Protected
const getMySubscribedHubs = asyncHandler(async (req, res) => {
    const subscriptions = await Subscription.find({ subscriber: req.user._id, techHub: { $exists: true } })
        .populate("techHub", "name slug description image subscriberCount");

    const hubs = subscriptions.map(sub => sub.techHub);

    return res.status(200).json(
        new ApiResponse(200, hubs, "Subscribed hubs fetched successfully")
    );
});

// @desc    Get list of Authors the current user follows
// @route   GET /api/v1/subscriptions/me/authors
// @access  Protected
const getMySubscribedAuthors = asyncHandler(async (req, res) => {
    const subscriptions = await Subscription.find({ subscriber: req.user._id, channel: { $exists: true } })
        .populate("channel", "fullName username avatar role");

    const authors = subscriptions.map(sub => sub.channel);

    return res.status(200).json(
        new ApiResponse(200, authors, "Following list fetched successfully")
    );
});

module.exports = {
    toggleHubSubscription,
    toggleAuthorSubscription,
    getMySubscribedHubs,
    getMySubscribedAuthors
};