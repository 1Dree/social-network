const jwt = require("jsonwebtoken");

const userCoreData = userData => {
  return {
    _id: userData._id,
    email: userData.email,
  };
};

const userResponseData = userData => ({
  _id: userData._id,
  login: {
    email: userData.login.email,
    name: userData.login.name,
    profile: userData.login.profile,
  },
});

const generateAccessToken = token => {
  return jwt.sign({ token }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30m",
  });
};

const generateRefreshToken = token => {
  return jwt.sign({ token }, process.env.REFRESH_TOKEN_SECRET);
};

module.exports = {
  userCoreData,
  generateAccessToken,
  generateRefreshToken,
  userResponseData,
};
