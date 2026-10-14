const express = require("express");

const {
    likePost,
    unlikePost,
    getLikeStatus
} = require("../controllers/likeController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Like a post
router.post(
    "/posts/:postId/like",
    authMiddleware,
    likePost
);

// Unlike a post
router.delete(
    "/posts/:postId/like",
    authMiddleware,
    unlikePost
);

// Check like status
router.get(
    "/posts/:postId/like",
    authMiddleware,
    getLikeStatus
);

module.exports = router;