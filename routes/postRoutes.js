const express = require("express");

const {
    addPost,
    getPosts,
    editPost,
    removePost
} = require("../controllers/postController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    upload.single("image"),
    addPost
);

router.get("/", authMiddleware, getPosts);

router.put(
    "/:postId",
    authMiddleware,
    upload.single("image"),
    editPost
);

router.delete("/:postId", authMiddleware, removePost);

module.exports = router;