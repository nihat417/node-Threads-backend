const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  textContent: { type: String, required: false },
  image: { type: String, require: false },
  video: { type: String, require: false },
  replies: { type: Array, required: false },
  likes: { type: Array, required: false },
  userId: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  timestamp: { type: String, require: true },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
