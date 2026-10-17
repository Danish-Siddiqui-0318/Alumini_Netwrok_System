
const express = require("express");

const {
    getAllUsers,
    verifyUser,
    removePost
} = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// Every route requires authentication AND admin authorization.
router.use(authMiddleware, adminMiddleware);

router.get("/users", getAllUsers);
router.put("/users/:userId/verify", verifyUser);
router.delete("/posts/:postId", removePost);

module.exports = router;
