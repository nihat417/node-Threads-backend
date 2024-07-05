const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const User = require("../models/user");
const {
  authenticateAccessToken,
} = require("../middleware/authenticateAccessToken");

// Get user's all posts
router.get("/", authenticateAccessToken, async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.user });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all posts
router.get("/all", authenticateAccessToken, async (req, res) => {
  try {
    const myUser = await User.find({ _id: req.user });
    const follows = myUser[0].follows;
    let posts = [];

    follows.map(async (user, index) => {
      const userPosts = await Post.find({ userId: user.toString() });
      posts = [...posts, ...userPosts];
      index === follows.length - 1 && res.json(posts)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// // Get post by ID
router.get("/post/:id", authenticateAccessToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.json(post);
  } catch (err) {
    res.status(404).json({ message: "blog not found" });
  }
});

// Get all your posts
router.get("/me", authenticateAccessToken, async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.user });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get your post by ID
router.get("/me/:id", authenticateAccessToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.json(post);
  } catch (err) {
    res.status(404).json({ message: "blog not found" });
  }
});

// Create a new post
router.post("/create", authenticateAccessToken, async (req, res) => {
  const post = new Post({
    textContent: req.body.textContent,
    image: !req.body.video ? req.body.image : null,
    video: !req.body.image ? req.body.video : null,
    userId: req.user,
  });
  try {
    const newpost = await post.save();
    res.status(201).json(newpost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete post
router.delete("/delete/:id", authenticateAccessToken, async (req, res) => {
  try {
    const status = await Post.findByIdAndDelete(req.params.id);
    res.json(status ? "Successfully deleted" : "Error happened");
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

// Edit post
router.put("/edit/:id", authenticateAccessToken, async (req, res) => {
  try {
    const status = await Post.findByIdAndUpdate(req.params.id, {
      textContent: req.body.textContent,
      image: req.body.image,
      video: req.body.video,
    });
    res.json(status ? "Successfully Updated" : "error happened");
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Search for post
router.get("/search/:searchTerm", authenticateAccessToken, async (req, res) => {
  try {
    const searchTerm = req.params.searchTerm;
    const results = await Post.find({
      textContent: { $regex: searchTerm, $options: "i" },
    });

    res.json(results);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Search by mention
router.get("/search/mentions/me", authenticateAccessToken, async (req, res) => {
  try {
    const user = await User.find({ _id: req.user });
    const nameSurname = `${user[0].firstname} ${user[0].lastname}`;
    const results = await Post.find({
      textContent: { $regex: `@${nameSurname}`, $options: "i" },
    });

    res.json(results);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
