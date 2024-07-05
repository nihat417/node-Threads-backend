const User = require("../models/user");

// Middleware for checking follow list
function follows(req, res, next) {
  const searchCriteria = { userId: req.user };
  // const myUser = User.find({ id: req.user });
  console.log(User.find({ follows: { $elemMatch: searchCriteria } }));

  // if (!isFollowing) {
  //   return res.sendStatus(403);
  // }

  next();
}

module.exports.follows = follows;
