const express = require("express");

const {
    getAlumni,
    searchUsers
} = require("../controllers/directoryController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get all alumni
router.get("/alumni", authMiddleware, getAlumni);

// Search users by name
router.get("/search", authMiddleware, searchUsers);

module.exports = router;