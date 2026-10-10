const express = require("express");

const {
    addComment,
    getComments,
    editComment,
    removeComment
} = require("../controllers/commentController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Add a comment to a post
router.post("/posts/:postId/comments", authMiddleware, addComment);

// Get comments for a post
router.get("/posts/:postId/comments", authMiddleware, getComments);

// Edit a comment
router.put("/comments/:commentId", authMiddleware, editComment);

// Delete a comment
router.delete("/comments/:commentId", authMiddleware, removeComment);

module.exports = router;