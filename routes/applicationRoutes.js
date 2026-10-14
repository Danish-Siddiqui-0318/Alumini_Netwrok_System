const express = require("express");

const {
    applyForJob,
    getJobApplications,
    getMyApplications,
    editApplicationStatus,
    withdrawApplication
} = require("../controllers/applicationController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/jobs/:jobId/apply",
    authMiddleware,
    applyForJob
);

router.get(
    "/jobs/:jobId/applications",
    authMiddleware,
    getJobApplications
);

router.get(
    "/applications/my",
    authMiddleware,
    getMyApplications
);

router.put(
    "/applications/:applicationId/status",
    authMiddleware,
    editApplicationStatus
);

router.delete(
    "/applications/:applicationId",
    authMiddleware,
    withdrawApplication
);

module.exports = router;