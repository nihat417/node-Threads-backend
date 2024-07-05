const jwt = require("jsonwebtoken");

// Helper function to generate access token
const generateAccessToken = (user) => {
  return jwt.sign(
    { email: user.email, id: user.id },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "5m",
    }
  );
};

module.exports = generateAccessToken;
