const {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost: deletePostById
} = require("../models/postModel");

const cloudinary = require("../config/cloudinary");

// Upload an image buffer to Cloudinary
const uploadImage = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "alumni_network/posts",
                resource_type: "image"
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }

                resolve(result);
            }
        );

        stream.end(buffer);
    });
};

// Create a post
const addPost = async (req, res) => {
    try {
        const userId = req.user.userId;
        const {content} = req.body;

        if (typeof content !== "string" || !content.trim()) {
            return res.status(400).json({
                message: "Post content is required"
            });
        }

        let imageUrl = null;

        if (req.file) {
            const uploadResult = await uploadImage(req.file.buffer);
            imageUrl = uploadResult.secure_url;
        }

        const postId = await createPost(
            userId,
            content.trim(),
            imageUrl
        );

        return res.status(201).json({
            message: "Post created successfully",
            post_id: postId,
            image_url: imageUrl
        });
    } catch (error) {
        console.error("Create post error:", error);

        return res.status(500).json({
            message: "Failed to create post"
        });
    }
};

// Get all posts
const getPosts = async (req, res) => {
    try {
        const posts = await getAllPosts();

        return res.status(200).json({
            count: posts.length,
            posts
        });
    } catch (error) {
        console.error("Get posts error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

// Edit a post; an image is optional
const editPost = async (req, res) => {
    try {
        const postId = Number(req.params.postId);
        const userId = req.user.userId;
        const {content} = req.body;

        if (!Number.isInteger(postId) || postId <= 0) {
            return res.status(400).json({
                message: "Invalid post ID"
            });
        }

        if (typeof content !== "string" || !content.trim()) {
            return res.status(400).json({
                message: "Post content is required"
            });
        }

        const post = await getPostById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        if (Number(post.user_id) !== Number(userId)) {
            return res.status(403).json({
                message: "You can only edit your own posts"
            });
        }

        // Keep the existing image unless a replacement is uploaded.
        let imageUrl = post.image_url;

        if (req.file) {
            const uploadResult = await uploadImage(req.file.buffer);
            imageUrl = uploadResult.secure_url;
        }

        await updatePost(postId, content.trim(), imageUrl);

        return res.status(200).json({
            message: "Post updated successfully",
            image_url: imageUrl
        });
    } catch (error) {
        console.error("Update post error:", error);

        return res.status(500).json({
            message: "Failed to update post"
        });
    }
};

// Delete a post
const removePost = async (req, res) => {
    try {
        const postId = Number(req.params.postId);
        const userId = req.user.userId;

        if (!Number.isInteger(postId) || postId <= 0) {
            return res.status(400).json({
                message: "Invalid post ID"
            });
        }

        const post = await getPostById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        if (Number(post.user_id) !== Number(userId)) {
            return res.status(403).json({
                message: "You can only delete your own posts"
            });
        }

        const deletedRows = await deletePostById(postId);

        if (!deletedRows) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        return res.status(200).json({
            message: "Post deleted successfully"
        });
    } catch (error) {
        console.error("Delete post error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    addPost,
    getPosts,
    editPost,
    removePost
};