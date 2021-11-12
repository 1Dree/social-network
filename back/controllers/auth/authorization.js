const jwt = require("jsonwebtoken");

module.exports = async function authorization(req, res, next) {
  const authorization = req.headers["authorization"];
  const accessToken = authorization && authorization.split(" ")[1];
  if (!authorization || !accessToken) return res.sendStatus(401);

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
    if (err) return res.status(403).json(err.message);

    req.user = data;

    next();
  });
};
