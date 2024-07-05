const express = require("express");
const router = express.Router();
const {
  authenticateAccessToken,
} = require("../middleware/authenticateAccessToken");
const Reply = require("../models/reply");
const Post = require("../models/post");

// Get replies by post id
router.get("/reply/:postId", async (req, res) => {
  try {
    const replies = await Reply.find({ postId: req.params.postId });
    res.json(replies);
  } catch (err) {
    res.status(404).json({ message: "No replies found for given postId" });
  }
});

// Get all your replies
router.get("/me", authenticateAccessToken, async (req, res) => {
  try {
    const replies = await Reply.find({ userId: req.user });
    res.json(replies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new reply
router.post("/create/:postId", authenticateAccessToken, async (req, res) => {
  const reply = new Reply({
    textContent: req.body.textContent,
    postId: req.params.postId,
    userId: req.user,
  });
  try {
    const newreply = await reply.save();
    // Find the post by postId and update it
    await Post.findByIdAndUpdate(
      req.params.postId,
      { $push: { replies: newreply } },
      { new: true, useFindAndModify: false }
    );
    res.status(201).json("Reply added");
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a reply
router.delete("/delete/:id", authenticateAccessToken, async (req, res) => {
  try {
    const status = await Reply.findByIdAndDelete(req.params.id);
    res.json(status ? "Reply successfully deleted" : "Error happened");
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

// Edit a reply
router.put("/edit/:id", authenticateAccessToken, async (req, res) => {
  try {
    const status = await Reply.findByIdAndUpdate(req.params.id, {
      textContent: req.body.textContent,
    });
    res.json(status ? "Reply successfully updated" : "Error happened");
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Search for reply
router.get("/search/:searchTerm", authenticateAccessToken, async (req, res) => {
  try {
    const searchTerm = req.params.searchTerm;
    const results = await Reply.find({
      textContent: { $regex: searchTerm, $options: "i" },
    });

    res.json(results);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
