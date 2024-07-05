const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  timestamp: { type: String, require: true, default: Date.now() },
  postID: { type: mongoose.Schema.ObjectId, ref: "Post", required: true },
  userID: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
});

const Like = mongoose.model("Like", likeSchema);

module.exports = Like;
