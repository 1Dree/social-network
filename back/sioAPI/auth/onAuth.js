const jwt = require("jsonwebtoken");
const renewAccess = require("./renewAccess");

const onAuth = io => handler => async req => {
  try {
    jwt.verify(req.header.auth.tokens.access, process.env.ACCESS_TOKEN_SECRET);

    const refreshToken = req.header.auth.tokens.refresh;

    if (refreshToken) {
      const result = await renewAccess(refreshToken, req.header.auth.userId);

      if (result.err) throw new Error(result.err);

      handler(req, result);
      return;
    }

    handler(req);
  } catch (err) {
    console.log(err);
    io.to(req.header.senderRoom).emit("error", err.message);
  }
};

module.exports = onAuth;
