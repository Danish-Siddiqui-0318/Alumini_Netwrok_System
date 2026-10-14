const express = require("express");

const {
    addJob,
    getJobs,
    getJobDetails,
    editJob,
    removeJob
} = require("../controllers/jobController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, addJob);
router.get("/", authMiddleware, getJobs);
router.get("/:jobId", authMiddleware, getJobDetails);
router.put("/:jobId", authMiddleware, editJob);
router.delete("/:jobId", authMiddleware, removeJob);

module.exports = router;