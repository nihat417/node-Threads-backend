const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  nickname: { type: String, required: true },
  bio: { type: String, required: false },
  link: { type: String, required: false },
  email: { type: String, required: true },
  profilePicture: {
    type: String,
    required: false,
    default:
      "https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg",
  },
  posts: { type: Array, required: false },
  replies: { type: Array, required: false },
  likes: { type: Array, required: false },
  follows: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  followers: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  passwordHash: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
