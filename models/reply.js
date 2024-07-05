const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
  textContent: { type: String, require: true },
  postId: { type: mongoose.Schema.ObjectId, ref: "Post", required: true },
  userId: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  timestamp: { type: String, require: true, default: Date.now() },
});

const Reply = mongoose.model("Reply", replySchema);

module.exports = Reply;
