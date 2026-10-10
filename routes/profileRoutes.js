const express = require("express");

const {
    getMyProfile,
    saveMyProfile,
    getPublicProfile
} = require("../controllers/profileController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get the logged-in user's profile
router.get("/me", authMiddleware, getMyProfile);

// Create or update the logged-in user's profile
router.put("/me", authMiddleware, saveMyProfile);

// View another user's public profile
router.get("/:userId", authMiddleware, getPublicProfile);

module.exports = router;