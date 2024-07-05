const express = require("express");
const router = express.Router();
const User = require("../models/user");
const {
  authenticateAccessToken,
} = require("../middleware/authenticateAccessToken");
const mongoose = require("mongoose");

// Get user
router.get("/user/:id", authenticateAccessToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get personal info
router.get("/me", authenticateAccessToken, async (req, res) => {
  try {
    const user = await User.findById(req.user);

    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Edit user
router.put("/edit", authenticateAccessToken, async (req, res) => {
  const userId = req.user;

  try {
    const status = await User.findByIdAndUpdate(userId, {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      bio: req.body.bio,
      nickname: req.body.nickname,
      link: req.body.link,
      profilePicture: req.body.profilePicture,
      email: req.body.email,
      followers: req.body.followers,
      follows: req.body.follows,
    });

    res.json(status ? "Successfully Updated" : "error happened");
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Follow a user
router.post("/follow", authenticateAccessToken, async (req, res) => {
  const userToFollowId = req.body.userToFollowId;
  try {
    if (userToFollowId != req.user) {
      await User.updateOne(
        { _id: req.user },
        { $addToSet: { follows: userToFollowId } }
      );
      await User.updateOne(
        { _id: userToFollowId },
        { $addToSet: { followers: req.user } }
      );
    } else {
      res.status(401).json({ message: "You can't follow you own account" });
    }

    res.status(201).json({ message: "Successfully following user" });
  } catch (error) {
    console.error(error);
  }
});

// Unfollow a user
router.post("/unfollow", authenticateAccessToken, async (req, res) => {
  const userToUnfollowId = req.body.userToUnfollowId;

  try {
    if (userToUnfollowId != req.user) {
      await User.updateOne(
        { _id: req.user },
        { $pull: { following: userToUnfollowId } }
      );
      await User.updateOne(
        { _id: userToUnfollowId },
        { $pull: { followers: req.user } }
      );
    } else {
      res.status(401).json({ message: "You can't unfollow you own account" });
    }

    res.status(201).json({ message: "Successfully unfollowed user" });
  } catch (error) {
    console.error(error);
  }
});

// Search for user
router.get("/search/:searchTerm", authenticateAccessToken, async (req, res) => {
  try {
    const searchTerm = req.params.searchTerm;
    const results = await User.find({
      $or: [
        { firstname: { $regex: searchTerm, $options: "i" } },
        { lastname: { $regex: searchTerm, $options: "i" } },
        { nickname: { $regex: searchTerm, $options: "i" } },
      ],
    });

    res.json(results);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Export the router
module.exports = router;
