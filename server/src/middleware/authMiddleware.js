const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
  // const authHeader = req.headers.authorization;

  const token = req.cookies["token-scoutflo"];
  if (token) {
    // const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.log(err);
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { authenticateJWT };
