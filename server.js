require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const postRoutes = require("./routes/postRoutes");
const replyRoutes = require("./routes/replyRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const likeRoutes = require("./routes/likeRoutes");
const DATABASE_URL = process.env.DATABASE_URL;
const cluster = require("cluster");
const os = require("os");

const app = express();
const cpuNum = os.cpus().length;

app.use(express.json());
app.use(cors());

// if (cluster.isMaster) {
//   for (let i = 0; i < cpuNum; i++) {
//     cluster.fork();
//   }

//   cluster.on("exit", (worker, code, signal) => {
//     console.log(`worker with pid ${worker.process.pid} died`);
//     cluster.fork();
//   });
// } else {
//   app.listen(4000, () => {
//     console.log(`Server running on ${process.pid} @ 4000`);
//   });
// }

// Connect to MongoDB Atlas
mongoose
  .connect(DATABASE_URL)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Error connecting to MongoDB Atlas:", err));

// Use routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/replies", replyRoutes);
app.use("/likes", likeRoutes);

app.listen(4000, () => {
  console.log(`Server running on ${process.pid} @ 4000`);
});
