const express = require("express");
const router = express.Router();
const {
  authenticateAccessToken,
} = require("../middleware/authenticateAccessToken");
const Like = require("../models/like");
const Post = require("../models/post");

// Get likes by post id
router.get("/:id", async (req, res) => {
  try {
    const replies = await Like.findById(req.params.id);
    res.json(replies);
  } catch (err) {
    res.status(404).json({ message: "No likes found for given postId" });
  }
});

// Create a new like
router.post("/create/:postId", authenticateAccessToken, async (req, res) => {
  const like = new Like({
    postID: req.params.postId,
    userID: req.user,
  });
  try {
    const newlike = await like.save();
    // Find the post by postId and update it
    await Post.findByIdAndUpdate(
      req.params.postId,
      { $push: { likes: newlike } },
      { new: true, useFindAndModify: false }
    );
    res.status(201).json("Like added");
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a like
router.delete("/delete/:id", authenticateAccessToken, async (req, res) => {
  try {
    const status = await Like.findByIdAndDelete(req.params.id);
    res.json(status ? "Reply successfully deleted" : "Error happened");
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

module.exports = router;
